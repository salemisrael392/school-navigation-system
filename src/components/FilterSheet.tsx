import React from 'react';
import { X, Check } from 'lucide-react';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onlyOpenNow: boolean;
  onToggleOpenNow: () => void;
  wheelchairAccessible: boolean;
  onToggleWheelchair: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  onlyOpenNow,
  onToggleOpenNow,
  wheelchairAccessible,
  onToggleWheelchair,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="sheet-filter-settings"
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in slide-in-from-bottom-5 duration-200"
      >
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#000923]">Filter Campus Locations</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick Toggles */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status &amp; Accessibility
            </span>
            <div className="mt-2 space-y-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0c1c2f]">Open Right Now</div>
                  <div className="text-[11px] text-slate-500">Only show buildings currently in session or operating</div>
                </div>
                <input
                  type="checkbox"
                  checked={onlyOpenNow}
                  onChange={onToggleOpenNow}
                  className="w-4 h-4 rounded text-[#000923] accent-[#000923]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0c1c2f]">Wheelchair &amp; Step-Free</div>
                  <div className="text-[11px] text-slate-500">Elevator access and ramped entrance available</div>
                </div>
                <input
                  type="checkbox"
                  checked={wheelchairAccessible}
                  onChange={onToggleWheelchair}
                  className="w-4 h-4 rounded text-[#000923] accent-[#000923]"
                />
              </label>
            </div>
          </div>

          {/* Categories */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Building Type
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { id: 'all', label: 'All Buildings' },
                { id: 'academic', label: 'Academic & Schools' },
                { id: 'admin', label: 'Administration' },
                { id: 'lab', label: 'Labs & Incubators' },
                { id: 'sports', label: 'Sports Complex' },
                { id: 'hostel', label: 'Hostels & Mess' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#000923] text-white border-[#000923]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-[#c88d3b]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#000923] hover:bg-[#0e2044] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
