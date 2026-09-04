import React, { useState } from 'react';
import { Search, Building2, MapPin, Navigation, Phone, ChevronRight } from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { Building } from '../types';

interface DirectoryViewProps {
  onSelectBuilding: (building: Building) => void;
  onNavigateToBuilding: (building: Building) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  onSelectBuilding,
  onNavigateToBuilding,
}) => {
  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredBuildings = CAMPUS_BUILDINGS.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      b.facilities.some((f) => f.name.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      activeCategory === 'all' || b.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-4 pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#000923] text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#000923]">Campus Directory</h2>
            <p className="text-xs sm:text-sm text-slate-500">All blocks, academic schools &amp; student offices</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-white border border-[#e2d8c3] px-2.5 py-1 rounded-xl shadow-2xs">
          {CAMPUS_BUILDINGS.length} Locations
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by block, department, or lab name..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#e2d8c3] text-sm text-[#0c1c2f] placeholder:text-slate-400 focus:outline-none focus:border-[#000923] shadow-2xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: 'All' },
          { id: 'academic', label: 'Academic' },
          { id: 'admin', label: 'Administration' },
          { id: 'sports', label: 'Sports' },
          { id: 'hostel', label: 'Hostels' },
          { id: 'amenity', label: 'Amenities' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === c.id
                ? 'bg-[#000923] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredBuildings.map((building) => (
          <div
            key={building.id}
            className="p-4 bg-white rounded-2xl border border-[#e6dec8] shadow-2xs hover:border-[#bfd2fd] hover:shadow-sm transition-all flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div
                onClick={() => onSelectBuilding(building)}
                className="cursor-pointer flex-1 min-w-0"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-[#000923] hover:text-[#c88d3b] transition-colors truncate">
                    {building.name}
                  </h3>
                  {building.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#0e2044] text-[10px] font-bold shrink-0">
                      {building.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {building.subtitle}
                </p>
              </div>

              {/* Navigate button */}
              <button
                onClick={() => onNavigateToBuilding(building)}
                className="p-2.5 rounded-xl bg-[#000923] hover:bg-[#0e2044] text-white transition-all active:scale-95 shrink-0 cursor-pointer shadow-2xs"
                title="Start Route"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Meta Info */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500 font-medium">
              <span>{building.levels}</span>
              <span className="font-bold text-[#000923]">
                {building.distanceMeters}m • {building.walkMinutes} min walk
              </span>
            </div>
          </div>
        ))}

        {filteredBuildings.length === 0 && (
          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-xs text-slate-500 font-medium">
              No campus locations found matching &quot;{search}&quot;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
