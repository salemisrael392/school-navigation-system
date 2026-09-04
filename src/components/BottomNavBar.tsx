import React from 'react';
import { Navigation, Route, Building2, Compass, GraduationCap } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    {
      id: 'explore' as TabType,
      label: 'Explore',
      icon: Navigation,
    },
    {
      id: 'navigate' as TabType,
      label: 'Navigate',
      icon: Route,
    },
    {
      id: 'directory' as TabType,
      label: 'Directory',
      icon: Building2,
    },
    {
      id: 'freshers' as TabType,
      label: 'Freshers',
      icon: Compass,
    },
  ];

  return (
    <nav
      id="campus-bottom-navigation"
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2d8c3]/60 shadow-lg px-2 py-1 flex items-center justify-around"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#000923]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`p-1 rounded-full transition-all ${
                isActive ? 'bg-[#dce9ff]' : 'bg-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-[#000923] fill-[#000923]/20 stroke-[2.2]'
                    : 'text-slate-400 stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10.5px] mt-0.5 tracking-tight ${
                isActive ? 'font-bold text-[#000923]' : 'font-medium text-slate-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
