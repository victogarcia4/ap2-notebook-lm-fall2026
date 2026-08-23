import React, { useState } from 'react';
import { Sparkles, ArrowDown, Activity, Sliders, Zap, Circle, Award, BookOpen, Video } from 'lucide-react';
import GeminiNotebookName from './GeminiNotebookName';

type PatternType = 'dots' | 'grid' | 'confetti' | 'blobs';

export default function Hero() {
  const [activePattern, setActivePattern] = useState<PatternType>('dots');
  const [activeSticker, setActiveSticker] = useState<number>(0);

  const scrollToAbout = () => {
    const section = document.getElementById('about-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const interactiveStickers = [
    { title: "Volume I", emoji: "❤️", desc: "Blood & Cardiac", bg: "bg-secondary" },
    { title: "Volume II", emoji: "🫁", desc: "Immunity & Breath", bg: "bg-accent" },
    { title: "Volume III", emoji: "🍎", desc: "Digestive & Nutrition", bg: "bg-tertiary" },
    { title: "Volume IV", emoji: "💧", desc: "Urinary & Fluids", bg: "bg-quaternary" },
    { title: "Volume V", emoji: "🧬", desc: "Reproduction & Genetics", bg: "bg-secondary" }
  ];

  return (
    <section className="relative overflow-hidden min-h-screen bg-[#FFFDF5] flex flex-col justify-between text-[#1E293B] select-none border-b-4 border-[#1E293B] pb-12 pt-6">
      
      {/* Playful Pattern Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {activePattern === 'dots' && (
          <div className="absolute inset-0 bg-[#FFFDF5] opacity-25" style={{
            backgroundImage: 'radial-gradient(#1E293B 2px, transparent 2px)',
            backgroundSize: '24px 24px'
          }} />
        )}
        {activePattern === 'grid' && (
          <div className="absolute inset-0 bg-[#FFFDF5] opacity-15" style={{
            backgroundImage: 'linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
        )}
        {activePattern === 'confetti' && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Absolute positioned colorful shapes */}
            <div className="absolute top-[15%] left-[5%] w-10 h-10 rounded-full bg-[#8B5CF6] border-2 border-[#1E293B] pop-shadow-sm animate-float-1" />
            <div className="absolute top-[25%] right-[8%] w-8 h-8 bg-[#F472B6] border-2 border-[#1E293B] rotate-12 pop-shadow-sm animate-float-2" />
            <div className="absolute bottom-[20%] left-[12%] w-12 h-12 bg-[#FBBF24] border-2 border-[#1E293B] rotate-45 pop-shadow-sm animate-float-2" />
            <div className="absolute bottom-[35%] right-[15%] w-10 h-10 rounded-xl bg-[#34D399] border-2 border-[#1E293B] -rotate-12 pop-shadow-sm animate-float-1" />
          </div>
        )}
        {activePattern === 'blobs' && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Playful massive solid background blobs */}
            <div className="absolute -top-[100px] -left-[100px] w-[350px] h-[350px] rounded-full bg-[#FBBF24] opacity-20 border-4 border-dashed border-[#1E293B]" />
            <div className="absolute -bottom-[150px] -right-[100px] w-[500px] h-[500px] rounded-full bg-[#F472B6] opacity-15 border-4 border-dashed border-[#1E293B]" />
            <div className="absolute top-[40%] left-[45%] w-[120px] h-[120px] rounded-full bg-[#8B5CF6] opacity-10 animate-float-1" />
          </div>
        )}
      </div>

      {/* Chunky-Bordered Floating Navbar */}
      <header className="relative w-full px-4 z-20 shrink-0">
        <div className="max-w-6xl mx-auto bg-white border-4 border-[#1E293B] rounded-full px-6 py-3 flex items-center justify-between shadow-[4px_4px_0px_0px_#1E293B]">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white pop-shadow-sm hover:rotate-12 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-display font-extrabold text-sm uppercase tracking-wider text-[#1E293B]">
              AXION STUDY
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-display font-bold text-[#1E293B] hover:text-[#8B5CF6] transition-colors cursor-pointer uppercase tracking-wider"
            >
              Home
            </button>
            <button
              onClick={scrollToAbout}
              className="text-xs font-display font-bold text-[#1E293B] hover:text-[#8B5CF6] transition-colors cursor-pointer uppercase tracking-wider"
            >
              Pedagogy
            </button>
            <button
              onClick={() => document.getElementById('video-guides-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-display font-bold text-[#1E293B] hover:text-[#8B5CF6] transition-colors cursor-pointer uppercase tracking-wider"
            >
              Walkthroughs
            </button>
            <a
              href="#zoom-explanation-section"
              className="text-xs font-display font-bold text-[#1E293B] hover:text-[#8B5CF6] transition-colors uppercase tracking-wider"
            >
              Interactive Deck
            </a>
          </nav>

          {/* Term Setting Indicator */}
          <div className="flex items-center gap-2 bg-[#FBBF24] border-2 border-[#1E293B] px-4 py-1 rounded-full pop-shadow-sm hover:-translate-y-0.5 transition-transform">
            <Sparkles className="w-3.5 h-3.5 text-[#1E293B]" />
            <span className="text-[10px] font-display text-[#1E293B] uppercase tracking-wider font-extrabold">
              BIOL 2402 &bull; SU26
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Intro text, Right Sticker Composition */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
        
        {/* Left Column: Big Bold Typography */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#34D399] border-2 border-[#1E293B] rounded-full text-xs font-bold text-[#1E293B] pop-shadow-sm rotate-[-1deg]">
            <Zap className="w-4 h-4 fill-[#1E293B]" />
            <span>ACTIVE CONCEPTS REPOSITORY</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1E293B] leading-none">
            Mastery Learning <br />
            <span className="bg-[#8B5CF6] text-white px-3 py-1 inline-block border-4 border-[#1E293B] pop-shadow-md rotate-[-2deg] my-2">
              Covenant Portal
            </span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#1E293B] leading-relaxed max-w-2xl font-medium">
            Accelerate your A&amp;P II concepts with mathematical precision. Convert official HAPS standardized learning outcomes into beautiful multimedia deliverables using customized Google <GeminiNotebookName /> triggers.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                const section = document.getElementById('video-guides-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className="candy-button bg-[#34D399] text-[#1E293B] border-2 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] inline-flex items-center justify-center gap-2 text-sm py-3.5 px-8 cursor-pointer uppercase tracking-wider hover:bg-[#10B981]"
            >
              <span>Watch App Intro</span>
              <Video className="w-4 h-4 text-[#1E293B] fill-current" />
            </button>

            <button
              onClick={() => {
                const section = document.getElementById('zoom-explanation-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className="candy-button inline-flex items-center justify-center gap-2 text-sm py-3.5 px-8 cursor-pointer uppercase tracking-wider animate-pulse hover:animate-none"
            >
              <span>Explore Interactive Deck</span>
              <ArrowDown className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={scrollToAbout}
              className="candy-button-outline inline-flex items-center justify-center gap-2 text-sm py-3.5 px-8 cursor-pointer uppercase tracking-wider"
            >
              <span>Read Curriculum Guide</span>
            </button>
          </div>

          <div className="pt-2">
            <p className="text-xs font-mono text-[#64748B] flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#8B5CF6]" />
              Designed for Lone Star College &bull; Dr. Victor Garcia Martinez
            </p>
          </div>
        </div>

        {/* Right Column: Colorful Bento Sticker Cards composition */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          
          {/* Big yellow decorative circle behind the composition */}
          <div className="absolute w-80 h-80 rounded-full bg-[#FBBF24] border-4 border-[#1E293B] opacity-40 z-0 animate-pulse" />

          {/* Asymmetric composition of stickers */}
          <div className="relative z-10 w-full max-w-[380px] h-[360px] flex items-center justify-center">
            
            {/* Sticker 1: Dr. Garcia Profile Sticker */}
            <div className="absolute top-2 left-2 w-44 bg-white border-4 border-[#1E293B] p-4 rounded-2xl rotate-[-4deg] shadow-[4px_4px_0px_0px_#1E293B] hover:rotate-0 transition-transform duration-300 flex flex-col items-center text-center">
              <img
                src="/VHGM traje azul.png"
                alt="Dr. Victor Garcia M."
                className="w-14 h-14 rounded-full object-cover border-2 border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] mb-2 hover:scale-105 transition-transform shrink-0"
              />
              <p className="font-display font-extrabold text-xs text-[#1E293B]">Dr. Victor Garcia M.</p>
              <p className="text-[10px] text-[#64748B] font-bold font-mono">Nursing &amp; Bio Faculty</p>
            </div>

            {/* Sticker 2: Interactive outcome counts */}
            <div className="absolute bottom-4 right-2 w-44 bg-[#F472B6] border-4 border-[#1E293B] p-4 rounded-xl rotate-[6deg] shadow-[4px_4px_0px_0px_#1E293B] text-white hover:rotate-0 transition-transform duration-300">
              <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold">Active Cohort</span>
              <p className="text-3xl font-display font-black leading-none my-1">28 Scholars</p>
              <p className="text-xs font-semibold leading-tight">Assigned and tracked deterministically.</p>
            </div>

            {/* Sticker 3: Lecture Exam Highlights (Interactive) */}
            <div className="absolute top-[90px] right-4 w-48 bg-white border-4 border-[#1E293B] rounded-2xl p-4 rotate-[-1deg] shadow-[6px_6px_0px_0px_#1E293B] flex flex-col justify-between hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between border-b-2 border-[#1E293B] pb-2 mb-2">
                <span className="text-[10px] font-display font-black uppercase tracking-wider text-[#8B5CF6]">Syllabus Tracker</span>
                <span className="text-xs">💡</span>
              </div>
              <p className="text-[11px] font-sans font-bold text-[#1E293B]">
                Click below to select high-priority exam modules:
              </p>
              
              <div className="grid grid-cols-5 gap-1 mt-3">
                {interactiveStickers.map((stick, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSticker(idx)}
                    title={`${stick.title}: ${stick.desc}`}
                    className={`w-7 h-7 rounded border-2 border-[#1E293B] flex items-center justify-center text-xs font-bold transition-all ${
                      activeSticker === idx ? 'bg-[#FBBF24] scale-110 pop-shadow-sm' : 'bg-gray-100 hover:bg-white'
                    }`}
                  >
                    {stick.emoji}
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-dashed border-gray-300 text-center">
                <p className="text-[9px] font-mono font-bold text-[#8B5CF6] uppercase tracking-wider">
                  {interactiveStickers[activeSticker].title} &bull; {interactiveStickers[activeSticker].desc}
                </p>
              </div>
            </div>

            {/* Floating pop-art mini shape */}
            <div className="absolute bottom-6 left-6 w-12 h-12 bg-[#FBBF24] border-4 border-[#1E293B] rounded-full flex items-center justify-center font-display font-black text-[#1E293B] rotate-12 animate-bounce">
              61
            </div>

          </div>
        </div>

      </div>

      {/* Pattern Switcher & Scroll Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0 mt-6 pt-4">
        
        {/* Interactive Pattern Selector */}
        <div className="bg-white border-4 border-[#1E293B] rounded-2xl p-2.5 shadow-[4px_4px_0px_0px_#1E293B] flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 text-[#1E293B] font-display text-[10px] uppercase font-black tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Patterns:</span>
          </div>
          
          {(['dots', 'grid', 'confetti', 'blobs'] as PatternType[]).map((pattern) => (
            <button
              key={pattern}
              onClick={() => setActivePattern(pattern)}
              type="button"
              className={`px-3 py-1.5 rounded-xl text-[10px] font-display font-extrabold uppercase tracking-wider transition-all cursor-pointer border-2 ${
                activePattern === pattern
                  ? 'bg-[#8B5CF6] text-white border-[#1E293B] pop-shadow-sm'
                  : 'text-[#64748B] border-transparent hover:bg-gray-100'
              }`}
            >
              {pattern}
            </button>
          ))}
        </div>

        {/* Scroll Action Button */}
        <button
          onClick={scrollToAbout}
          type="button"
          className="flex items-center gap-3 bg-[#34D399] border-4 border-[#1E293B] px-5 py-2 rounded-full shadow-[4px_4px_0px_0px_#1E293B] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] transition-all cursor-pointer"
        >
          <span className="font-display text-[10px] text-[#1E293B] uppercase tracking-wider font-extrabold">
            Learn More
          </span>
          <ArrowDown className="w-4 h-4 text-[#1E293B]" />
        </button>
      </footer>

      {/* Infinite Horizontal Marquee Ticker */}
      <div className="relative w-full overflow-hidden bg-[#1E293B] text-white py-3 mt-12 border-y-4 border-[#1E293B] rotate-[-0.5deg]">
        <div className="marquee-content flex gap-8 font-display text-xs font-black uppercase tracking-widest">
          {/* First run */}
          <span className="mx-4 text-[#FBBF24]">ABO & Rh COMPATIBILITY</span> &bull;
          <span className="mx-4 text-[#F472B6]">ADRENAL ZONE SECRETIONS</span> &bull;
          <span className="mx-4 text-[#34D399]">SA NODE ACTION POTENTIALS</span> &bull;
          <span className="mx-4 text-[#FFFDF5]">LYMPHATIC TRANSPORT LOOPS</span> &bull;
          <span className="mx-4 text-[#FBBF24]">ALVEOLI TENSION & SURFACTANT</span> &bull;
          <span className="mx-4 text-[#F472B6]">GLOMERULAR FILTRATION RATE</span> &bull;
          <span className="mx-4 text-[#34D399]">OOGENESIS & MEIOSIS II</span> &bull;
          <span className="mx-4 text-[#FFFDF5]">PUNNETT SQUARE DYNAMICS</span> &bull;
          {/* Second duplicated run for seamless infinity */}
          <span className="mx-4 text-[#FBBF24]">ABO & Rh COMPATIBILITY</span> &bull;
          <span className="mx-4 text-[#F472B6]">ADRENAL ZONE SECRETIONS</span> &bull;
          <span className="mx-4 text-[#34D399]">SA NODE ACTION POTENTIALS</span> &bull;
          <span className="mx-4 text-[#FFFDF5]">LYMPHATIC TRANSPORT LOOPS</span> &bull;
          <span className="mx-4 text-[#FBBF24]">ALVEOLI TENSION & SURFACTANT</span> &bull;
          <span className="mx-4 text-[#F472B6]">GLOMERULAR FILTRATION RATE</span> &bull;
          <span className="mx-4 text-[#34D399]">OOGENESIS & MEIOSIS II</span> &bull;
          <span className="mx-4 text-[#FFFDF5]">PUNNETT SQUARE DYNAMICS</span> &bull;
        </div>
      </div>

    </section>
  );
}
