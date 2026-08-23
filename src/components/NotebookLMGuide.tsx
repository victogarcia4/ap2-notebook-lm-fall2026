import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { Sparkles, Copy, CheckCircle, Info, GraduationCap, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import GeminiNotebookName from './GeminiNotebookName';

interface NotebookLMGuideProps {
  students: Student[];
  selectedStudentIdx: number;
}

export default function NotebookLMGuide({ students, selectedStudentIdx }: NotebookLMGuideProps) {
  const [studentIndex, setStudentIndex] = useState(0);
  const [examKey, setExamKey] = useState<'exam1' | 'exam2' | 'exam3' | 'exam4' | 'exam5'>("exam1");
  const [format, setFormat] = useState("presentation");
  const [copied, setCopied] = useState(false);

  // Sync selected student index from parent state
  useEffect(() => {
    if (selectedStudentIdx >= 0 && selectedStudentIdx < students.length) {
      setStudentIndex(selectedStudentIdx);
    }
  }, [selectedStudentIdx, students]);

  const activeStudent = students[studentIndex];
  const activeOutcome = activeStudent ? activeStudent[examKey] : null;

  const generatedPrompt = activeOutcome
    ? `"Using the selected sources, generate a(n) ${format} of this specific learning outcome: [${activeOutcome.id} - ${activeOutcome.topic}: ${activeOutcome.desc}]"`
    : "";

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-[#1E293B]">
      
      {/* Step Guide List */}
      <div className="lg:col-span-7 bg-white border-4 border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1E293B] space-y-8 relative">
        
        {/* Step Guide Header */}
        <div className="bg-[#8B5CF6] text-white rounded-2xl p-6 text-center border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] relative overflow-hidden rotate-[-0.5deg]">
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-wide uppercase flex items-center justify-center gap-2">
            <span><GeminiNotebookName /> Creator Guide</span>
          </h2>
          <p className="text-xs text-[#FBBF24] uppercase tracking-widest font-extrabold mt-1">
            Turn Learning Outcomes into Interactive Assets
          </p>
        </div>

        {/* Intro speech bubble */}
        <div className="bg-[#F1F5F9] border-2 border-[#1E293B] p-4 rounded-2xl relative speech-bubble">
          <p className="text-[#1E293B] text-sm leading-relaxed font-semibold italic">
            &quot;Hello everyone! Ready to build your own{' '}
            <strong className="text-[#8B5CF6]"><GeminiNotebookName /> tools</strong>? Follow this roadmap to create and submit your project successfully. Let's make learning dynamic! 🎧&quot;
          </p>
        </div>

        {/* Phase 1 */}
        <div className="border-4 border-[#1E293B] bg-[#FFFDF5] p-5 rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-1px] transition-transform">
          <h3 className="text-[#8B5CF6] font-display text-lg flex items-center gap-2 font-black">
            <span className="bg-[#F472B6] text-white text-xs font-display font-black rounded-full w-6 h-6 inline-flex items-center justify-center border-2 border-[#1E293B]">1</span>
            <span>Phase I: The Setup (Syllabus Allocation)</span>
          </h3>
          <ul className="text-xs text-[#1E293B] font-semibold space-y-2 list-disc pl-5 leading-relaxed">
            <li>
              <strong className="text-[#8B5CF6] font-display text-[10px] uppercase tracking-wide">Find Your LO:</strong> Locate your assigned HAPS Learning Outcome for the active exam category using the Planner Deck.
            </li>
            <li>
              <strong className="text-[#8B5CF6] font-display text-[10px] uppercase tracking-wide">Rename Workspace:</strong> Create a new <GeminiNotebookName /> and rename it with your specific LO code. Just copy and paste it!
            </li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="border-4 border-[#1E293B] bg-[#FFFDF5] p-5 rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-1px] transition-transform">
          <h3 className="text-[#8B5CF6] font-display text-lg flex items-center gap-2 font-black">
            <span className="bg-[#FBBF24] text-[#1E293B] text-xs font-display font-black rounded-full w-6 h-6 inline-flex items-center justify-center border-2 border-[#1E293B]">2</span>
            <span>Phase II: Add Sources &amp; Custom Scripts</span>
          </h3>
          
          <div className="border-l-4 border-[#F472B6] pl-3 py-1 space-y-1.5">
            <p className="text-xs font-display font-black text-[#F472B6] uppercase tracking-wider text-[10px]">
              Steps 3 &amp; 4: Upload Course Materials
            </p>
            <ul className="text-xs text-[#1E293B] font-semibold space-y-1 list-disc pl-5 leading-relaxed">
              <li>Upload relevant files from your study material that match your specific LO.</li>
              <li>Add 2-3 public study links (e.g., peer reviews, Khan Academy, or Crash Course).</li>
            </ul>
          </div>

          <div className="border-l-4 border-[#34D399] pl-3 py-1 space-y-1.5">
            <p className="text-xs font-display font-black text-[#34D399] uppercase tracking-wider text-[10px]">
              Steps 5 &amp; 6: Customize AI Prompts ✍️
            </p>
            <p className="text-xs text-[#64748B] leading-relaxed font-semibold">
              Copy and paste this base template into <GeminiNotebookName /> for each tool (presentation, flashcards, video, audio, infographic):
            </p>
            <div className="bg-white border-2 border-[#1E293B] p-4 rounded-xl text-xs text-[#8B5CF6] font-mono italic font-bold">
              "Using the selected sources, generate a(n) [presentation, flashcards, video, audio, infographic] of this specific learning outcome: [---paste your LO here---]"
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="border-4 border-[#1E293B] bg-[#FFFDF5] p-5 rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_#1E293B] hover:translate-y-[-1px] transition-transform">
          <h3 className="text-[#8B5CF6] font-display text-lg flex items-center gap-2 font-black">
            <span className="bg-[#34D399] text-[#1E293B] text-xs font-display font-black rounded-full w-6 h-6 inline-flex items-center justify-center border-2 border-[#1E293B]">3</span>
            <span>Phase III: Generate &amp; Submit Asset</span>
          </h3>
          <p className="text-xs text-[#1E293B] font-semibold leading-relaxed">
            <strong className="text-[#8B5CF6] font-display text-[10px] uppercase tracking-wide">Step 7:</strong> Select the "shorter version" to generate your items. Ensure content focuses strictly on your allocated HAPS learning outcome!
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white border-2 border-[#1E293B] p-4 rounded-xl text-center space-y-1 pop-shadow-sm">
              <p className="uppercase text-[9px] text-[#64748B] font-display tracking-widest font-black">Step 8</p>
              <p className="font-display font-black text-sm text-[#8B5CF6]">🔗 Share Link</p>
              <p className="font-bold text-[10px] text-[#64748B] mt-1">Anyone with link</p>
            </div>
            <div className="bg-white border-2 border-[#1E293B] p-4 rounded-xl text-center space-y-1 pop-shadow-sm">
              <p className="uppercase text-[9px] text-[#64748B] font-display tracking-widest font-black">Step 9</p>
              <p className="font-display font-black text-sm text-[#F472B6]">📥 Submit Link</p>
              <p className="font-bold text-[10px] text-[#64748B] mt-1">Publish to repository</p>
            </div>
          </div>
        </div>

        {/* Closing Note */}
        <div className="bg-[#34D399]/25 border-4 border-dashed border-[#1E293B] p-4 rounded-2xl text-center">
          <p className="text-sm font-display font-black text-[#1E293B] flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]" />
            <span>Rigorous dedication to anatomical research!</span>
          </p>
        </div>

      </div>

      {/* Interactive Prompt Builder Card */}
      <div className="lg:col-span-5 bg-white border-4 border-[#1E293B] rounded-2xl p-6 shadow-[6px_6px_0px_0px_#1E293B] space-y-5 relative">
        <h3 className="font-display text-2xl text-[#1E293B] font-black border-b-4 border-[#1E293B] pb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#8B5CF6] animate-pulse" />
          <span>Script Generator</span>
        </h3>
        <p className="text-xs text-[#64748B] font-bold leading-relaxed">
          Select a scholar and milestone. The system automatically fetches their deterministic learning outcome and constructs the exact instruction script for Google <GeminiNotebookName />.
        </p>

        {activeStudent ? (
          <div className="space-y-4">
            {/* Student Dropdown */}
            <div className="flex flex-col gap-1.5 text-xs font-bold">
              <label className="text-[10px] font-display font-black text-[#8B5CF6] uppercase tracking-wider">Select Scholar:</label>
              <select
                value={studentIndex}
                onChange={(e) => setStudentIndex(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm cursor-pointer font-bold"
              >
                {students.map((student, idx) => (
                  <option key={student.id} value={idx}>
                    {student.name} ({student.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Exam category */}
            <div className="flex flex-col gap-1.5 text-xs font-bold">
              <label className="text-[10px] font-display font-black text-[#8B5CF6] uppercase tracking-wider">Target Milestone / Exam:</label>
              <select
                value={examKey}
                onChange={(e) => setExamKey(e.target.value as any)}
                className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm cursor-pointer font-bold"
              >
                <option value="exam1">Lecture Exam 1 (Endocrine, Blood, Cardio)</option>
                <option value="exam2">Lecture Exam 2 (Lymphatic, Respiratory)</option>
                <option value="exam3">Lecture Exam 3 (Digestive, Metabolism)</option>
                <option value="exam4">Lecture Exam 4 (Urinary, Acid-Base)</option>
                <option value="exam5">Lecture Exam 5 (Reproduction, Genetics)</option>
              </select>
            </div>

            {/* Deliverable format */}
            <div className="flex flex-col gap-1.5 text-xs font-bold">
              <label className="text-[10px] font-display font-black text-[#8B5CF6] uppercase tracking-wider"><GeminiNotebookName /> Deliverable Format:</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm cursor-pointer font-bold"
              >
                <option value="presentation">presentation</option>
                <option value="flashcards">flashcards</option>
                <option value="video summary">video summary</option>
                <option value="audio podcast">audio podcast</option>
                <option value="infographic text">infographic blueprint</option>
              </select>
            </div>

            {/* Live Prompt display box */}
            <div className="space-y-2.5 pt-4 border-t-2 border-[#1E293B]">
              <p className="text-[10px] font-display font-black text-[#8B5CF6] uppercase tracking-wider">
                AUTOMATIC STUDY PROMPT:
              </p>
              
              <div className="relative bg-[#FFFDF5] text-[#1E293B] border-2 border-[#1E293B] rounded-xl p-4 font-mono text-xs break-words leading-relaxed min-h-[140px] select-all shadow-[4px_4px_0px_0px_#1E293B]">
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 inline-flex items-center gap-1 bg-[#8B5CF6] text-white border-2 border-[#1E293B] rounded-xl px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-wider hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_#1E293B] active:translate-y-[1px] transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                
                <span className="block pr-16 mt-3 font-sans font-bold text-sm italic text-[#1E293B]">
                  {generatedPrompt}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 border-2 border-[#1E293B] p-8 rounded-xl text-center text-[#64748B] text-xs font-bold">
            <Info className="w-8 h-8 text-[#8B5CF6] mx-auto mb-2 opacity-50" />
            <p>No roster students loaded to generate custom prompts.</p>
          </div>
        )}

      </div>
    </div>
  );
}
