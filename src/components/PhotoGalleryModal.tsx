import React from 'react';
import { X, MapPin, Layers, Phone, User } from 'lucide-react';
import { Building } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface PhotoGalleryModalProps {
  building: Building;
  isOpen: boolean;
  onClose: () => void;
  onStartNavigation: () => void;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  building,
  isOpen,
  onClose,
  onStartNavigation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div
        id="modal-photo-gallery"
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Photo Container */}
        <div className="relative h-60 w-full bg-slate-900">
          <img
            src={building.imageUrl}
            alt={building.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="px-2 py-0.5 rounded-md bg-[#c88d3b] text-[#000923] text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
              {building.badge || 'Campus Landmark'}
            </span>
            <h3 className="text-lg font-bold leading-tight drop-shadow-sm">
              {building.name}
            </h3>
            <p className="text-xs text-slate-200">{building.subtitle}</p>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
          <p className="text-xs text-slate-700 leading-relaxed">
            {building.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-[10px] text-slate-400 block">Floors</span>
                <span className="font-bold text-[#0c1c2f]">{building.levels}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-[10px] text-slate-400 block">Transit Time</span>
                <span className="font-bold text-[#0c1c2f]">{building.walkMinutes} min walk</span>
              </div>
            </div>
          </div>

          {building.contactPerson && (
            <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0e2044]" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Key Contact</span>
                  <span className="font-bold text-[#000923]">{building.contactPerson}</span>
                </div>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#0e2044]">
                {building.phoneExtension}
              </span>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('start_navigation');
              onClose();
              onStartNavigation();
            }}
            className="flex-1 py-2.5 bg-[#000923] hover:bg-[#0e2044] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Start Route to This Block
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
