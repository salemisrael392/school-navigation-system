import React, { useState } from 'react';
import {
  Route,
  MapPin,
  ArrowUpDown,
  Navigation,
  Accessibility,
  Umbrella,
  Zap,
  Clock,
  Footprints,
  Flame,
} from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { Building } from '../types';

interface NavigateViewProps {
  onStartRoute: (building: Building) => void;
  userLocationName: string;
}

export const NavigateView: React.FC<NavigateViewProps> = ({
  onStartRoute,
  userLocationName,
}) => {
  const [origin, setOrigin] = useState<string>(userLocationName);
  const [destinationId, setDestinationId] = useState<string>('srix-block-a');
  const [avoidStairs, setAvoidStairs] = useState<boolean>(false);
  const [preferShade, setPreferShade] = useState<boolean>(true);

  const selectedDest =
    CAMPUS_BUILDINGS.find((b) => b.id === destinationId) || CAMPUS_BUILDINGS[0];

  const handleSwap = () => {
    // simple toggle swap
    const currentDestName = selectedDest.shortName;
    setOrigin(currentDestName);
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-20">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#000923] text-white flex items-center justify-center">
          <Route className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#000923]">Point-to-Point Campus Routing</h2>
          <p className="text-xs text-slate-500">Fastest pedestrian walkways and indoor level transitions</p>
        </div>
      </div>

      {/* Origin & Destination Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#e2d8c3] shadow-xs space-y-3 relative">
        {/* Origin */}
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-[#000923] ring-4 ring-blue-100 shrink-0" />
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Starting From
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full text-xs font-bold text-[#0c1c2f] bg-transparent border-b border-slate-200 pb-1 focus:outline-none focus:border-[#000923]"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-end pr-2 -my-2 relative z-10">
          <button
            onClick={handleSwap}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-2xs cursor-pointer"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-[#c88d3b] shrink-0" />
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Destination Block
            </label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full text-xs font-bold text-[#0c1c2f] bg-transparent border-b border-slate-200 pb-1 focus:outline-none focus:border-[#000923] cursor-pointer"
            >
              {CAMPUS_BUILDINGS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.shortName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Routing Preferences */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Route Preferences
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setAvoidStairs(!avoidStairs)}
            className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
              avoidStairs
                ? 'bg-[#eff4ff] border-[#bfd2fd] text-[#0e2044]'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Accessibility className="w-4 h-4 text-[#4c5e83] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Step-Free / Ramps</div>
              <div className="text-[10px] text-slate-500">Avoid staircases and uneven ground</div>
            </div>
          </button>

          <button
            onClick={() => setPreferShade(!preferShade)}
            className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
              preferShade
                ? 'bg-[#eff4ff] border-[#bfd2fd] text-[#0e2044]'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Umbrella className="w-4 h-4 text-[#c88d3b] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Covered Walkway</div>
              <div className="text-[10px] text-slate-500">Pergola shade for sun/rain protection</div>
            </div>
          </button>
        </div>
      </div>

      {/* Route Summary Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#e2d8c3] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            Optimal Pedestrian Path
          </span>
          <span className="text-xs text-slate-500 font-bold">
            {selectedDest.levels}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
          <div>
            <span className="text-[10px] text-slate-400 block">Distance</span>
            <span className="text-sm font-extrabold text-[#000923]">
              {selectedDest.distanceMeters} m
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Estimated Time</span>
            <span className="text-sm font-extrabold text-emerald-600">
              {selectedDest.walkMinutes} min
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Steps / Energy</span>
            <span className="text-sm font-extrabold text-amber-600">
              ~{Math.round(selectedDest.distanceMeters * 1.3)} steps
            </span>
          </div>
        </div>

        {/* Start Navigation Action */}
        <button
          onClick={() => onStartRoute(selectedDest)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#000923] hover:bg-[#0e2044] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <Navigation className="w-4 h-4 fill-white" />
          <span>Launch Turn-by-Turn Navigation</span>
        </button>
      </div>
    </div>
  );
};
