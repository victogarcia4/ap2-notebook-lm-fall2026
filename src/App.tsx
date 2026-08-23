import { useState, useEffect } from 'react';
import { Student, DistributionPolicy, AcademicSession } from './types';
import { defaultStudents } from './data/students';
import { hapsOutcomes } from './data/outcomes';

// Subcomponents
import Hero from './components/Hero';
import CaseStudiesSection from './components/CaseStudiesSection';
import RosterMatrix from './components/RosterMatrix';
import SubmittedNotebooks from './components/SubmittedNotebooks';
import AIGameRepository from './components/AIGameRepository';
import NotebookLMGuide from './components/NotebookLMGuide';
import LearningContractModal from './components/LearningContractModal';
import GeminiNotebookName from './components/GeminiNotebookName';

// Icons
import { GraduationCap, BookOpen, Layers, Gamepad2, Database, Sparkles, Smile } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [session, setSession] = useState<AcademicSession>("su26");
  const [activeTab, setActiveTab] = useState<'matrix' | 'notebooks' | 'games' | 'guide'>("matrix");

  const [selectedStudentIdx, setSelectedStudentIdx] = useState(0);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Initialize students and randomize assignments on startup
  useEffect(() => {
    const saved = localStorage.getItem('biol2402_students');
    const savedSession = localStorage.getItem('biol2402_session');
    
    if (savedSession) {
      setSession(savedSession as AcademicSession);
    }

    if (saved) {
      try {
        const savedRoster = JSON.parse(saved) as Student[];
        const melissa = defaultStudents.find(student => student.id === "7311968");

        if (melissa && !savedRoster.some(student => student.id === melissa.id)) {
          const instructorIndex = savedRoster.findIndex(student => student.id === "INSTRUCTOR");
          savedRoster.splice(instructorIndex + 1, 0, melissa);
        }

        const updatedRoster = runAllocation(savedRoster);
        setStudents(updatedRoster);
        localStorage.setItem('biol2402_students', JSON.stringify(updatedRoster));
      } catch (e) {
        initDefaultRoster("balanced");
      }
    } else {
      initDefaultRoster("balanced");
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3000);
  };

  const initDefaultRoster = (policy: DistributionPolicy) => {
    const assigned = runAllocation(defaultStudents, policy);
    setStudents(assigned);
    localStorage.setItem('biol2402_students', JSON.stringify(assigned));
  };

  // Main outcome allocation engine - Now 100% deterministic (no randomization)
  const runAllocation = (roster: Student[], policy?: DistributionPolicy): Student[] => {
    const studentList = JSON.parse(JSON.stringify(roster)) as Student[];
    
    (['exam1', 'exam2', 'exam3', 'exam4', 'exam5'] as const).forEach(examKey => {
      const outcomes = hapsOutcomes[examKey] || [];
      studentList.forEach((student, index) => {
        if (outcomes.length > 0) {
          student[examKey] = outcomes[index % outcomes.length];
        }
      });
    });
    
    return studentList;
  };

  const handleRandomize = (policy: DistributionPolicy) => {
    const updated = runAllocation(students, policy);
    setStudents(updated);
    localStorage.setItem('biol2402_students', JSON.stringify(updated));
    showToast("Successfully distributed learning outcomes deterministically (1 SLO per Exam per Student)!");
  };

  const handleImportRoster = (newRoster: Student[]) => {
    const assigned = runAllocation(newRoster, 'balanced');
    setStudents(assigned);
    localStorage.setItem('biol2402_students', JSON.stringify(assigned));
    setSelectedStudentIdx(0);
    setActiveTab('matrix');
    showToast(`Successfully imported and randomized ${newRoster.length} students!`);
  };

  const handleResetDefault = () => {
    initDefaultRoster('balanced');
    setSelectedStudentIdx(0);
    setActiveTab('matrix');
    showToast("Restored original class roster (28 enrolled).");
  };

  const handleSessionChange = (newSession: AcademicSession) => {
    setSession(newSession);
    localStorage.setItem('biol2402_session', newSession);
    showToast(`Updated academic term settings to ${newSession === 'su26' ? 'Summer 2026' : newSession === 'fa26' ? 'Fall 2026' : 'Spring 2027'}.`);
  };

  // Clipboard TSV export
  const handleCopyClipboard = () => {
    let tsv = "Student ID\tStudent Name\tAcademic Level\tExam 1 Outcome\tExam 2 Outcome\tExam 3 Outcome\tExam 4 Outcome\tExam 5 Outcome\n";
    students.forEach(s => {
      tsv += `${s.id}\t${s.name}\t${s.level}\t${s.exam1?.id || ""}\t${s.exam2?.id || ""}\t${s.exam3?.id || ""}\t${s.exam4?.id || ""}\t${s.exam5?.id || ""}\n`;
    });

    navigator.clipboard.writeText(tsv).then(() => {
      showToast("Roster Copied! Ready to paste into Excel or Sheets.");
    }).catch(() => {
      showToast("Clipboard copy failed. Try exporting CSV instead.");
    });
  };

  // CSV download
  const handleDownloadCSV = () => {
    let csv = "Student ID,Student Name,Level,Exam 1 L.O.,Exam 1 Description,Exam 2 L.O.,Exam 2 Description,Exam 3 L.O.,Exam 3 Description,Exam 4 L.O.,Exam 4 Description,Exam 5 L.O.,Exam 5 Description\n";
    students.forEach(s => {
      csv += `"${s.id}","${s.name}","${s.level}","${s.exam1?.id || ""}","${(s.exam1?.desc || "").replace(/"/g, '""')}","${s.exam2?.id || ""}","${(s.exam2?.desc || "").replace(/"/g, '""')}","${s.exam3?.id || ""}","${(s.exam3?.desc || "").replace(/"/g, '""')}","${s.exam4?.id || ""}","${(s.exam4?.desc || "").replace(/"/g, '""')}","${s.exam5?.id || ""}","${(s.exam5?.desc || "").replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `BIOL2402_HAPS_Assignments_${session}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV file download triggered successfully!");
  };

  const handleCopyMarkdown = () => {
    const student = students[selectedStudentIdx];
    if (!student) return;

    const md = `
# Mastery Learning Covenant
**Course:** Human Anatomy & Physiology II (BIOL 2402)
**Instructor:** Prof. Victor Garcia Martinez

## Student Profile
* **Name:** ${student.name}
* **ID:** ${student.id}
* **Level:** ${student.level}

## Assigned HAPS Learning Outcomes
1. **Lecture Exam 1 (Ch. 13-15):** \`${student.exam1?.id || ""}\` - ${student.exam1?.topic || ""}: ${student.exam1?.desc || ""}
2. **Lecture Exam 2 (Ch. 16, 19):** \`${student.exam2?.id || ""}\` - ${student.exam2?.topic || ""}: ${student.exam2?.desc || ""}
3. **Lecture Exam 3 (Ch. 17-18):** \`${student.exam3?.id || ""}\` - ${student.exam3?.topic || ""}: ${student.exam3?.desc || ""}
4. **Lecture Exam 4 (Ch. 20-21):** \`${student.exam4?.id || ""}\` - ${student.exam4?.topic || ""}: ${student.exam4?.desc || ""}
5. **Lecture Exam 5 (Ch. 22-24):** \`${student.exam5?.id || ""}\` - ${student.exam5?.topic || ""}: ${student.exam5?.desc || ""}

---
*Signed by Student and Instructor for Academic Term 2026.*
`;
    navigator.clipboard.writeText(md.trim()).then(() => {
      showToast("Markdown covenant copied to clipboard!");
    });
  };

  const handleOpenContract = (index: number) => {
    setSelectedStudentIdx(index);
    setIsContractOpen(true);
  };

  const handleShowOutcomeDetails = (examKey: string, index: number) => {
    setSelectedStudentIdx(index);
    setIsContractOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans text-[#1E293B] flex flex-col justify-between selection:bg-[#FBBF24] selection:text-[#1E293B] relative overflow-x-hidden dot-grid-subtle pb-12">
      
      {/* Dynamic Toast Message (Pop visual banner) */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#FBBF24] text-[#1E293B] font-display font-black text-xs px-5 py-3 rounded-xl border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] z-50 flex items-center gap-2 animate-fade-in print:hidden">
          <Sparkles className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Section */}
      <Hero />

      {/* Case Studies & Video Section */}
      <CaseStudiesSection />

      {/* Main Interactive Planner Deck Dashboard */}
      <main id="zoom-explanation-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full print:hidden relative z-10">
        
        {/* Core Roster Header */}
        <header className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1E293B] mb-10 relative">
          <div className="flex items-center gap-2 text-[#8B5CF6] font-display text-xs uppercase tracking-wider font-extrabold mb-2">
            <GraduationCap className="w-5 h-5 text-[#8B5CF6]" />
            <span>Lone Star College System &bull; Human Anatomy &amp; Physiology</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#1E293B] leading-none">
            BIOL 2402 &mdash; Human Anatomy &amp; Physiology II
          </h1>
          <p className="text-[#64748B] text-sm sm:text-base font-bold mt-2 italic">
            {session === 'su26' ? 'Summer Course Learning Outcome Distribution Portal • Prof. Victor Garcia Martinez' :
             session === 'fa26' ? 'Fall Semester 16-Week Dynamic Learning Map • Prof. Victor Garcia Martinez' :
             'Spring Semester Accelerated Learning Deck • Prof. Victor Garcia Martinez'}
          </p>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#1E293B] hover:shadow-[6px_6px_0px_0px_#8B5CF6] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <span className="text-[10px] font-display font-black text-[#64748B] uppercase tracking-wider">Enrolled Scholars</span>
            <span className="text-3xl font-display font-black text-[#8B5CF6] mt-1">{students.length}</span>
            <span className="text-xs text-[#64748B] font-bold mt-2">BIOL 2402 {session.toUpperCase()}</span>
          </div>
          
          <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#1E293B] hover:shadow-[6px_6px_0px_0px_#F472B6] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <span className="text-[10px] font-display font-black text-[#64748B] uppercase tracking-wider">HAPS Core Outcomes</span>
            <span className="text-3xl font-display font-black text-[#F472B6] mt-1">61</span>
            <span className="text-xs text-[#64748B] font-bold mt-2">Mapped to Exams 1 - 5</span>
          </div>

          <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#1E293B] hover:shadow-[6px_6px_0px_0px_#FBBF24] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <span className="text-[10px] font-display font-black text-[#64748B] uppercase tracking-wider">Assigned Outcomes</span>
            <span className="text-3xl font-display font-black text-[#FBBF24] mt-1">{students.length * 5}</span>
            <span className="text-xs text-[#64748B] font-bold mt-2">5 outcomes per scholar</span>
          </div>

          <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#1E293B] hover:shadow-[6px_6px_0px_0px_#34D399] hover:translate-y-[-1px] transition-all flex flex-col justify-between">
            <span className="text-[10px] font-display font-black text-[#64748B] uppercase tracking-wider">Distribution Balance</span>
            <span className="text-3xl font-display font-black text-[#34D399] mt-1">100%</span>
            <span className="text-xs text-[#64748B] font-bold mt-2">Perfect Balance Active</span>
          </div>
        </div>

        {/* Navigation Tabs (Memphis styled navigation) */}
        <nav className="flex flex-wrap gap-3 border-b-4 border-[#1E293B] pb-4 mb-8 text-sm">
          {[
            { id: 'matrix', label: 'Roster & Outcomes Matrix', icon: <Layers className="w-4 h-4" /> },
            { id: 'notebooks', label: <><GeminiNotebookName /> Repository</>, icon: <Database className="w-4 h-4" /> },
            { id: 'games', label: 'AI Game Repository', icon: <Gamepad2 className="w-4 h-4" /> },
            { id: 'guide', label: <><GeminiNotebookName /> Guide</>, icon: <BookOpen className="w-4 h-4" /> },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-5 py-3.5 font-display text-xs uppercase tracking-wider font-black rounded-xl border-2 border-[#1E293B] transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-[3px_3px_0px_0px_#1E293B] translate-y-[-2px]'
                    : 'bg-white text-[#1E293B] hover:bg-[#FFFDF5] hover:shadow-[2px_2px_0px_0px_#1E293B] hover:translate-y-[-1px]'
                }`}
              >
                <span className={isActive ? 'text-[#FBBF24]' : 'text-[#8B5CF6]'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Tab Contents */}
        <div className="min-h-[400px]">
          {activeTab === 'matrix' && (
            <RosterMatrix
              students={students}
              session={session}
              onSessionChange={handleSessionChange}
              onRandomize={handleRandomize}
              onOpenContract={handleOpenContract}
              onShowOutcomeDetails={handleShowOutcomeDetails}
              onBulkPrint={() => window.print()}
              onCopyClipboard={handleCopyClipboard}
              onDownloadCSV={handleDownloadCSV}
            />
          )}

          {activeTab === 'notebooks' && (
            <SubmittedNotebooks />
          )}

          {activeTab === 'games' && (
            <AIGameRepository />
          )}

          {activeTab === 'guide' && (
            <NotebookLMGuide
              students={students}
              selectedStudentIdx={selectedStudentIdx}
            />
          )}
        </div>

      </main>

      {/* Mastery Learning Covenant Modal */}
      <LearningContractModal
        student={students[selectedStudentIdx] || null}
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
        onGeneratePrompts={() => {
          setIsContractOpen(false);
          setActiveTab('guide');
        }}
        onCopyMarkdown={handleCopyMarkdown}
      />

      {/* Absolute Physical Print Container - formatted only for physical printing */}
      <div className="hidden print:block space-y-12 w-full p-8 bg-white text-gray-900 select-all">
        {students.map((student) => (
          <div key={student.id} className="print-contract-page border-4 border-double border-gray-300 p-8 rounded-lg page-break-after-always bg-white">
            <div className="text-center border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-serif text-teal-900 tracking-tight font-normal">
                Mastery Learning Covenant
              </h2>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mt-1">
                Human Anatomy &amp; Physiology II &bull; BIOL 2402
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 border border-dashed border-gray-200 p-4 rounded-lg mb-6 leading-relaxed">
              <div>
                <p className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider mb-0.5">STUDENT SCHOLAR:</p>
                <p className="text-sm font-bold text-gray-900">{student.name}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider mb-0.5">STUDENT ID:</p>
                <p className="text-sm font-mono text-gray-900">{student.id}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider mb-0.5">ACADEMIC LEVEL:</p>
                <p className="text-sm font-medium text-gray-900">{student.level} &bull; Graded</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider mb-0.5">INSTITUTION &amp; SECTION:</p>
                <p className="text-sm font-medium text-gray-900">Lone Star College System &bull; SU26</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              This learning covenant defines the individual academic focus of the undergraduate scholar listed above. Under the pedagogical direction of <strong>Professor Victor Garcia Martinez</strong>, the student pledges to achieve maximum concept mastery over the following assigned standardized <strong>HAPS Learning Outcomes</strong> for each upcoming Lecture Exam:
            </p>

            <div className="space-y-4 border-t border-b border-gray-100 py-5">
              {[
                { label: "Lecture Exam 1", ch: "Ch. 13, 14, 15", lo: student.exam1 },
                { label: "Lecture Exam 2", ch: "Ch. 16, 19", lo: student.exam2 },
                { label: "Lecture Exam 3", ch: "Ch. 17, 18", lo: student.exam3 },
                { label: "Lecture Exam 4", ch: "Ch. 20, 21", lo: student.exam4 },
                { label: "Lecture Exam 5", ch: "Ch. 22, 23, 24", lo: student.exam5 }
              ].map((milestone, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 text-xs py-1.5 border-l-2 border-teal-600 pl-3">
                  <div className="col-span-3">
                    <p className="font-bold text-gray-900 leading-tight">{milestone.label}</p>
                    <p className="text-[10px] text-gray-500 font-medium leading-none">{milestone.ch}</p>
                  </div>
                  <div className="col-span-2 font-mono font-bold text-teal-800 text-[11px]">
                    {milestone.lo?.id}
                  </div>
                  <div className="col-span-7 text-gray-700 leading-normal">
                    <span className="font-semibold text-gray-800">{milestone.lo?.topic}:</span> {milestone.lo?.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-6 border-t border-dashed border-gray-200">
              <div className="text-center">
                <div className="border-b border-gray-400 h-10 mb-1"></div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Student Signature</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-400 h-10 mb-1 flex items-end justify-center">
                  <span className="font-serif italic text-base text-teal-700 font-semibold leading-none">
                    Victor Garcia Martinez
                  </span>
                </div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Instructor Endorsement</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Playful Geometric Footer Card */}
      <footer className="mt-12 py-12 text-center text-xs text-[#64748B] flex flex-col items-center gap-6 print:hidden relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row items-center gap-6 text-left bg-white border-4 border-[#1E293B] p-6 rounded-2xl max-w-2xl w-full shadow-[6px_6px_0px_0px_#1E293B] hover:shadow-[8px_8px_0px_0px_#1E293B] hover:translate-y-[-1px] transition-all relative">
          
          {/* Avatar frame */}
          <img
            src="/VHGM traje azul.png"
            alt="Dr. Victor Garcia M."
            className="w-24 h-24 rounded-2xl object-cover border-4 border-[#1E293B] shadow-[3px_3px_0px_0px_#1E293B] shrink-0 hover:rotate-3 transition-transform duration-300"
          />

          <div>
            <span className="bg-[#34D399] text-[#1E293B] text-[10px] font-display font-black uppercase tracking-wider px-2.5 py-0.5 border-2 border-[#1E293B] rounded-full mb-1.5 inline-block">
              Course Director
            </span>
            <h4 className="font-display text-xl font-black text-[#1E293B] leading-none">
              Dr. Victor Garcia M.
            </h4>
            <p className="text-[#64748B] text-xs mt-1.5 font-bold leading-normal">
              Nursing &amp; Biology Faculty &bull; Lone Star College System
            </p>
            <p className="text-[#8B5CF6] font-display text-xs uppercase tracking-wider font-black mt-3 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-[#F472B6] stroke-[2.5px]" />
              <a
                href="https://48hours.live"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F472B6] hover:underline"
              >
                Built by Dr. Victor Garcia Martinez @ 48hours.live
              </a>
            </p>
          </div>
        </div>

        <p className="max-w-2xl px-6 leading-relaxed text-[#64748B] font-semibold text-[11px]">
          &copy; 2026 Professor Victor Garcia Martinez. Developed for Lone Star College A&amp;P Instruction. Utilizing 2019 HAPS Standard Learning Outcomes. Core configuration parsed from <span className="font-mono bg-white px-1.5 py-0.5 border-2 border-[#1E293B] rounded text-[#8B5CF6] font-bold">BIOL 2402 SU 26.pdf</span> and <span className="font-mono bg-white px-1.5 py-0.5 border-2 border-[#1E293B] rounded text-[#8B5CF6] font-bold">HAPS LEARNING OUTCOMES - HAPS L.O..csv</span>.
        </p>
      </footer>

    </div>
  );
}
