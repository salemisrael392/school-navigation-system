import React, { useState } from 'react';
import { X, Layers, MapPin, Navigation, Info, Check } from 'lucide-react';
import { Building, FloorPlan, FloorRoom } from '../types';

interface FloorPlanModalProps {
  building: Building;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRoom: (roomName: string) => void;
}

export const FloorPlanModal: React.FC<FloorPlanModalProps> = ({
  building,
  isOpen,
  onClose,
  onNavigateToRoom,
}) => {
  const floorPlans = building.floorPlans || [];
  const [selectedLevel, setSelectedLevel] = useState<number>(
    floorPlans.length > 2 ? 2 : 0
  );
  const [selectedRoom, setSelectedRoom] = useState<FloorRoom | null>(null);

  if (!isOpen) return null;

  const currentPlan: FloorPlan | undefined = floorPlans.find(
    (fp) => fp.levelNumber === selectedLevel
  ) || floorPlans[0];

  const getRoomColor = (type: string, isSelected: boolean) => {
    if (isSelected) return '#c88d3b';
    switch (type) {
      case 'lab':
        return '#bfd2fd';
      case 'facility':
        return '#ffe0b2';
      case 'office':
        return '#e2e8f0';
      case 'stairs':
        return '#cbd5e1';
      case 'restroom':
        return '#e0e7ff';
      default:
        return '#f1f5f9';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div
        id="modal-floor-plan"
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#000923] text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#000923]">
                {building.shortName} • Floor Plans
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentPlan ? currentPlan.description : building.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floor Switcher Tabs */}
        {floorPlans.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex gap-2 overflow-x-auto no-scrollbar">
            {floorPlans.map((fp) => (
              <button
                key={fp.levelNumber}
                onClick={() => {
                  setSelectedLevel(fp.levelNumber);
                  setSelectedRoom(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedLevel === fp.levelNumber
                    ? 'bg-[#000923] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {fp.levelName}
              </button>
            ))}
          </div>
        )}

        {/* Floor Blueprint Canvas */}
        <div className="p-4 flex-1 overflow-y-auto">
          {currentPlan ? (
            <div>
              <div className="relative w-full h-[240px] bg-[#f8f9fc] border-2 border-dashed border-slate-300 rounded-2xl p-2 overflow-hidden shadow-inner flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Building Outer Wall */}
                  <rect
                    x="5"
                    y="5"
                    width="90"
                    height="90"
                    rx="4"
                    fill="#ffffff"
                    stroke="#000923"
                    strokeWidth="1.5"
                  />

                  {/* Corridor */}
                  <path
                    d="M 5 50 L 95 50 M 50 5 L 50 95"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                  />
                  <text
                    x="50"
                    y="52"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="3"
                    fontWeight="bold"
                    letterSpacing="0.1em"
                  >
                    CENTRAL CORRIDOR
                  </text>

                  {/* Rooms Layout */}
                  {currentPlan.rooms.map((room) => {
                    const isSelected = selectedRoom?.roomNumber === room.roomNumber;
                    return (
                      <g
                        key={room.roomNumber}
                        onClick={() => setSelectedRoom(room)}
                        className="cursor-pointer group"
                      >
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.width}
                          height={room.height}
                          rx="2"
                          fill={getRoomColor(room.type, isSelected)}
                          stroke={isSelected ? '#000923' : '#64748b'}
                          strokeWidth={isSelected ? '1.2' : '0.5'}
                          className="transition-colors"
                        />
                        <text
                          x={room.x + room.width / 2}
                          y={room.y + room.height / 2 - 1}
                          textAnchor="middle"
                          fill={isSelected ? '#ffffff' : '#0f172a'}
                          fontSize="2.8"
                          fontWeight="bold"
                        >
                          {room.roomNumber}
                        </text>
                        <text
                          x={room.x + room.width / 2}
                          y={room.y + room.height / 2 + 3}
                          textAnchor="middle"
                          fill={isSelected ? '#ffffff' : '#475569'}
                          fontSize="1.8"
                          className="truncate"
                        >
                          {room.name.length > 14
                            ? `${room.name.slice(0, 12)}..`
                            : room.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Room Legend & Selected Room Details */}
              <div className="mt-3">
                {selectedRoom ? (
                  <div className="p-3 rounded-2xl bg-[#eff4ff] border border-[#bfd2fd] flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#000923] text-white text-[10px] font-bold">
                          {selectedRoom.roomNumber}
                        </span>
                        <h4 className="text-xs font-bold text-[#000923]">
                          {selectedRoom.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Type: {selectedRoom.type.toUpperCase()} • Level {selectedLevel}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigateToRoom(`${building.name} - ${selectedRoom.roomNumber}`);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#000923] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#0e2044] transition-all active:scale-95 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Route Here</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Tap any room or laboratory on the blueprint to view details and route inside.</span>
                  </div>
                )}
              </div>

              {/* Color legend */}
              <div className="flex items-center justify-around gap-2 mt-3 text-[10px] text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#bfd2fd] border border-slate-300" />
                  <span>Labs</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#ffe0b2] border border-slate-300" />
                  <span>Incubator</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#e2e8f0] border border-slate-300" />
                  <span>Offices</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#cbd5e1] border border-slate-300" />
                  <span>Stairs/Lift</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              Floor plan currently being digitized for this block.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Floor Plan
          </button>
        </div>
      </div>
    </div>
  );
};
