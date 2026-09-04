import React, { useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  Mic,
  SlidersHorizontal,
  Ticket,
  X,
  Navigation,
  Route,
  CalendarDays,
  Building2,
  Compass,
  PhoneCall,
  QrCode,
  Share2,
} from 'lucide-react';
import { TabType } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenGuestPass: () => void;
  onOpenNotifications: () => void;
  onOpenSOS: () => void;
  onOpenShareModal: () => void;
  onSelectBlock?: (blockId: string) => void;
  selectedBlockId?: string;
  hasUpcomingClass?: boolean;
  unreadCount?: number;
  onVoiceSearch: () => void;
  onOpenFilterSheet: () => void;
  isListening?: boolean;
}

const ACADEMIC_BLOCK_CHIPS = [
  { id: 'srix-block-a', label: 'Block A (CSE)', query: 'Block A' },
  { id: 'block-b', label: 'Block B (Mech)', query: 'Block B' },
  { id: 'block-c', label: 'Block C (ECE)', query: 'Block C' },
  { id: 'block-d', label: 'Block D (Science)', query: 'Block D' },
  { id: 'block-e', label: 'Block E (MBA)', query: 'Block E' },
  { id: 'centenary-bhavan', label: 'Admin Block', query: 'Admin Block' },
  { id: 'central-library', label: 'Central Library', query: 'Central Library' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Locations', hasDot: true },
  { id: 'academic', label: 'Academic Blocks', icon: '🏛️' },
  { id: 'admin', label: 'Admin HQ', icon: '🏢' },
  { id: 'lab', label: 'Labs & R&D', icon: '🔬' },
  { id: 'sports', label: 'Sports & Gym', icon: '🏸' },
  { id: 'hostel', label: 'Hostels & Mess', icon: '🛏️' },
  { id: 'amenity', label: 'Amenities', icon: '☕' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenGuestPass,
  onOpenNotifications,
  onOpenSOS,
  onOpenShareModal,
  onSelectBlock,
  selectedBlockId,
  hasUpcomingClass = true,
  unreadCount = 2,
  onVoiceSearch,
  onOpenFilterSheet,
  isListening = false,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Press '/' or 'Meta+k' to quickly focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navTabs = [
    { id: 'explore' as TabType, label: 'Interactive Map', icon: Navigation },
    { id: 'navigate' as TabType, label: 'Wayfinding & Route', icon: Route },
    {
      id: 'schedule' as TabType,
      label: 'Class Timetable',
      icon: CalendarDays,
      badge: hasUpcomingClass,
    },
    { id: 'directory' as TabType, label: 'Campus Directory', icon: Building2 },
    { id: 'freshers' as TabType, label: 'Freshers Hub', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2d8c3]/60 shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onChangeTab('explore')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none group"
            title="SR University Interactive Campus Portal"
          >
            <div
              id="sru-badge-logo"
              className="w-10 h-10 rounded-2xl bg-[#000923] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs border border-slate-700/50 shrink-0 group-hover:scale-105 transition-transform"
            >
              sru
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold text-[#000923] leading-tight truncate">
                  SR University
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
                  Web Portal
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                Ananthasagar, Hasanparthy, Warangal
              </p>
            </div>
          </div>

          {/* Desktop Web Navigation Links (Hidden on mobile, visible on md+) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`web-nav-tab-${tab.id}`}
                  onClick={() => {
                    triggerHaptic('tap');
                    onChangeTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-white text-[#000923] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-[#c88d3b] stroke-[2.2]' : 'text-slate-500'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Emergency SOS button */}
            <button
              id="btn-header-sos"
              onClick={onOpenSOS}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Campus Security & Medical Emergency SOS"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Emergency SOS</span>
              <span className="sm:hidden">SOS</span>
            </button>

            {/* Share Portal & Scannable QR Code Button */}
            <button
              id="btn-header-share-qr"
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#fef7ee] hover:bg-[#faebd7] border border-[#e2d8c3] text-[#000923] rounded-xl text-left transition-all active:scale-98 shadow-2xs cursor-pointer"
              title="Share Campus Portal & QR Code with friends"
            >
              <QrCode className="w-3.5 h-3.5 text-[#c88d3b]" />
              <span className="text-xs font-bold leading-none text-[#000923]">
                Share <span className="hidden sm:inline">QR</span>
              </span>
            </button>

            {/* Guest Pass Button */}
            <button
              id="btn-guest-pass"
              onClick={onOpenGuestPass}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#bfd2fd] text-[#0e2044] rounded-xl text-left transition-all active:scale-98 shadow-2xs cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-[#4c5e83]" />
              <span className="text-xs font-bold leading-none text-[#0e2044]">
                Guest Pass
              </span>
            </button>

            {/* Notification Bell */}
            <button
              id="btn-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors focus:outline-none cursor-pointer rounded-xl hover:bg-slate-100 border border-slate-200/60"
              aria-label="Campus Alerts & Notifications"
              title="Campus Alerts"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-3">
          {/* Universal Search Bar */}
          <div className="relative flex-1">
            <div className="relative flex items-center w-full bg-[#f8f9ff] rounded-2xl border border-[#e2d8c3] shadow-2xs px-3.5 py-2 focus-within:bg-white focus-within:border-[#c88d3b] focus-within:ring-2 focus-within:ring-[#c88d3b]/20 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                ref={searchInputRef}
                id="campus-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search blocks (A, B, C, D, E), labs, classrooms, offices..."
                className="w-full bg-transparent text-xs sm:text-sm text-[#0c1c2f] placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Keyboard Shortcut Hint for Web */}
              <div className="hidden lg:flex items-center mr-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-mono text-[10px] font-semibold">
                  /
                </kbd>
              </div>

              <div className="flex items-center gap-1 pl-1 border-l border-slate-200 shrink-0">
                <button
                  id="btn-voice-search"
                  onClick={onVoiceSearch}
                  className={`p-1 rounded-full transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-red-50 text-red-600 animate-pulse'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  id="btn-filter-settings"
                  onClick={onOpenFilterSheet}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                  title="Filter Categories"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-pill-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-96 cursor-pointer ${
                    isActive
                      ? 'bg-[#000923] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-[#e2d8c3]/70 hover:bg-slate-50'
                  }`}
                >
                  {cat.hasDot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c88d3b]" />
                  )}
                  {cat.icon && <span className="text-[11px]">{cat.icon}</span>}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Academic Block Quick Search Row */}
        <div className="mt-2 pt-2 border-t border-slate-100/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 pr-1">
            <Building2 className="w-3.5 h-3.5 text-[#c88d3b]" />
            Block Finder:
          </span>
          {ACADEMIC_BLOCK_CHIPS.map((blk) => {
            const isSelected =
              selectedBlockId === blk.id ||
              (searchQuery && searchQuery.toLowerCase().includes(blk.query.toLowerCase()));
            return (
              <button
                key={blk.id}
                id={`block-chip-${blk.id}`}
                onClick={() => {
                  triggerHaptic('tap');
                  if (onSelectBlock) {
                    onSelectBlock(blk.id);
                  } else {
                    onSearchChange(blk.query);
                  }
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-[#000923] text-white border-[#000923] shadow-xs font-bold'
                    : 'bg-[#f4f6fb] text-slate-700 border-slate-200/80 hover:bg-white hover:border-[#c88d3b]'
                }`}
              >
                <span>{blk.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

