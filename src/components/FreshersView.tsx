import React, { useState } from 'react';
import {
  Compass,
  Wifi,
  Bus,
  Utensils,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { FRESHERS_GUIDE_SECTIONS } from '../data/campusData';

export const FreshersView: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('wifi');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    idCard: true,
    wifiConfig: true,
    messPass: false,
    libraryReg: false,
    busPass: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getSectionIcon = (icon: string) => {
    switch (icon) {
      case 'Wifi':
        return <Wifi className="w-4 h-4 text-[#0e2044]" />;
      case 'Bus':
        return <Bus className="w-4 h-4 text-[#0e2044]" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-[#0e2044]" />;
      default:
        return <GraduationCap className="w-4 h-4 text-[#0e2044]" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-5 pb-20">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#000923] text-white flex items-center justify-center shadow-xs">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#000923]">Freshers Survival Guide</h2>
          <p className="text-xs sm:text-sm text-slate-500">Essential onboarding, Wi-Fi, bus schedules &amp; dining</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Left Column: Freshers Checklist */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#e2d8c3] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#000923] uppercase tracking-wider">
                Orientation Checklist
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                {Object.values(checklist).filter(Boolean).length} / 5 Done
              </span>
            </div>

            <div className="space-y-2">
              {[
                { id: 'idCard', label: 'Collect RFID Smart Campus ID from Centenary Bhavan' },
                { id: 'wifiConfig', label: 'Configure 802.1X Wi-Fi on phone & laptop' },
                { id: 'messPass', label: 'Activate Biometric Meal Plan at Dining Bay A' },
                { id: 'libraryReg', label: 'Activate Central Library Koha digital membership' },
                { id: 'busPass', label: 'Submit Warangal/Hanamkonda university bus pass application' },
              ].map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-xs sm:text-sm transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.id] || false}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#000923] accent-[#000923] cursor-pointer shrink-0"
                  />
                  <span
                    className={`flex-1 ${
                      checklist[item.id]
                        ? 'line-through text-slate-400'
                        : 'text-slate-700 font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Anti-Ragging Assurance */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-amber-900">Zero Tolerance Anti-Ragging Policy</h4>
              <p className="text-amber-800 text-[11px] sm:text-xs mt-0.5">
                SR University maintains a strictly ragging-free campus. 24x7 squad helpline: (0870) 281-8555.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Guides Accordions */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block px-1">
            Campus Guides &amp; Timetables
          </span>

          {FRESHERS_GUIDE_SECTIONS.map((section) => {
            const isExpanded = expandedSection === section.id;
            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl border border-[#e6dec8] overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedSection(isExpanded ? null : section.id)
                  }
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#eff4ff] flex items-center justify-center shrink-0">
                      {getSectionIcon(section.icon)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#000923] truncate">
                        {section.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                        {section.summary}
                      </p>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-slate-50/50 border-t border-slate-100 space-y-2">
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                      {section.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c88d3b] mt-1.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
