import React, { useState } from 'react';
import {
  Brain,
  Rocket,
  Cpu,
  Lightbulb,
  BookOpen,
  Coffee,
  Activity,
  Shield,
  Navigation,
  Bookmark,
  BookmarkCheck,
  Camera,
  Layers,
  Clock,
  Footprints,
} from 'lucide-react';
import { Building, Facility } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface LocationBottomSheetProps {
  building: Building;
  onStartNavigation: () => void;
  onViewFloorPlan: () => void;
  onOpenPhotoGallery: () => void;
}

export const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  building,
  onStartNavigation,
  onViewFloorPlan,
  onOpenPhotoGallery,
}) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="w-4 h-4 text-[#0e2044]" />;
      case 'Rocket':
        return <Rocket className="w-4 h-4 text-[#0e2044]" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-[#0e2044]" />;
      case 'Lightbulb':
        return <Lightbulb className="w-4 h-4 text-[#0e2044]" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-[#0e2044]" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-[#0e2044]" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-[#0e2044]" />;
      default:
        return <Shield className="w-4 h-4 text-[#0e2044]" />;
    }
  };

  return (
    <div
      id="bottom-sheet-location-card"
      className="bg-white rounded-3xl border border-[#e2d8c3] shadow-xs relative z-20 px-4 sm:px-5 pt-4 pb-4 transition-all"
    >
      {/* Pull Handle Bar (visible only on mobile viewports) */}
      <div className="flex md:hidden justify-center mb-2.5">
        <div className="w-10 h-1 rounded-full bg-slate-200" />
      </div>

      {/* Building Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-base sm:text-lg font-bold text-[#000923] tracking-tight leading-tight">
              {building.name}
            </h2>
            {building.badge && (
              <span className="px-2 py-0.5 rounded-md bg-[#bfd2fd] text-[#0e2044] text-[11px] font-bold tracking-tight">
                {building.badge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {building.subtitle}
          </p>
        </div>

        {/* Building Thumbnail with Camera Overlay */}
        <button
          id="btn-building-photo"
          onClick={onOpenPhotoGallery}
          className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-2xs group cursor-pointer"
          title="View photos and 360 preview"
        >
          <img
            src={building.thumbnailUrl}
            alt={building.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-1 right-1 p-0.5 rounded-sm bg-black/60 text-white">
            <Camera className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-[#f8f9ff] border border-[#e6eeff] mb-3">
        {/* Live Status */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium">
            Live Status
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-bold text-[#0c1c2f] truncate">
              {building.liveStatus}
            </span>
          </div>
        </div>

        {/* Distance */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium">Distance</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Footprints className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-xs font-bold text-[#0c1c2f] truncate">
              {building.distanceMeters}m ({building.walkMinutes} min)
            </span>
          </div>
        </div>

        {/* Levels */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium">Levels</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Layers className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-xs font-bold text-[#0c1c2f] truncate">
              {building.levels}
            </span>
          </div>
        </div>
      </div>

      {/* Key Facilities Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
            Key Facilities Inside
          </span>
          <button
            id="btn-view-floor-plan"
            onClick={onViewFloorPlan}
            className="text-xs font-bold text-[#c88d3b] hover:text-[#9e6922] transition-colors cursor-pointer"
          >
            View Floor Plan
          </button>
        </div>

        {/* 2x2 Facilities Grid */}
        <div className="grid grid-cols-2 gap-2">
          {building.facilities.slice(0, 4).map((facility) => (
            <div
              key={facility.id}
              onClick={() => setSelectedFacility(facility)}
              className="p-2 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center gap-2 hover:bg-[#e6eeff] transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center shrink-0">
                {getFacilityIcon(facility.iconName)}
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] font-bold text-[#000923] truncate">
                  {facility.name}
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  {facility.room}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action Row */}
      <div className="flex items-center gap-2 pt-1">
        {/* Start Navigation Button */}
        <button
          id="btn-start-navigation"
          onClick={() => {
            triggerHaptic('start_navigation');
            onStartNavigation();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#000923] hover:bg-[#0e2044] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <Navigation className="w-4 h-4 fill-white" />
          <span>Start Navigation</span>
        </button>

        {/* Bookmark Button */}
        <button
          id="btn-bookmark-location"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-3 rounded-xl border transition-all active:scale-95 cursor-pointer ${
            isBookmarked
              ? 'bg-[#eff4ff] border-[#bfd2fd] text-[#0e2044]'
              : 'bg-white border-[#e2d8c3] text-slate-600 hover:bg-slate-50'
          }`}
          title={isBookmarked ? 'Saved to bookmarks' : 'Save location'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 text-[#c88d3b]" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Selected Facility Detail Popover */}
      {selectedFacility && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-slate-800">
              {selectedFacility.name}:{' '}
            </span>
            <span className="text-slate-600">{selectedFacility.description}</span>
          </div>
          <button
            onClick={() => setSelectedFacility(null)}
            className="text-slate-400 hover:text-slate-700 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
