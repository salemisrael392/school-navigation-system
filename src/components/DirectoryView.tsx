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
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#000923] text-white flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#000923]">Campus Directory</h2>
            <p className="text-xs text-slate-500">All blocks, academic schools &amp; student offices</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
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
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#e2d8c3] text-xs text-[#0c1c2f] placeholder:text-slate-400 focus:outline-none focus:border-[#000923]"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
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
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === c.id
                ? 'bg-[#000923] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Directory List */}
      <div className="space-y-2.5">
        {filteredBuildings.map((building) => (
          <div
            key={building.id}
            className="p-3.5 bg-white rounded-2xl border border-[#e6dec8] shadow-2xs hover:border-[#bfd2fd] transition-all flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div
                onClick={() => onSelectBuilding(building)}
                className="cursor-pointer flex-1"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs font-bold text-[#000923] hover:text-[#c88d3b] transition-colors">
                    {building.name}
                  </h3>
                  {building.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#0e2044] text-[10px] font-bold">
                      {building.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {building.subtitle}
                </p>
              </div>

              {/* Navigate button */}
              <button
                onClick={() => onNavigateToBuilding(building)}
                className="p-2 rounded-xl bg-[#000923] hover:bg-[#0e2044] text-white transition-all active:scale-95 shrink-0 cursor-pointer shadow-2xs"
                title="Start Route"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Meta Info */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10.5px] text-slate-500 font-medium">
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
