import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Lock, Video, MonitorPlay } from 'lucide-react';
import GeminiNotebookName from './GeminiNotebookName';

export default function CaseStudiesSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText('+$2vz&RC');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="video-guides-section" className="bg-[#FFFDF5] py-24 border-b-4 border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F472B6] border-2 border-[#1E293B] rounded-full text-white text-xs font-bold tracking-wide pop-shadow-sm rotate-[1.5deg] mb-4">
            <MonitorPlay className="w-3.5 h-3.5 fill-white" />
            <span>MULTIMEDIA LAB</span>
          </div>
          <h2 className="text-4xl font-display font-black text-[#1E293B] leading-none">
            Walkthroughs &amp; <br />
            <span className="bg-[#FBBF24] px-2 py-0.5 inline-block border-2 border-[#1E293B] rotate-[-1deg] mt-1">Video Guides</span>
          </h2>
          <p className="text-[#1E293B] font-medium text-sm mt-3 leading-relaxed">
            Examine the professor's detailed Zoom syllabus walk-through. Convert complex physiological paths into clear creative expressions.
          </p>
        </div>

        {/* Video Card Container - Two-Column Grid on Larger Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch max-w-5xl mx-auto">
          
          {/* Card 1: Embedded Introduction Video Player - Playful Memphis Card */}
          <div className="bg-[#FFF] rounded-2xl overflow-hidden border-4 border-[#1E293B] shadow-[6px_6px_0px_0px_#1E293B] hover:shadow-[8px_8px_0px_0px_#1E293B] hover:-translate-y-1 transition-all flex flex-col w-full text-[#1E293B] relative group">
            
            {/* Header branding */}
            <div className="bg-[#8B5CF6] text-white border-b-4 border-[#1E293B] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#34D399] animate-ping" />
                <span className="font-display text-[10px] uppercase tracking-wider font-extrabold">
                  Application Introduction
                </span>
              </div>
              <span className="text-[10px] font-mono font-extrabold bg-[#1E293B] text-white border-2 border-[#1E293B] px-2 py-0.5 rounded-full">
                Interactive Walkthrough
              </span>
            </div>

            <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-xl overflow-hidden border-4 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] bg-slate-900 relative">
                  <iframe
                    src="https://docs.google.com/videos/d/1DzxOGAnVKs2LiPgcjIpST_XAeJq0QGyuehsYX1Pu2Tw/play?usp=sharing"
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title="BIOL 2402 Active Study Portal Walkthrough"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-display font-black text-[#1E293B] leading-tight">
                    Portal <br />
                    <span className="bg-[#34D399] px-2 py-0.5 inline-block border-2 border-[#1E293B] rotate-[1deg] mt-1 text-sm font-extrabold">Welcome Walkthrough</span>
                  </h3>
                  <p className="text-[#1E293B] text-xs font-semibold mt-3 leading-relaxed">
                    Watch this comprehensive introduction to get oriented with the Active Mastery Learning Portal. Discover how to view your individualized HAPS outcomes, locate assigned syllabus chapters, and export your personal covenants.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-[#1E293B]">
                <ul className="text-xs font-bold text-[#1E293B] space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] border border-[#1E293B]" />
                    <span>Explore your customized Exam SLOs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#34D399] border border-[#1E293B]" />
                    <span>Copy custom instructions for Google <GeminiNotebookName /></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Zoom Cloud Explanation Recording - Playful Ticket Stub Style */}
          <div className="bg-[#FBBF24] rounded-2xl overflow-hidden border-4 border-[#1E293B] shadow-[6px_6px_0px_0px_#1E293B] hover:shadow-[8px_8px_0px_0px_#1E293B] hover:-translate-y-1 transition-all flex flex-col w-full text-[#1E293B] relative group">
            
            {/* Header branding */}
            <div className="bg-white border-b-4 border-[#1E293B] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse border border-[#1E293B]" />
                <span className="font-display text-[10px] uppercase tracking-wider font-extrabold text-[#1E293B]">
                  Zoom Recording
                </span>
              </div>
              <span className="text-[10px] font-mono font-extrabold text-[#1E293B] bg-[#34D399] border-2 border-[#1E293B] px-2 py-0.5 rounded-full">
                40 min
              </span>
            </div>

            <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] pop-shadow-sm">
                  <Video className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-[#1E293B] leading-tight">
                    Dr. Garcia's <br />
                    <span className="bg-[#34D399] px-2 py-0.5 inline-block border-2 border-[#1E293B] rotate-[-1deg] mt-1 text-sm font-extrabold">Recorded Explanation</span>
                  </h3>
                  <p className="text-[#1E293B] text-xs font-semibold mt-3 leading-relaxed">
                    Watch the comprehensive syllabus walkthrough. This cloud lecture explains the design of HAPS learning contracts and active student presentation pipelines.
                  </p>
                </div>
              </div>

              {/* Passcode Copy & Launch Actions Container */}
              <div className="mt-6 pt-6 border-t-2 border-dashed border-[#1E293B] space-y-4">
                
                {/* Copy Passcode Row */}
                <div className="bg-white border-2 border-[#1E293B] rounded-xl p-3 flex items-center justify-between pop-shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span className="text-[#64748B]">Passcode:</span>
                    <span className="font-mono text-[#1E293B] font-black bg-gray-100 px-2 py-1 rounded border border-[#E2E8F0] select-all">
                      +$2vz&amp;RC
                    </span>
                  </div>

                  <button
                    onClick={handleCopyPasscode}
                    type="button"
                    className="p-1.5 rounded-lg border-2 border-[#1E293B] bg-white hover:bg-[#34D399] text-[#1E293B] transition-colors cursor-pointer flex items-center justify-center pop-shadow-sm active:translate-y-0.5"
                    title="Copy passcode to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Launch Button styled as Candy Button */}
                <a
                  href="https://us02web.zoom.us/rec/play/Br6f0u-lfyUb-_Kb5nfVQFwMNehN7rqU7bdSdaopq9JJliukMCWlVQ15MlRGEz5Hr50CEWVZ8PxtMuPD.LZvqVX8Ni3uXGmdg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#8B5CF6] text-white font-display font-black text-xs py-3.5 px-4 rounded-xl border-2 border-[#1E293B] shadow-[4px_4px_0px_0px_#1E293B] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1E293B] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                >
                  <span>Launch Cloud Tutorial</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
