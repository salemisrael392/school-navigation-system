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
import { triggerHaptic } from '../utils/haptics';

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
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-5 pb-20">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#000923] text-white flex items-center justify-center shadow-xs">
          <Route className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#000923]">Point-to-Point Campus Routing</h2>
          <p className="text-xs sm:text-sm text-slate-500">Fastest pedestrian walkways and indoor level transitions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Left Column: Form and Preferences */}
        <div className="space-y-4">
          {/* Origin & Destination Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e2d8c3] shadow-xs space-y-3 relative">
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
                  className="w-full text-xs sm:text-sm font-bold text-[#0c1c2f] bg-transparent border-b border-slate-200 pb-1 focus:outline-none focus:border-[#000923]"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-end pr-2 -my-2 relative z-10">
              <button
                onClick={handleSwap}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-2xs cursor-pointer transition-transform active:rotate-180 duration-200"
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
                  className="w-full text-xs sm:text-sm font-bold text-[#0c1c2f] bg-transparent border-b border-slate-200 pb-1 focus:outline-none focus:border-[#000923] cursor-pointer"
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
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block px-1">
              Route Preferences
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setAvoidStairs(!avoidStairs)}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  avoidStairs
                    ? 'bg-[#eff4ff] border-[#bfd2fd] text-[#0e2044] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  preferShade
                    ? 'bg-[#eff4ff] border-[#bfd2fd] text-[#0e2044] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
        </div>

        {/* Right Column: Route Summary Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#e2d8c3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Optimal Pedestrian Path
            </span>
            <span className="text-xs text-slate-500 font-bold">
              {selectedDest.levels}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Distance</span>
              <span className="text-base font-extrabold text-[#000923]">
                {selectedDest.distanceMeters} m
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Est. Walk</span>
              <span className="text-base font-extrabold text-emerald-600">
                {selectedDest.walkMinutes} min
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Energy</span>
              <span className="text-base font-extrabold text-amber-600">
                ~{Math.round(selectedDest.distanceMeters * 1.3)} steps
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-[#000923]">Campus Route Highlights:</div>
            <div>• Centenary pathway via shaded courtyard</div>
            <div>• Accessible lift available at Ground Floor foyer</div>
          </div>

          {/* Start Navigation Action */}
          <button
            onClick={() => {
              triggerHaptic('start_navigation');
              onStartRoute(selectedDest);
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-[#000923] hover:bg-[#0e2044] text-white text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Launch Turn-by-Turn Navigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
