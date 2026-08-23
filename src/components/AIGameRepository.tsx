import React, { useState, useEffect, useCallback } from 'react';
import { SubmittedGame } from '../types';
import { Gamepad2, ExternalLink, Plus, Search, User, Award, CheckCircle, Info, Sparkles, X, Lock, Unlock, Trash2, Loader2, AlertTriangle, Shield } from 'lucide-react';

import localGames from '@/data/games.json';

// ─── Constants ───────────────────────────────────────────────────────────────

const FALLBACK_GAMES: SubmittedGame[] = localGames as SubmittedGame[];

const EXAM_SECTIONS: Array<{
  id: SubmittedGame['examId'];
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

const API_BASE = '/api/games';

// ─── Component ───────────────────────────────────────────────────────────────

export default function AIGameRepository() {
  // Data
  const [games, setGames] = useState<SubmittedGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [filterExam, setFilterExam] = useState<string>('all');
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
  const [examId, setExamId] = useState<'exam1' | 'exam2' | 'exam3' | 'exam4' | 'exam5'>('exam3');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────

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

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data: SubmittedGame[] = await res.json();
      setGames(data);
      localStorage.setItem('biol2402_games', JSON.stringify(data));
    } catch (err: any) {
      console.warn('[AIGameRepository] API fetch failed, using fallback:', err.message);
      const saved = localStorage.getItem('biol2402_games');
      if (saved) {
        try { setGames(JSON.parse(saved)); } catch { setGames(FALLBACK_GAMES); }
      } else {
        setGames(FALLBACK_GAMES);
      }
      setLoadError('Could not reach the server. Showing cached data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ action: 'verify' }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const saveGames = async (updatedGames: SubmittedGame[], commitMessage: string): Promise<boolean> => {
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
          games: updatedGames,
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
    fetchGames();

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
  }, [fetchGames]);

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
      setFormError('Please provide a valid AI Game URL.');
      return;
    }

    const newGame: SubmittedGame = {
      id: 'game-' + Date.now(),
      title: title.trim(),
      url: validUrl,
      author: author.trim(),
      role,
      examId,
      topic: topic.trim(),
      description: description.trim() || 'No description provided.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newGame, ...games];

    setIsSaving(true);
    const commitMsg = `🎮 Add AI Game: "${newGame.title}" by ${newGame.author}`;
    const success = await saveGames(updatedList, commitMsg);

    if (success) {
      setGames(updatedList);
      localStorage.setItem('biol2402_games', JSON.stringify(updatedList));
      setTitle(''); setUrl(''); setAuthor(''); setTopic(''); setDescription('');
      setIsFormOpen(false);
      setSuccessMsg('AI Game published and committed to the repository!');
      setTimeout(() => setSuccessMsg(''), 5000);
    }
    setIsSaving(false);
  };

  // ── Delete game ──────────────────────────────────────────────────────────

  const handleDelete = async (gameId: string) => {
    const target = games.find(g => g.id === gameId);
    if (!target) return;
    if (!confirm(`Delete game "${target.title}" by ${target.author}? This will commit the change to GitHub.`)) return;

    const updatedList = games.filter(g => g.id !== gameId);
    setIsSaving(true);
    const commitMsg = `🗑️ Remove AI Game: "${target.title}" by ${target.author}`;
    const success = await saveGames(updatedList, commitMsg);

    if (success) {
      setGames(updatedList);
      localStorage.setItem('biol2402_games', JSON.stringify(updatedList));
      setSuccessMsg(`"${target.title}" removed and committed.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setIsSaving(false);
  };

  // ── Filtering ───────────────────────────────────────────────────────────

  const filteredGames = games.filter(g => {
    const matchesSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.author.toLowerCase().includes(search.toLowerCase()) ||
      g.topic.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchesExam = filterExam === 'all' || g.examId === filterExam;
    const matchesRole = filterRole === 'all' || g.role === filterRole;
    return matchesSearch && matchesExam && matchesRole;
  });

  return (
    <section className="bg-transparent py-6 text-[#1E293B]" id="games-repository-section">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1E293B] mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#8B5CF6] font-display text-xs uppercase tracking-wider font-extrabold mb-1">
              <Gamepad2 className="w-4 h-4 text-[#8B5CF6]" />
              <span>Interactive Gamification &bull; AI Learning Simulations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#1E293B] leading-none">
              AI Game Repository
            </h2>
            <p className="text-[#64748B] text-sm mt-2 max-w-xl font-medium leading-relaxed">
              Explore interactive AI-driven learning games and clinical simulations built by scholars and Dr. Garcia Martinez.
              {isAdmin ? ' Admin mode active — you can add or remove AI games.' : ' Log in as admin to submit new AI games.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="candy-button inline-flex items-center gap-2 text-xs py-3.5 px-6 cursor-pointer uppercase"
                >
                  <Plus className="w-4.5 h-4.5 text-white stroke-[3px]" />
                  <span>Submit AI Game</span>
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
                  <p className="text-xs text-[#64748B] font-bold">Enter the admin password to manage games</p>
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
                <Gamepad2 className="w-5 h-5 text-[#F472B6]" />
                <span>Submit AI Game Link</span>
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
                    placeholder="e.g. Yetzi Roque"
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
                  AI Game Link (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://metabolab-weight-gender-metabolism-game.ai.studio"
                  className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-[#1E293B] font-display text-xs uppercase tracking-wider mb-1.5 font-extrabold">
                  Game Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Metabolab Weight & Gender Metabolism Game"
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
                    placeholder="e.g. Metabolism & Energy Expenditure"
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
                  placeholder="Explain the interactive rules, anatomical concepts, or learning outcomes target of this AI game..."
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
                    <><Sparkles className="w-4 h-4" /> <span>Publish AI Game</span></>
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
              placeholder="Search games, scholars, metabolism topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none text-sm focus:ring-2 focus:ring-[#8B5CF6] placeholder:italic placeholder:text-[#64748B] font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="px-3 py-2.5 border-2 border-[#1E293B] rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#1E293B] cursor-pointer font-bold"
            >
              <option value="all">All Milestones</option>
              <option value="exam1">Lecture Exam 1</option>
              <option value="exam2">Lecture Exam 2</option>
              <option value="exam3">Lecture Exam 3</option>
              <option value="exam4">Lecture Exam 4</option>
              <option value="exam5">Lecture Exam 5</option>
            </select>

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
            <p className="font-display text-lg text-[#1E293B] font-black">Loading AI Game Repository...</p>
          </div>
        )}

        {/* ── Saving Overlay ────────────────────────────────────────────── */}
        {isSaving && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none">
            <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-8 shadow-[8px_8px_0px_0px_#8B5CF6] text-center pointer-events-auto">
              <Loader2 className="w-10 h-10 mx-auto text-[#8B5CF6] animate-spin mb-3" />
              <p className="font-display text-lg text-[#1E293B] font-black">Committing to GitHub...</p>
            </div>
          </div>
        )}

        {/* ── Game Cards ───────────────────────────────────────────────── */}
        {!isLoading && filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGames.map(game => {
              const isInstructor = game.role === 'instructor';
              const examMeta = EXAM_SECTIONS.find(e => e.id === game.examId) || EXAM_SECTIONS[4];

              return (
                <article key={game.id} className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-[6px_6px_0px_0px_#1E293B] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#8B5CF6] transition-all relative group">
                  {/* Admin delete button */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 border-2 border-red-300 hover:bg-red-100 hover:border-red-500 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer transition-all opacity-0 group-hover:opacity-100 z-10"
                      title="Delete this AI game"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-[9px] font-display font-black uppercase tracking-wider text-[#64748B] mb-1">Scholar Creator</p>
                        <p className="font-display font-black text-[#1E293B] text-base leading-tight">{game.author}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-display font-black uppercase px-2.5 py-1 rounded-full border-2 border-[#1E293B] ${
                          isInstructor ? 'bg-[#F472B6] text-white' : 'bg-[#34D399] text-[#1E293B]'
                        }`}>
                          {isInstructor ? <Award className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          <span>{isInstructor ? 'Faculty' : 'Student'}</span>
                        </span>
                        <span className="text-[9px] font-display font-black text-[#8B5CF6] uppercase tracking-wider bg-[#FFFDF5] px-2 py-0.5 border border-[#1E293B] rounded-md">
                          {examMeta.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                      <h3 className="text-lg font-display font-extrabold text-[#1E293B] leading-snug">
                        {game.title}
                      </h3>
                    </div>

                    <div className="bg-[#FFFDF5] rounded-xl p-4 border-2 border-[#1E293B] text-xs font-semibold mt-3">
                      <p className="font-display text-[#8B5CF6] uppercase tracking-wide text-[9px] mb-1 font-black">Core Subject / Study Objective</p>
                      <p className="text-[#1E293B] font-bold mb-1.5">{game.topic}</p>
                      <p className="text-[#64748B] leading-relaxed italic">"{game.description}"</p>
                    </div>
                  </div>

                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full candy-button inline-flex items-center justify-center gap-2 text-xs py-3.5 px-4 uppercase cursor-pointer shrink-0 mt-2"
                  >
                    <ExternalLink className="w-4 h-4 text-white stroke-[3px]" />
                    <span>Launch AI Game</span>
                  </a>
                </article>
              );
            })}
          </div>
        ) : !isLoading ? (
          <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-16 text-center text-[#64748B] shadow-[4px_4px_0px_0px_#1E293B]">
            <Info className="w-12 h-12 mx-auto text-[#8B5CF6] mb-3 opacity-60" />
            <p className="font-display text-lg text-[#1E293B] font-black">No AI Games Found</p>
            <p className="text-sm font-semibold mt-1">Try adjusting or relaxing your search parameters above.</p>
          </div>
        ) : null}

      </div>
    </section>
  );
}
