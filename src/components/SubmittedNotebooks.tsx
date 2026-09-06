import React, { useState, useEffect, useCallback } from 'react';
import { SubmittedNotebook } from '../types';
import { BookOpen, ExternalLink, Plus, Search, User, Award, CheckCircle, Info, Sparkles, X, Lock, Unlock, Trash2, Loader2, AlertTriangle, Shield } from 'lucide-react';
import GeminiNotebookName from './GeminiNotebookName';

import localNotebooks from '@/data/notebooks.json';

// ─── Constants ───────────────────────────────────────────────────────────────

const FALLBACK_NOTEBOOKS: SubmittedNotebook[] = localNotebooks as SubmittedNotebook[];

const EXAM_SECTIONS: Array<{
  id: SubmittedNotebook['examId'];
  label: string;
  chapters: string;
  accent: string;
}> = [
  { id: 'exam1', label: 'Lecture Exam 1', chapters: 'Chapters 13–15', accent: 'bg-[#8B5CF6]' },
  { id: 'exam2', label: 'Lecture Exam 2', chapters: 'Chapters 16 & 19', accent: 'bg-[#F472B6]' },
  { id: 'exam3', label: 'Lecture Exam 3', chapters: 'Chapters 17–18', accent: 'bg-[#FBBF24]' },
  { id: 'exam4', label: 'Lecture Exam 4', chapters: 'Chapters 20–21', accent: 'bg-[#34D399]' },
  { id: 'exam5', label: 'Lecture Exam 5', chapters: 'Chapters 22–24', accent: 'bg-[#8B5CF6]' }
];

const API_BASE = '/api/notebooks';

// ─── Component ───────────────────────────────────────────────────────────────

export default function SubmittedNotebooks() {
  // Data
  const [notebooks, setNotebooks] = useState<SubmittedNotebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedExamTab, setSelectedExamTab] = useState<'exam1' | 'exam2' | 'exam3' | 'exam4' | 'exam5'>('exam1');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [examId, setExamId] = useState<'exam1' | 'exam2' | 'exam3' | 'exam4' | 'exam5'>('exam1');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const renderNotebookTitle = (notebookTitle: string) => {
    const titleParts = notebookTitle.split(/Notebook\s*LM/i);
    return titleParts.map((part, index) => (
      <React.Fragment key={`${part}-${index}`}>
        {part}
        {index < titleParts.length - 1 && <GeminiNotebookName />}
      </React.Fragment>
    ));
  };

  const getCachedPassword = (): string | null => {
    try { return sessionStorage.getItem('admin_password'); } catch { return null; }
  };

  const setCachedPassword = (pw: string) => {
    try { sessionStorage.setItem('admin_password', pw); } catch { /* noop */ }
  };

  const clearCachedPassword = () => {
    try { sessionStorage.removeItem('admin_password'); } catch { /* noop */ }
  };

  // ── API calls ────────────────────────────────────────────────────────────

  const fetchNotebooks = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data: SubmittedNotebook[] = await res.json();
      const combined = Array.isArray(data) ? [...data] : [];
      FALLBACK_NOTEBOOKS.forEach(fallback => {
        if (!combined.some(n => n.url === fallback.url || n.id === fallback.id)) {
          combined.push(fallback);
        }
      });
      setNotebooks(combined);
      // Cache locally as fallback
      localStorage.setItem('biol2402_notebooks', JSON.stringify(combined));
    } catch (err: any) {
      console.warn('[SubmittedNotebooks] API fetch failed, using fallback:', err.message);
      // Fallback to localStorage or seed data
      const saved = localStorage.getItem('biol2402_notebooks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const combined = Array.isArray(parsed) ? [...parsed] : [];
          FALLBACK_NOTEBOOKS.forEach(fallback => {
            if (!combined.some(n => n.url === fallback.url || n.id === fallback.id)) {
              combined.push(fallback);
            }
          });
          setNotebooks(combined);
        } catch {
          setNotebooks(FALLBACK_NOTEBOOKS);
        }
      } else {
        setNotebooks(FALLBACK_NOTEBOOKS);
      }
      setLoadError('Could not reach the server. Showing cached data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyAdmin = async (password: string): Promise<boolean> => {
    if (!password) return false;
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ action: 'verify' }),
      });
      // 200 = correct password (Vercel)
      // 401 = wrong password
      // 404 = API not running locally (vite dev) — allow UI access;
      //       the actual save call will enforce auth via 401 on Vercel
      if (res.status === 404) return true;
      return res.ok;
    } catch {
      return false;
    }
  };

  const saveNotebooks = async (updatedNotebooks: SubmittedNotebook[], commitMessage: string): Promise<boolean> => {
    const pw = adminPassword || getCachedPassword();
    if (!pw) return false;

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': pw,
        },
        body: JSON.stringify({
          action: 'save',
          notebooks: updatedNotebooks,
          commitMessage,
        }),
      });

      if (res.status === 401) {
        setIsAdmin(false);
        clearCachedPassword();
        setFormError('Admin session expired. Please log in again.');
        return false;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }

      return true;
    } catch (err: any) {
      setFormError(err.message || 'Failed to save. Please try again.');
      return false;
    }
  };

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchNotebooks();

    // Restore admin session
    const cached = getCachedPassword();
    if (cached) {
      verifyAdmin(cached).then(ok => {
        if (ok) {
          setIsAdmin(true);
          setAdminPassword(cached);
        } else {
          clearCachedPassword();
        }
      });
    }
  }, [fetchNotebooks]);

  // ── Admin login ──────────────────────────────────────────────────────────

  const handleAdminLogin = async () => {
    setLoginError('');
    setLoginLoading(true);
    const pw = adminPassword.trim();

    if (!pw) {
      setLoginError('Please enter the admin password.');
      setLoginLoading(false);
      return;
    }

    const ok = await verifyAdmin(pw);
    if (ok) {
      setIsAdmin(true);
      setCachedPassword(pw);
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('Invalid admin password. Contact Dr. Garcia Martinez.');
    }
    setLoginLoading(false);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword('');
    clearCachedPassword();
    setIsFormOpen(false);
  };

  // ── Form submit ──────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!title.trim() || !url.trim() || !author.trim() || !topic.trim()) {
      setFormError('Please fill in all required fields marked with *.');
      return;
    }

    let validUrl = url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }
    try { new URL(validUrl); } catch {
      setFormError('Please provide a valid URL.');
      return;
    }

    const newNotebook: SubmittedNotebook = {
      id: 'notebook-' + Date.now(),
      title: title.trim(),
      url: validUrl,
      author: author.trim(),
      role,
      examId,
      topic: topic.trim(),
      description: description.trim() || 'No description provided.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newNotebook, ...notebooks];

    setIsSaving(true);
    const commitMsg = `📓 Add notebook: "${newNotebook.title}" by ${newNotebook.author}`;
    const success = await saveNotebooks(updatedList, commitMsg);

    if (success) {
      setNotebooks(updatedList);
      localStorage.setItem('biol2402_notebooks', JSON.stringify(updatedList));
      setTitle(''); setUrl(''); setAuthor(''); setTopic(''); setDescription('');
      setIsFormOpen(false);
      setSuccessMsg('Notebook published and committed to the repository!');
      setTimeout(() => setSuccessMsg(''), 5000);
    }
    setIsSaving(false);
  };

  // ── Delete notebook ──────────────────────────────────────────────────────

  const handleDelete = async (notebookId: string) => {
    const target = notebooks.find(nb => nb.id === notebookId);
    if (!target) return;
    if (!confirm(`Delete "${target.title}" by ${target.author}? This will commit the change to GitHub.`)) return;

    const updatedList = notebooks.filter(nb => nb.id !== notebookId);
    setIsSaving(true);
    const commitMsg = `🗑️ Remove notebook: "${target.title}" by ${target.author}`;
    const success = await saveNotebooks(updatedList, commitMsg);

    if (success) {
      setNotebooks(updatedList);
      localStorage.setItem('biol2402_notebooks', JSON.stringify(updatedList));
      setSuccessMsg(`"${target.title}" removed and committed.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setIsSaving(false);
  };

  // ── Filtering & grouping ────────────────────────────────────────────────

  // ── Filtering for selected Exam Page ──────────────────────────────────────

  const currentExamSection = EXAM_SECTIONS.find(s => s.id === selectedExamTab) || EXAM_SECTIONS[0];

  const examNotebooks = notebooks
    .filter(nb => nb.examId === selectedExamTab)
    .filter(nb => {
      const matchesSearch =
        nb.title.toLowerCase().includes(search.toLowerCase()) ||
        nb.author.toLowerCase().includes(search.toLowerCase()) ||
        nb.topic.toLowerCase().includes(search.toLowerCase()) ||
        nb.description.toLowerCase().includes(search.toLowerCase());
      const matchesRole = filterRole === 'all' || nb.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((first, second) => first.author.localeCompare(second.author));


  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <section className="bg-transparent py-6 text-[#1E293B]" id="notebooks-delivery-section">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1E293B] mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#8B5CF6] font-display text-xs uppercase tracking-wider font-extrabold mb-1">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span>Volume II &bull; Delivered Intellectual Assets</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#1E293B] leading-none">
              Class <GeminiNotebookName /> Repository
            </h2>
            <p className="text-[#64748B] text-sm mt-2 max-w-xl font-medium leading-relaxed">
              Access the master Google <GeminiNotebookName /> study environments developed by Dr. Garcia Martinez
              and peer researchers. {isAdmin ? 'Admin mode active — you can add or remove notebooks.' : 'Log in as admin to manage entries.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            {/* Admin toggle */}
            {isAdmin ? (
              <>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="candy-button inline-flex items-center gap-2 text-xs py-3.5 px-6 cursor-pointer uppercase"
                >
                  <Plus className="w-4.5 h-4.5 text-white stroke-[3px]" />
                  <span>Submit Notebook</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="inline-flex items-center gap-2 px-4 py-3.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] hover:bg-red-50 text-[#1E293B] font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  title="Logout from admin"
                >
                  <Unlock className="w-4 h-4 text-[#34D399]" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 border-2 border-[#1E293B] rounded-xl bg-white hover:bg-[#8B5CF6] hover:text-white text-[#1E293B] font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_0px_#1E293B] hover:shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-1px]"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Lecture Exam Page Tabs (Separated Pages) ───────────────────── */}
        <nav className="flex flex-wrap gap-3 mb-8">
          {EXAM_SECTIONS.map(section => {
            const isSelected = selectedExamTab === section.id;
            const count = notebooks.filter(n => n.examId === section.id).length;
            return (
              <button
                key={section.id}
                onClick={() => setSelectedExamTab(section.id)}
                className={`inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl border-2 border-[#1E293B] font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-white shadow-[4px_4px_0px_0px_#1E293B] translate-y-[-2px]'
                    : 'bg-white text-[#1E293B] hover:bg-[#FFFDF5] hover:shadow-[2px_2px_0px_0px_#1E293B]'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border-2 border-[#1E293B] ${section.accent}`} />
                <span>{section.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border border-[#1E293B] font-black ${
                  isSelected ? 'bg-white text-[#1E293B]' : 'bg-[#FFFDF5] text-[#8B5CF6]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Admin Login Modal ──────────────────────────────────────────── */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-8 shadow-[8px_8px_0px_0px_#8B5CF6] max-w-md w-full relative">
              <button
                onClick={() => { setShowLoginModal(false); setLoginError(''); setAdminPassword(''); }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-[#1E293B] hover:bg-gray-100 flex items-center justify-center text-[#1E293B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center shadow-[3px_3px_0px_0px_#1E293B]">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-black text-[#1E293B]">Admin Access</h3>
                  <p className="text-xs text-[#64748B] font-bold">Enter the admin password to manage notebooks</p>
                </div>
              </div>

              {loginError && (
                <div className="bg-[#F472B6]/15 border-2 border-[#F472B6] text-[#1E293B] text-xs font-bold p-3.5 rounded-xl mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F472B6] shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder="Enter admin password..."
                    className="w-full px-4 py-3 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm font-medium"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleAdminLogin}
                  disabled={loginLoading}
                  className="w-full candy-button inline-flex items-center justify-center gap-2 text-xs py-3.5 px-6 cursor-pointer uppercase disabled:opacity-50"
                >
                  {loginLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>Verifying...</span></>
                  ) : (
                    <><Lock className="w-4 h-4" /> <span>Authenticate</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Success Alert ─────────────────────────────────────────────── */}
        {successMsg && (
          <div className="bg-[#34D399] border-4 border-[#1E293B] p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-[4px_4px_0px_0px_#1E293B] text-[#1E293B] font-bold">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-display">{successMsg}</span>
          </div>
        )}

        {/* ── Offline / API error banner ─────────────────────────────────── */}
        {loadError && (
          <div className="bg-[#FBBF24]/20 border-4 border-[#FBBF24] p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-[4px_4px_0px_0px_#1E293B] text-[#1E293B] font-bold">
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#FBBF24]" />
            <span className="text-sm font-display">{loadError}</span>
          </div>
        )}

        {/* ── Submission Form (admin only) ──────────────────────────────── */}
        {isFormOpen && isAdmin && (
          <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#8B5CF6] mb-10 max-w-2xl mx-auto relative">
            <div className="flex items-center justify-between border-b-4 border-[#1E293B] pb-4 mb-6">
              <h3 className="text-xl font-display font-black text-[#1E293B] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#F472B6]" />
                <span>Deliver Your <GeminiNotebookName /> Link</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-[#1E293B] hover:bg-gray-100 flex items-center justify-center text-[#1E293B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <p className="bg-[#F472B6]/15 border-2 border-[#F472B6] text-[#1E293B] text-xs font-bold p-3.5 rounded-xl mb-4">
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-sm font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                    Scholar Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Victor Garcia Martinez"
                    className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                    Academic Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'instructor')}
                    className="w-full px-3 py-3 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm cursor-pointer font-bold"
                  >
                    <option value="student">Student / Peer Researcher</option>
                    <option value="instructor">Instructor / Faculty</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                  Google <GeminiNotebookName /> URL *
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://notebooklm.google.com/notebook/..."
                  className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                  Notebook Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Gemini Notebook LM (Blood) - ABO & Rh Transfusion"
                  className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                    Lecture Exam Milestone *
                  </label>
                  <select
                    value={examId}
                    onChange={(e) => setExamId(e.target.value as any)}
                    className="w-full px-3 py-3 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm cursor-pointer font-bold"
                  >
                    <option value="exam1">Lecture Exam 1 (Ch 13, 14, 15)</option>
                    <option value="exam2">Lecture Exam 2 (Ch 16, 19)</option>
                    <option value="exam3">Lecture Exam 3 (Ch 17, 18)</option>
                    <option value="exam4">Lecture Exam 4 (Ch 20, 21)</option>
                    <option value="exam5">Lecture Exam 5 (Ch 22, 23, 24)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                    Core Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Blood Types or Adrenal Zones"
                    className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                  Description / Study Objective
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize what this Notebook covers or which specific learning outcomes it addresses..."
                  rows={3}
                  className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm font-medium"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border-2 border-[#1E293B] rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1E293B] font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="candy-button px-6 py-2.5 text-xs uppercase cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>Committing...</span></>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> <span>Publish & Commit to GitHub</span></>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1E293B] mb-8 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#8B5CF6] stroke-[2.5px]" />
            <input
              type="text"
              placeholder={`Search ${currentExamSection.label} notebooks, scholars, topics...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none text-sm focus:ring-2 focus:ring-[#8B5CF6] placeholder:italic placeholder:text-[#64748B] font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2.5 border-2 border-[#1E293B] rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#1E293B] cursor-pointer font-bold"
            >
              <option value="all">All Roles</option>
              <option value="instructor">Instructors Only</option>
              <option value="student">Students Only</option>
            </select>
          </div>
        </div>

        {/* ── Loading State ─────────────────────────────────────────────── */}
        {isLoading && (
          <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-16 text-center shadow-[4px_4px_0px_0px_#1E293B] mb-8">
            <Loader2 className="w-10 h-10 mx-auto text-[#8B5CF6] animate-spin mb-3" />
            <p className="font-display text-lg text-[#1E293B] font-black">Loading Notebook Repository...</p>
            <p className="text-sm text-[#64748B] font-semibold mt-1">Fetching the latest data from GitHub</p>
          </div>
        )}

        {/* ── Saving Overlay ────────────────────────────────────────────── */}
        {isSaving && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none">
            <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-8 shadow-[8px_8px_0px_0px_#8B5CF6] text-center pointer-events-auto">
              <Loader2 className="w-10 h-10 mx-auto text-[#8B5CF6] animate-spin mb-3" />
              <p className="font-display text-lg text-[#1E293B] font-black">Committing to GitHub...</p>
              <p className="text-sm text-[#64748B] font-semibold mt-1">Saving changes to the repository</p>
            </div>
          </div>
        )}

        {/* ── Dedicated Exam Page Content ─────────────────────────────── */}
        {!isLoading && (
          <section className="bg-white border-4 border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#1E293B]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-4 border-[#1E293B] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-10 rounded-full border-2 border-[#1E293B] ${currentExamSection.accent}`} />
                <div>
                  <h3 className="font-display text-2xl font-black text-[#1E293B]">{currentExamSection.label}</h3>
                  <p className="text-xs font-bold text-[#64748B]">{currentExamSection.chapters}</p>
                </div>
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-wider text-[#1E293B] bg-[#FFFDF5] border-2 border-[#1E293B] rounded-full px-3 py-1.5">
                {examNotebooks.length} {examNotebooks.length === 1 ? 'notebook on this page' : 'notebooks on this page'}
              </span>
            </div>

            {examNotebooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {examNotebooks.map(notebook => {
                  const isInstructor = notebook.role === 'instructor';

                  return (
                    <article key={notebook.id} className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-xl p-5 flex flex-col justify-between gap-5 shadow-[3px_3px_0px_0px_#1E293B] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#1E293B] transition-all relative group">
                      {/* Admin delete button */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(notebook.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 border-2 border-red-300 hover:bg-red-100 hover:border-red-500 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                          title="Delete this notebook"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <p className="text-[9px] font-display font-black uppercase tracking-wider text-[#64748B] mb-1">Student / Scholar</p>
                            <p className="font-display font-black text-[#1E293B] leading-tight">{notebook.author}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-display font-black uppercase px-2.5 py-1 rounded-full border-2 border-[#1E293B] ${
                            isInstructor ? 'bg-[#F472B6] text-white' : 'bg-[#34D399] text-[#1E293B]'
                          }`}>
                            {isInstructor ? <Award className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                            <span>{isInstructor ? 'Faculty' : 'Student'}</span>
                          </span>
                        </div>

                        <h4 className="text-base font-display font-extrabold text-[#1E293B] mb-3 leading-snug">
                          {renderNotebookTitle(notebook.title)}
                        </h4>

                        <div className="bg-white rounded-xl p-3.5 border-2 border-[#1E293B] text-xs font-semibold">
                          <p className="font-display text-[#8B5CF6] uppercase tracking-wide text-[9px] mb-1 font-black">Anatomical Objective</p>
                          <p className="text-[#1E293B] font-bold mb-1.5">{notebook.topic}</p>
                          <p className="text-[#64748B] leading-relaxed italic">"{notebook.description}"</p>
                        </div>
                      </div>

                      <a
                        href={notebook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full candy-button inline-flex items-center justify-center gap-2 text-xs py-3 px-4 uppercase cursor-pointer shrink-0"
                      >
                        <ExternalLink className="w-4 h-4 text-white stroke-[3px]" />
                        <span>Launch <GeminiNotebookName /></span>
                      </a>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-[#64748B]">
                <Info className="w-10 h-10 mx-auto text-[#8B5CF6] mb-2 opacity-60" />
                <p className="font-display text-base text-[#1E293B] font-black">No Notebooks Found for {currentExamSection.label}</p>
                <p className="text-xs font-semibold mt-1">Try clearing your search or switching to another Exam page.</p>
              </div>
            )}
          </section>
        )}

      </div>
    </section>
  );
}
