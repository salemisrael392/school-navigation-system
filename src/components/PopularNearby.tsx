import React from 'react';
import { ArrowRight, Footprints } from 'lucide-react';
import { NearbyCard, Building } from '../types';
import { POPULAR_NEARBY, CAMPUS_BUILDINGS } from '../data/campusData';

interface PopularNearbyProps {
  onSelectBuildingById: (buildingId: string) => void;
  onViewAllDirectory: () => void;
}

export const PopularNearby: React.FC<PopularNearbyProps> = ({
  onSelectBuildingById,
  onViewAllDirectory,
}) => {
  return (
    <section className="px-3 sm:px-4 py-3 bg-white border-t border-slate-100">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#000923]">Popular Nearby</h3>
        <button
          id="btn-view-all-nearby"
          onClick={onViewAllDirectory}
          className="text-xs font-semibold text-slate-500 hover:text-[#000923] transition-colors cursor-pointer"
        >
          View all (18)
        </button>
      </div>

      {/* Horizontal Cards Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {POPULAR_NEARBY.map((card) => (
          <div
            key={card.id}
            id={`nearby-card-${card.id}`}
            onClick={() => onSelectBuildingById(card.buildingId)}
            className="w-[200px] sm:w-[220px] rounded-2xl border border-[#e6dec8] overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all active:scale-98 shrink-0 cursor-pointer group flex flex-col"
          >
            {/* Card Image with Badge */}
            <div className="relative h-28 w-full overflow-hidden bg-slate-100">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight shadow-xs ${
                    card.badgeVariant === 'blue'
                      ? 'bg-[#0070f3] text-white'
                      : card.badgeVariant === 'amber'
                      ? 'bg-[#172b4d] text-white'
                      : 'bg-[#10b981] text-white'
                  }`}
                >
                  {card.badge}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#000923] group-hover:text-[#c88d3b] transition-colors truncate">
                  {card.name}
                </h4>
                <p className="text-[10.5px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {card.subtitle}
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100 text-[11px] text-slate-600 font-semibold">
                <span className="truncate">
                  {card.distance} • {card.walkTime}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#000923] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
