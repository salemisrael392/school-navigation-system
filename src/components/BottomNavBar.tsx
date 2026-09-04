import React from 'react';
import { Navigation, Route, CalendarDays, Building2, Compass } from 'lucide-react';
import { TabType } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  hasUpcomingClass?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  hasUpcomingClass = true,
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
      id: 'schedule' as TabType,
      label: 'Schedule',
      icon: CalendarDays,
      badge: hasUpcomingClass,
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
      className="md:hidden sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2d8c3]/60 shadow-lg px-2 py-1 w-full flex justify-center pb-[max(0.25rem,env(safe-area-inset-bottom))]"
    >
      <div className="w-full max-w-2xl flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => {
                triggerHaptic('tap');
                onChangeTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 sm:px-4 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#000923]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`p-1 sm:p-1.5 rounded-full transition-all relative ${
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
                {tab.badge && !isActive && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#000923]' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
