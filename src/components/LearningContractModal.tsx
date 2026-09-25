import React from 'react';
import { Student } from '../types';
import { Printer, Copy, Headphones, X, Award, FileText, Check, BookOpen, ExternalLink, Gamepad2, Sparkles } from 'lucide-react';
import GeminiNotebookName from './GeminiNotebookName';

interface LearningContractModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onGeneratePrompts: () => void;
  onCopyMarkdown: () => void;
}

export default function LearningContractModal({
  student,
  isOpen,
  onClose,
  onGeneratePrompts,
  onCopyMarkdown
}: LearningContractModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-[#1E293B] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[10px_10px_0px_0px_#1E293B] p-6 sm:p-8 relative text-[#1E293B]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-[#1E293B] hover:bg-gray-100 flex items-center justify-center text-[#1E293B] transition-colors cursor-pointer z-10 bg-white"
        >
          <X className="w-5 h-5 stroke-[2.5px]" />
        </button>

        {/* Modal Actions Header */}
        <div className="flex gap-3 justify-end mb-6 border-b-4 border-[#1E293B] pb-4 print:hidden pr-12">
          <button
            onClick={() => window.print()}
            className="candy-button inline-flex items-center gap-1.5 text-xs px-4 py-2 uppercase cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white stroke-[3px]" />
            <span>Print Covenant</span>
          </button>
          
          <button
            onClick={onCopyMarkdown}
            className="inline-flex items-center gap-1.5 bg-[#FFFDF5] hover:bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] font-display text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer pop-shadow-sm active:translate-y-[1px]"
          >
            <Copy className="w-4 h-4 text-[#8B5CF6]" />
            <span>Copy MD</span>
          </button>
        </div>

        {/* Contract Sheet */}
        <div className="border-4 border-[#1E293B] p-6 bg-[#FFFDF5] rounded-2xl shadow-[4px_4px_0px_0px_#1E293B] select-all relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-[#1E293B] pb-5 mb-6">
            <div className="inline-block text-[10px] font-display font-black text-white bg-[#8B5CF6] border-2 border-[#1E293B] uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow-sm">
              Pedagogical Contract
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1E293B] tracking-tight">
              Mastery Learning Covenant
            </h2>
            <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-display font-black mt-1">
              Human Anatomy &amp; Physiology II &bull; BIOL 2402
            </p>
          </div>

          {/* Scholar Grid (Pop accent card box) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white border-2 border-[#1E293B] p-4 rounded-xl mb-6 shadow-sm font-semibold">
            <div>
              <p className="text-[#8B5CF6] font-display font-black uppercase text-[9px] tracking-wider mb-0.5">STUDENT SCHOLAR:</p>
              <p className="text-sm font-black text-[#1E293B]">{student.name}</p>
            </div>
            <div>
              <p className="text-[#8B5CF6] font-display font-black uppercase text-[9px] tracking-wider mb-0.5">STUDENT ID:</p>
              <p className="text-sm font-mono text-[#1E293B] font-black">{student.id}</p>
            </div>
            <div>
              <p className="text-[#8B5CF6] font-display font-black uppercase text-[9px] tracking-wider mb-0.5">ACADEMIC LEVEL:</p>
              <p className="text-sm font-bold text-[#1E293B]">{student.level} &bull; Graded</p>
            </div>
            <div>
              <p className="text-[#8B5CF6] font-display font-black uppercase text-[9px] tracking-wider mb-0.5">INSTITUTION &amp; TERM:</p>
              <p className="text-sm font-bold text-[#1E293B]">Lone Star College System &bull; SU26</p>
            </div>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed mb-6 font-semibold">
            This learning covenant defines the individual academic focus of the undergraduate scholar listed above. Under the pedagogical direction of <strong className="text-[#1E293B]">Professor Victor Garcia Martinez</strong>, the student pledges to achieve maximum concept mastery over the following assigned standardized <strong className="text-[#1E293B]">HAPS Learning Outcomes</strong> for each upcoming Lecture Exam:
          </p>

          {/* Outcomes list inside modal */}
          <div className="space-y-4 border-t-2 border-b-2 border-dashed border-[#1E293B] py-5">
            {[
              { label: "Lecture Exam 1", ch: "Ch. 13-15", lo: student.exam1, color: "border-[#8B5CF6]", examKey: 'exam1' as const },
              { label: "Lecture Exam 2", ch: "Ch. 16, 19", lo: student.exam2, color: "border-[#F472B6]", examKey: 'exam2' as const },
              { label: "Lecture Exam 3", ch: "Ch. 17, 18", lo: student.exam3, color: "border-[#FBBF24]", examKey: 'exam3' as const },
              { label: "Lecture Exam 4", ch: "Ch. 20, 21", lo: student.exam4, color: "border-[#34D399]", examKey: 'exam4' as const },
              { label: "Lecture Exam 5", ch: "Ch. 22-24", lo: student.exam5, color: "border-[#8B5CF6]", examKey: 'exam5' as const }
            ].map((milestone, idx) => (
              <div key={idx} className={`grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs py-2 border-l-4 ${milestone.color} pl-3 bg-white border-2 border-y-2 border-[#1E293B] rounded-xl pop-shadow-sm`}>
                <div className="sm:col-span-3 font-semibold">
                  <p className="font-display uppercase text-[10px] tracking-wider text-[#1E293B] font-black leading-tight">{milestone.label}</p>
                  <p className="text-[9px] text-[#64748B] font-black mt-0.5">{milestone.ch}</p>
                </div>
                <div className="sm:col-span-2 font-mono font-black text-[#8B5CF6] text-[11px]">
                  {milestone.lo?.id}
                </div>
                <div className="sm:col-span-7 text-[#64748B] leading-normal font-semibold">
                  <div>
                    <span className="font-black text-[#1E293B]">{milestone.lo?.topic}:</span> {milestone.lo?.desc}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2 print:hidden">
                    {student.notebookLinks?.[milestone.examKey] && (
                      <a
                        href={student.notebookLinks[milestone.examKey]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-display font-black text-[#8B5CF6] hover:text-white bg-[#EDE9FE] hover:bg-[#8B5CF6] px-2.5 py-1 rounded-md border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] transition-all cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3 stroke-[2.5px]" />
                        <span>Open Submitted NotebookLM</span>
                        <ExternalLink className="w-2.5 h-2.5 stroke-[2.5px]" />
                      </a>
                    )}
                    {student.gameLinks?.[milestone.examKey] && (
                      <a
                        href={student.gameLinks[milestone.examKey]!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-display font-black text-amber-900 hover:text-white bg-amber-200 hover:bg-amber-600 px-2.5 py-1 rounded-md border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_0px_#1E293B] transition-all cursor-pointer"
                      >
                        <Gamepad2 className="w-3 h-3 stroke-[2.5px]" />
                        <span>Play AI Game: {student.gameLinks[milestone.examKey]!.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 stroke-[2.5px]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Extra Credit Showcase */}
          {student.extraCredit && (
            <div className="bg-amber-50 border-2 border-[#1E293B] rounded-xl p-4 pop-shadow-sm flex items-start gap-3 mt-4">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-black uppercase text-[10px] bg-amber-300 text-amber-950 px-2 py-0.5 rounded-md border border-[#1E293B]">
                    ⭐ Extra Credit Completed
                  </span>
                  <strong className="text-[#1E293B] font-display text-sm">{student.extraCredit.title}</strong>
                </div>
                <p className="text-[#64748B] font-semibold mt-1">{student.extraCredit.topic}</p>
                <a
                  href={student.extraCredit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-display font-black text-amber-950 hover:text-white bg-amber-300 hover:bg-amber-600 px-3 py-1.5 rounded-md border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] transition-all cursor-pointer mt-2.5 print:hidden"
                >
                  <Gamepad2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                  <span>Launch Extra Credit Game</span>
                  <ExternalLink className="w-3 h-3 stroke-[2.5px]" />
                </a>
              </div>
            </div>
          )}

          {/* Custom navigation button */}
          <div className="text-center mt-6 print:hidden">
            <button
              onClick={onGeneratePrompts}
              className="inline-flex items-center gap-1.5 text-xs text-white bg-[#8B5CF6] border-2 border-[#1E293B] font-display font-black uppercase tracking-wider px-5 py-3 rounded-xl hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer pop-shadow-sm"
            >
              <Headphones className="w-4 h-4 text-white stroke-[3.5px]" />
              <span>Generate <GeminiNotebookName /> Prompts</span>
            </button>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t-2 border-dashed border-[#1E293B]">
            <div className="text-center">
              <div className="border-b-2 border-[#1E293B] h-10 mb-1"></div>
              <p className="text-[9px] font-display font-black uppercase tracking-wider text-[#1E293B]">Student Scholar Signature</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-[#1E293B] h-10 mb-1 flex items-end justify-center">
                <span className="font-serif italic text-base text-[#8B5CF6] font-black select-none leading-none pb-1">
                  Victor Garcia Martinez
                </span>
              </div>
              <p className="text-[9px] font-display font-black uppercase tracking-wider text-[#1E293B]">Instructor Endorsement</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
