import { useState } from 'react';
import { Student, DistributionPolicy, AcademicSession } from '../types';
import { hapsOutcomes } from '../data/outcomes';
import { Search, RotateCcw, Clipboard, Download, Printer, Settings, Award } from 'lucide-react';

interface RosterMatrixProps {
  students: Student[];
  onRandomize: (policy: DistributionPolicy) => void;
  onOpenContract: (index: number) => void;
  onShowOutcomeDetails: (examKey: string, index: number) => void;
  onBulkPrint: () => void;
  onCopyClipboard: () => void;
  onDownloadCSV: () => void;
  session: AcademicSession;
  onSessionChange: (session: AcademicSession) => void;
}

export default function RosterMatrix({
  students,
  onRandomize,
  onOpenContract,
  onShowOutcomeDetails,
  onBulkPrint,
  onCopyClipboard,
  onDownloadCSV,
  session,
  onSessionChange
}: RosterMatrixProps) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [policy, setPolicy] = useState<DistributionPolicy>("balanced");

  // Local handler for randomization
  const handleRandomize = () => {
    onRandomize(policy);
  };

  const filteredStudents = students.filter(student => {
    const query = search.toLowerCase();
    const matchesQuery = 
      student.name.toLowerCase().includes(query) ||
      student.id.includes(query) ||
      (student.exam1?.id.toLowerCase() || "").includes(query) ||
      (student.exam2?.id.toLowerCase() || "").includes(query) ||
      (student.exam3?.id.toLowerCase() || "").includes(query) ||
      (student.exam4?.id.toLowerCase() || "").includes(query) ||
      (student.exam5?.id.toLowerCase() || "").includes(query);

    const matchesLevel = levelFilter === "all" || student.level === levelFilter;
    const matchesGrade = gradeFilter === "all" || student.gradeBasis === gradeFilter;

    return matchesQuery && matchesLevel && matchesGrade;
  });

  return (
    <div className="space-y-8 text-[#1E293B]">
      
      {/* Allocation & Planner Control Deck (Pop card box) */}
      <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-6 shadow-[6px_6px_0px_0px_#1E293B]">
        <h3 className="font-display text-2xl text-[#1E293B] font-black border-b-4 border-[#1E293B] pb-3 mb-5 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#8B5CF6] animate-spin-slow" />
          <span>Allocation &amp; Planner Deck</span>
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRandomize}
            className="candy-button inline-flex items-center gap-2 text-xs py-3.5 px-5 cursor-pointer uppercase font-black shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-white stroke-[3px]" />
            <span>Reset Assignments</span>
          </button>
          
          <button
            onClick={onCopyClipboard}
            className="inline-flex items-center gap-2 bg-[#FFFDF5] hover:bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] font-display text-xs font-black uppercase tracking-wider py-3 px-5 rounded-xl transition-all cursor-pointer pop-shadow-sm active:translate-y-[1px] shrink-0"
          >
            <Clipboard className="w-4 h-4 text-[#8B5CF6]" />
            <span>Copy Roster</span>
          </button>

          <button
            onClick={onDownloadCSV}
            className="inline-flex items-center gap-2 bg-[#FFFDF5] hover:bg-[#34D399] text-[#1E293B] border-2 border-[#1E293B] font-display text-xs font-black uppercase tracking-wider py-3 px-5 rounded-xl transition-all cursor-pointer pop-shadow-sm active:translate-y-[1px] shrink-0"
          >
            <Download className="w-4 h-4 text-[#8B5CF6]" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onBulkPrint}
            className="inline-flex items-center gap-2 bg-[#F472B6] hover:bg-[#F472B6]/90 text-white border-2 border-[#1E293B] font-display text-xs font-black uppercase tracking-wider py-3 px-5 rounded-xl transition-all cursor-pointer pop-shadow-sm active:translate-y-[1px] shrink-0"
          >
            <Printer className="w-4 h-4 text-white stroke-[2.5px]" />
            <span>Bulk Print Contracts</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-5 border-t-2 border-[#1E293B]">
          <div className="flex flex-col gap-2 bg-gray-50 border-2 border-[#1E293B] rounded-xl p-4 text-xs font-semibold leading-relaxed">
            <span className="font-display uppercase tracking-wider text-[#8B5CF6] text-[10px] font-black flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Deterministic Assessment Protocol
            </span>
            <p className="text-[#64748B]">
              Learning outcomes are mapped deterministically (1 SLO per Exam per Scholar) by cycling sequentially through the authorized 2019 HAPS Standard syllabus. This guarantees structural fairness across cohorts.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 justify-center">
            <label className="text-[10px] font-display font-black text-[#8B5CF6] uppercase tracking-wider">
              Active Academic Term
            </label>
            <select
              value={session}
              onChange={(e) => onSessionChange(e.target.value as AcademicSession)}
              className="px-4 py-3 border-2 border-[#1E293B] rounded-xl bg-white outline-none text-sm focus:ring-2 focus:ring-[#8B5CF6] text-[#1E293B] cursor-pointer font-bold transition-all"
            >
              <option value="su26">Summer Session II 2026 (Active)</option>
              <option value="fa26">Fall Standard Semester 2026</option>
              <option value="sp27">Spring Accelerated Term 2027</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster & Outcomes List */}
      <div className="space-y-6">
        
        {/* Filter bar (Pop card box) */}
        <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1E293B] flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#8B5CF6] stroke-[2.5px]" />
            <input
              type="text"
              placeholder="Search student scholar, outcome code, chapter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-[#1E293B] rounded-xl bg-[#FFFDF5] text-[#1E293B] outline-none text-sm focus:ring-2 focus:ring-[#8B5CF6] placeholder:italic placeholder:text-[#64748B] font-semibold"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2.5 border-2 border-[#1E293B] rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#1E293B] cursor-pointer font-bold transition-all"
            >
              <option value="all">All Academic Levels</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>

            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2.5 border-2 border-[#1E293B] rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#8B5CF6] text-[#1E293B] cursor-pointer font-bold transition-all"
            >
              <option value="all">All Grade Bases</option>
              <option value="Graded">Graded</option>
              <option value="Audit">Audit / Other</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setLevelFilter("all");
                setGradeFilter("all");
              }}
              className="px-4 py-2.5 border-2 border-[#1E293B] rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-display font-black uppercase tracking-wider text-[#1E293B] transition-all cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Matrix table (Pop card table) */}
        <div className="bg-white border-4 border-[#1E293B] rounded-2xl shadow-[6px_6px_0px_0px_#1E293B] overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFDF5] text-[#1E293B] border-b-4 border-[#1E293B] font-display text-xs uppercase tracking-wider">
                  <th className="p-4 w-[60px] font-black text-center border-r-2 border-[#1E293B]">Seq</th>
                  <th className="p-4 w-[110px] font-black border-r-2 border-[#1E293B]">Scholar ID</th>
                  <th className="p-4 font-black border-r-2 border-[#1E293B]">Name</th>
                  <th className="p-4 w-[120px] font-black border-r-2 border-[#1E293B]">Level</th>
                  <th className="p-4 font-black text-center border-r-2 border-[#1E293B]">Exam 1</th>
                  <th className="p-4 font-black text-center border-r-2 border-[#1E293B]">Exam 2</th>
                  <th className="p-4 font-black text-center border-r-2 border-[#1E293B]">Exam 3</th>
                  <th className="p-4 font-black text-center border-r-2 border-[#1E293B]">Exam 4</th>
                  <th className="p-4 font-black text-center border-r-2 border-[#1E293B]">Exam 5</th>
                  <th className="p-4 text-center w-[130px] font-black">Covenant</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#1E293B] text-[13px] text-[#1E293B] font-semibold">
                {filteredStudents.map((student, idx) => {
                  const levelClass = student.level.toLowerCase();
                  return (
                    <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 font-mono text-center border-r-2 border-[#1E293B] text-[#64748B] font-bold">{idx + 1}</td>
                      <td className="p-4 font-mono text-xs border-r-2 border-[#1E293B] text-[#64748B] font-bold tracking-wide">{student.id}</td>
                      <td className="p-4 font-display font-bold text-base border-r-2 border-[#1E293B] text-[#1E293B]">{student.name}</td>
                      <td className="p-4 border-r-2 border-[#1E293B]">
                        <span className={`inline-block text-[10px] font-display font-black uppercase px-2.5 py-1 rounded-full border-2 border-[#1E293B] shadow-sm ${
                          levelClass === 'freshman' ? 'bg-[#34D399] text-[#1E293B]' :
                          levelClass === 'sophomore' ? 'bg-[#8B5CF6] text-white' :
                          levelClass === 'junior' ? 'bg-[#F472B6] text-white' :
                          levelClass === 'instructor' ? 'bg-[#FBBF24] text-[#1E293B]' :
                          'bg-[#FFFDF5] text-[#1E293B]'
                        }`}>
                          {student.level}
                        </span>
                      </td>
                      <td className="p-4 border-r-2 border-[#1E293B] text-center">
                        {student.exam1 && (
                          <span
                            onClick={() => onShowOutcomeDetails('exam1', idx)}
                            title={student.exam1.desc}
                            className="inline-block text-[10px] font-mono font-black text-[#1E293B] bg-[#FFFDF5] border-2 border-[#1E293B] rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-[#8B5CF6] hover:text-white transition-all hover:scale-105 active:scale-95 truncate max-w-[110px]"
                          >
                            {student.exam1.id}
                          </span>
                        )}
                      </td>
                      <td className="p-4 border-r-2 border-[#1E293B] text-center">
                        {student.exam2 && (
                          <span
                            onClick={() => onShowOutcomeDetails('exam2', idx)}
                            title={student.exam2.desc}
                            className="inline-block text-[10px] font-mono font-black text-[#1E293B] bg-[#FFFDF5] border-2 border-[#1E293B] rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-[#F472B6] hover:text-white transition-all hover:scale-105 active:scale-95 truncate max-w-[110px]"
                          >
                            {student.exam2.id}
                          </span>
                        )}
                      </td>
                      <td className="p-4 border-r-2 border-[#1E293B] text-center">
                        {student.exam3 && (
                          <span
                            onClick={() => onShowOutcomeDetails('exam3', idx)}
                            title={student.exam3.desc}
                            className="inline-block text-[10px] font-mono font-black text-[#1E293B] bg-[#FFFDF5] border-2 border-[#1E293B] rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-[#FBBF24] hover:text-[#1E293B] transition-all hover:scale-105 active:scale-95 truncate max-w-[110px]"
                          >
                            {student.exam3.id}
                          </span>
                        )}
                      </td>
                      <td className="p-4 border-r-2 border-[#1E293B] text-center">
                        {student.exam4 && (
                          <span
                            onClick={() => onShowOutcomeDetails('exam4', idx)}
                            title={student.exam4.desc}
                            className="inline-block text-[10px] font-mono font-black text-[#1E293B] bg-[#FFFDF5] border-2 border-[#1E293B] rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-[#34D399] hover:text-[#1E293B] transition-all hover:scale-105 active:scale-95 truncate max-w-[110px]"
                          >
                            {student.exam4.id}
                          </span>
                        )}
                      </td>
                      <td className="p-4 border-r-2 border-[#1E293B] text-center">
                        {student.exam5 && (
                          <span
                            onClick={() => onShowOutcomeDetails('exam5', idx)}
                            title={student.exam5.desc}
                            className="inline-block text-[10px] font-mono font-black text-[#1E293B] bg-[#FFFDF5] border-2 border-[#1E293B] rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-[#8B5CF6] hover:text-white transition-all hover:scale-105 active:scale-95 truncate max-w-[110px]"
                          >
                            {student.exam5.id}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => onOpenContract(idx)}
                          className="inline-flex items-center gap-1.5 bg-[#FFFDF5] hover:bg-[#FBBF24] text-[#1E293B] text-[10px] font-display font-black uppercase tracking-wider px-3 py-2 rounded-xl border-2 border-[#1E293B] transition-all cursor-pointer pop-shadow-sm active:translate-y-[1px]"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-16 text-center text-[#64748B] text-base italic font-semibold">
                      No matching student or outcome found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
