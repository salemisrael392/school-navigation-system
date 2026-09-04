import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start text-[#0c1c2f]">
      {/* Top Floating Control Bar for testing */}
      <div className="w-full max-w-2xl px-4 py-2 flex items-center justify-between text-xs text-slate-400 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-300">
            SR University Campus App (React Native Expo Preview)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFrame(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              isMobileFrame
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile Screen View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone Frame</span>
          </button>
          <button
            onClick={() => setIsMobileFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              !isMobileFrame
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Responsive Full View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Width</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isMobileFrame ? (
        <div className="my-2 sm:my-4 w-full max-w-[420px] shadow-2xl rounded-[38px] overflow-hidden border-[7px] border-slate-800 bg-[#f8f9ff] flex flex-col relative ring-1 ring-slate-700/50 min-h-[840px]">
          {/* Mobile Status Bar */}
          <div className="bg-[#f8f9ff] px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-900 select-none z-40 border-b border-transparent">
            <span>9:41</span>
            {/* Dynamic Island / Speaker Pill */}
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
            </div>
            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Body */}
          <div className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar">
            {children}
          </div>

          {/* Home indicator bar */}
          <div className="bg-white py-1.5 flex justify-center z-40">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-[#f8f9ff] min-h-screen flex flex-col shadow-xl">
          {children}
        </div>
      )}
    </div>
  );
};
