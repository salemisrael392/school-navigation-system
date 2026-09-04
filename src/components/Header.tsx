import React from 'react';
import { Bell, Search, Mic, SlidersHorizontal, Ticket, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenGuestPass: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  onVoiceSearch: () => void;
  onOpenFilterSheet: () => void;
  isListening?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Blocks', hasDot: true },
  { id: 'academic', label: 'Academic', icon: '🏛️' },
  { id: 'admin', label: 'Admin & Offices', icon: '🏢' },
  { id: 'lab', label: 'Labs & R&D', icon: '🔬' },
  { id: 'sports', label: 'Sports & Gym', icon: '🏸' },
  { id: 'hostel', label: 'Hostels & Mess', icon: '🛏️' },
  { id: 'amenity', label: 'Amenities', icon: '☕' },
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenGuestPass,
  onOpenNotifications,
  unreadCount = 2,
  onVoiceSearch,
  onOpenFilterSheet,
  isListening = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#f8f9ff]/95 backdrop-blur-md pt-2 pb-2 px-3 sm:px-4 border-b border-[#e2d8c3]/40 shadow-xs">
      {/* Top Identity Row */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          {/* SRU Logo Badge */}
          <div
            id="sru-badge-logo"
            className="w-10 h-10 rounded-full bg-[#000923] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm border border-slate-700/50 shrink-0"
          >
            sru
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-[#000923] leading-tight truncate">
                SR Univers...
              </h1>
              {/* Notification Bell */}
              <button
                id="btn-notifications"
                onClick={onOpenNotifications}
                className="relative p-1 text-slate-700 hover:text-slate-900 transition-colors focus:outline-none"
                aria-label="Campus Alerts & Notifications"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute 0.5 top-0 right-0.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-[#f8f9ff]" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              Ananthasagar, Ha...
            </p>
          </div>
        </div>

        {/* Guest Pass Button */}
        <button
          id="btn-guest-pass"
          onClick={onOpenGuestPass}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#bfd2fd] text-[#0e2044] rounded-xl text-left transition-all active:scale-98 shrink-0 shadow-2xs cursor-pointer"
        >
          <Ticket className="w-3.5 h-3.5 text-[#4c5e83]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold leading-none text-[#0e2044]">
              Guest Pass
            </span>
            <span className="text-[9px] text-slate-500 font-medium leading-tight">
              No Login Needed
            </span>
          </div>
        </button>
      </div>

      {/* Universal Search Bar */}
      <div className="relative mb-2.5">
        <div className="relative flex items-center w-full bg-white rounded-2xl border border-[#e2d8c3] shadow-xs px-3.5 py-2.5 focus-within:border-[#c88d3b] focus-within:ring-2 focus-within:ring-[#c88d3b]/20 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
          <input
            id="campus-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search blocks, labs, seminar halls, of..."
            className="w-full bg-transparent text-sm text-[#0c1c2f] placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 mr-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200 shrink-0">
            <button
              id="btn-voice-search"
              onClick={onVoiceSearch}
              className={`p-1.5 rounded-full transition-colors ${
                isListening
                  ? 'bg-red-50 text-red-600 animate-pulse'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              id="btn-filter-settings"
              onClick={onOpenFilterSheet}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-full transition-colors"
              title="Filter Categories"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
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
    </header>
  );
};
