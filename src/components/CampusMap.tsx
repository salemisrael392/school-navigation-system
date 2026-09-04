import React, { useState } from 'react';
import {
  Compass,
  Crosshair,
  Layers,
  Plus,
  Minus,
  PhoneCall,
  Check,
  Navigation2,
} from 'lucide-react';
import { Building } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface CampusMapProps {
  selectedBuilding: Building;
  onSelectBuilding: (building: Building) => void;
  onOpenSOS: () => void;
  userLocationName: string;
  onCycleUserLocation: () => void;
  isNavigatingLive?: boolean;
  liveStepIndex?: number;
  totalSteps?: number;
  highlightedNextClass?: {
    buildingId: string;
    subject: string;
    room: string;
    time: string;
    courseCode?: string;
  } | null;
  onFocusNextClass?: () => void;
}

type MapLayer = 'architectural' | '3d' | 'satellite' | 'heatmap';

export const CampusMap: React.FC<CampusMapProps> = ({
  selectedBuilding,
  onSelectBuilding,
  onOpenSOS,
  userLocationName,
  onCycleUserLocation,
  isNavigatingLive = false,
  liveStepIndex = 0,
  totalSteps = 5,
  highlightedNextClass = null,
  onFocusNextClass,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('architectural');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [selectedRouteType, setSelectedRouteType] = useState<'primary' | 'alternate'>('primary');

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.2, 0.8));
  const handleResetOrientation = () => {
    setCompassHeading((h) => (h === 0 ? 45 : 0));
    triggerHaptic('tap');
  };

  const handleSOSClick = () => {
    triggerHaptic('sos_trigger');
    onOpenSOS();
  };

  const isBlockASelected = selectedBuilding.id === 'srix-block-a';
  const isAdminSelected = selectedBuilding.id === 'centenary-bhavan';
  const isLibrarySelected = selectedBuilding.id === 'central-library';
  const isBlockBSelected = selectedBuilding.id === 'block-b';
  const isSportsSelected = selectedBuilding.id === 'sports-complex';
  const isHostelSelected = selectedBuilding.id === 'hostels-mess';

  // Dynamic Google Maps style Route Coordinates based on destination
  const getDestinationPinCoords = (): { x: number; y: number } => {
    switch (selectedBuilding.id) {
      case 'centenary-bhavan':
        return { x: 250, y: 120 };
      case 'central-library':
        return { x: 382, y: 215 };
      case 'block-b':
        return { x: 112, y: 310 };
      case 'block-c':
        return { x: 195, y: 310 };
      case 'block-d':
        return { x: 260, y: 310 };
      case 'block-e':
        return { x: 325, y: 310 };
      case 'sports-complex':
        return { x: 380, y: 310 };
      case 'hostels-mess':
        return { x: 380, y: 385 };
      case 'srix-block-a':
      default:
        return { x: 115, y: 215 };
    }
  };

  const destCoords = getDestinationPinCoords();

  const getNextClassPinCoords = (bId: string): { x: number; y: number } => {
    switch (bId) {
      case 'centenary-bhavan':
        return { x: 250, y: 72 };
      case 'central-library':
        return { x: 382, y: 165 };
      case 'block-b':
        return { x: 112, y: 260 };
      case 'block-c':
        return { x: 195, y: 260 };
      case 'block-d':
        return { x: 260, y: 260 };
      case 'block-e':
        return { x: 325, y: 260 };
      case 'sports-complex':
        return { x: 380, y: 265 };
      case 'hostels-mess':
        return { x: 380, y: 350 };
      case 'srix-block-a':
      default:
        return { x: 115, y: 160 };
    }
  };

  // Primary Google Maps route polyline path
  const getPrimaryRouteD = (): string => {
    switch (selectedBuilding.id) {
      case 'centenary-bhavan':
        return 'M 185 236 L 185 150 L 250 150 L 250 135';
      case 'central-library':
        return 'M 185 236 L 250 236 L 350 236 L 382 236 L 382 225';
      case 'block-b':
        return 'M 185 236 L 150 236 L 150 310 L 125 310';
      case 'block-c':
        return 'M 185 236 L 195 236 L 195 300';
      case 'block-d':
        return 'M 185 236 L 260 236 L 260 300';
      case 'block-e':
        return 'M 185 236 L 325 236 L 325 300';
      case 'sports-complex':
        return 'M 185 236 L 250 236 L 350 236 L 350 310 L 370 310';
      case 'hostels-mess':
        return 'M 185 236 L 250 236 L 350 236 L 350 385 L 370 385';
      case 'srix-block-a':
      default:
        return 'M 185 236 L 150 236 L 150 215 L 125 215';
    }
  };

  // Alternate route (e.g. via covered shaded walkway / outer ring)
  const getAlternateRouteD = (): string => {
    switch (selectedBuilding.id) {
      case 'centenary-bhavan':
        return 'M 185 236 L 150 236 L 150 120 L 235 120';
      case 'block-c':
        return 'M 185 236 L 150 236 L 150 280 L 195 280 L 195 300';
      case 'block-d':
        return 'M 185 236 L 260 236 L 260 270 L 260 300';
      case 'block-e':
        return 'M 185 236 L 325 236 L 325 270 L 325 300';
      case 'central-library':
        return 'M 185 236 L 185 270 L 350 270 L 382 270 L 382 230';
      case 'srix-block-a':
      default:
        return 'M 185 236 L 185 195 L 130 195 L 120 205';
    }
  };

  // Live interpolated user walking beacon position along route
  const getLiveUserPosition = () => {
    if (!isNavigatingLive) {
      return { x: 185, y: 236, angle: -45 };
    }
    const t = Math.min(1, Math.max(0, liveStepIndex / Math.max(1, totalSteps - 1)));
    const startX = 185;
    const startY = 236;
    const targetX = destCoords.x;
    const targetY = destCoords.y;

    const currentX = startX + (targetX - startX) * t;
    const currentY = startY + (targetY - startY) * t;
    const angle = Math.atan2(targetY - startY, targetX - startX) * (180 / Math.PI);

    return { x: currentX, y: currentY, angle };
  };

  const liveUserPos = getLiveUserPosition();

  return (
    <div className="relative w-full h-full min-h-[350px] overflow-hidden bg-[#ebe4d5] select-none border-y sm:border-y-0 border-[#e2d8c3]">
      {/* Top Location / Live GPS Tracking Pill */}
      <div className="absolute top-3 left-3 sm:left-4 z-20">
        <button
          id="btn-user-location-pill"
          onClick={() => {
            triggerHaptic('tap');
            onCycleUserLocation();
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border transition-all active:scale-95 cursor-pointer ${
            isNavigatingLive
              ? 'bg-[#1a73e8] text-white border-blue-400 animate-pulse'
              : 'bg-white/95 backdrop-blur-xs text-[#000923] border-[#e2d8c3] hover:bg-slate-50'
          }`}
          title="Click to toggle simulated GPS waypoint"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isNavigatingLive ? 'bg-white ring-2 ring-blue-200' : 'bg-[#000923] ring-2 ring-blue-300'
            }`}
          />
          <span>{isNavigatingLive ? 'Live Route Active' : userLocationName}</span>
        </button>
      </div>

      {/* Top Next Class Floating Waypoint Banner */}
      {highlightedNextClass && (
        <div className="absolute top-12 left-3 sm:left-4 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              triggerHaptic('start_navigation');
              onFocusNextClass?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#000923]/95 text-white text-[11px] font-bold shadow-lg border border-amber-400 hover:bg-[#0e2044] transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Click to route to your next scheduled classroom"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-300">Next Class:</span>
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {highlightedNextClass.courseCode ? `${highlightedNextClass.courseCode} • ` : ''}
              {highlightedNextClass.subject}
            </span>
            <span className="text-slate-300 font-mono text-[10px]">
              ({highlightedNextClass.time})
            </span>
            <span className="text-amber-400">➔</span>
          </button>
        </div>
      )}

      {/* Floating Right Map Controls Cluster */}
      <div className="absolute top-3 right-3 sm:right-4 z-20 flex flex-col gap-2">
        {/* Compass Button */}
        <button
          id="btn-map-compass"
          onClick={handleResetOrientation}
          style={{ transform: `rotate(${compassHeading}deg)` }}
          className="w-9 h-9 rounded-full bg-white text-[#0e2044] flex items-center justify-center shadow-md border border-[#e2d8c3] hover:bg-slate-50 transition-transform active:scale-95 cursor-pointer"
          title="Reset orientation / North"
        >
          <Compass className="w-4 h-4 text-[#c88d3b]" />
        </button>

        {/* GPS Locate Button */}
        <button
          id="btn-map-gps"
          onClick={() => {
            triggerHaptic('tap');
            setZoomLevel(1);
          }}
          className="w-9 h-9 rounded-full bg-white text-[#0e2044] flex items-center justify-center shadow-md border border-[#e2d8c3] hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
          title="Center on my location"
        >
          <Crosshair className="w-4 h-4 text-[#1a73e8]" />
        </button>

        {/* Layer Toggle Button */}
        <div className="relative">
          <button
            id="btn-map-layers"
            onClick={() => {
              triggerHaptic('tap');
              setShowLayerMenu(!showLayerMenu);
            }}
            className={`w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md border border-[#e2d8c3] hover:bg-slate-50 transition-all active:scale-95 cursor-pointer ${
              showLayerMenu ? 'ring-2 ring-[#c88d3b]' : ''
            }`}
            title="Toggle Map Layers"
          >
            <Layers className="w-4 h-4 text-[#0e2044]" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-11 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Map View
              </div>
              {(
                [
                  { id: 'architectural', label: 'Architectural 2D' },
                  { id: '3d', label: '3D Building Blocks' },
                  { id: 'satellite', label: 'Satellite Hybrid' },
                  { id: 'heatmap', label: 'Crowd Heatmap' },
                ] as const
              ).map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    triggerHaptic('tap');
                    setActiveLayer(layer.id);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                    activeLayer === layer.id
                      ? 'bg-[#eff4ff] text-[#0e2044]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{layer.label}</span>
                  {activeLayer === layer.id && (
                    <Check className="w-3.5 h-3.5 text-[#c88d3b]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-white rounded-full shadow-md border border-[#e2d8c3] overflow-hidden">
          <button
            id="btn-map-zoom-in"
            onClick={() => {
              triggerHaptic('tap');
              handleZoomIn();
            }}
            className="w-9 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:bg-slate-100 border-b border-slate-200 cursor-pointer"
            title="Zoom in"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-map-zoom-out"
            onClick={() => {
              triggerHaptic('tap');
              handleZoomOut();
            }}
            className="w-9 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
            title="Zoom out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SOS Quick Banner on Map */}
      <div className="absolute bottom-2 left-3 sm:left-4 z-20">
        <button
          id="btn-map-sos-pill"
          onClick={handleSOSClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-red-600 font-bold text-xs shadow-md border border-red-200 hover:bg-red-50 transition-all active:scale-95 cursor-pointer"
        >
          <span className="text-red-600 font-black">✱</span>
          <PhoneCall className="w-3 h-3 text-red-600" />
          <span>SOS • (0870) 281-8333</span>
        </button>
      </div>

      {/* Live Route Mode Indicator Pill (Google Maps Style) */}
      <div className="absolute bottom-2 right-3 sm:right-4 z-20">
        <div className="px-2.5 py-1 rounded-full bg-[#1a73e8] text-white font-bold text-[11px] shadow-md flex items-center gap-1.5">
          <Navigation2 className="w-3 h-3 fill-white" />
          <span>{selectedBuilding.walkMinutes} min ({selectedBuilding.distanceMeters}m)</span>
        </div>
      </div>

      {/* Main Vector Campus Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300 origin-center"
        style={{
          transform: `scale(${zoomLevel}) rotate(${compassHeading}deg)`,
        }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-w-[850px] max-h-[850px] object-contain p-1 sm:p-3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Google Maps Route Glowing Filter */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#1a73e8" floodOpacity="0.5" />
            </filter>

            {/* User heading cone radial gradient */}
            <radialGradient id="heading-cone" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="#4285f4" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#4285f4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4285f4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base Campus Ground */}
          <rect
            width="500"
            height="500"
            fill={activeLayer === 'satellite' ? '#445138' : '#f5efeb'}
          />

          {/* Grid pattern if architectural */}
          {activeLayer === 'architectural' && (
            <pattern
              id="ground-grid"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke="#e8dec8"
                strokeWidth="0.75"
                opacity="0.6"
              />
            </pattern>
          )}
          {activeLayer === 'architectural' && (
            <rect width="500" height="500" fill="url(#ground-grid)" />
          )}

          {/* Satellite Lawn textures */}
          {activeLayer === 'satellite' && (
            <g opacity="0.3">
              <circle cx="150" cy="180" r="80" fill="#2d3f24" />
              <circle cx="360" cy="320" r="100" fill="#2d3f24" />
            </g>
          )}

          {/* Roadways / Pathways */}
          <path
            d="M 60 210 L 440 210 M 250 60 L 250 480 M 150 110 L 150 450 M 350 110 L 350 450"
            stroke="#ffffff"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 60 210 L 440 210 M 250 60 L 250 480 M 150 110 L 150 450 M 350 110 L 350 450"
            stroke="#d8cfbd"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
          <path
            d="M 60 210 L 440 210 M 250 60 L 250 480 M 150 110 L 150 450 M 350 110 L 350 450"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* Central Green Quadrangle Lawn */}
          <g
            onClick={() => {
              triggerHaptic('tap');
              const b = {
                id: 'green-quadrangle',
                name: 'Green Quadrangle Lawns',
                shortName: 'GREEN QUADRANGLE',
                subtitle: 'Central Campus Gardens & Amphitheatre',
                badge: 'Wi-Fi Zone',
                category: 'amenity' as const,
                liveStatus: 'Open 24/7',
                isOpen: true,
                distanceMeters: 60,
                walkMinutes: 1,
                levels: 'Open Air Ground',
                totalFloors: 1,
                description: 'Lush green open lawn with solar pergolas.',
                imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1000&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=400&q=80',
                mapX: 50,
                mapY: 38,
                facilities: [],
              };
              onSelectBuilding(b as Building);
            }}
            className="cursor-pointer transition-transform hover:opacity-95"
          >
            <rect
              x="180"
              y="180"
              width="140"
              height="85"
              rx="30"
              fill={activeLayer === 'satellite' ? '#2e4a23' : '#d2e7c9'}
              stroke="#b5d6a8"
              strokeWidth="2"
            />
            <text
              x="250"
              y="228"
              textAnchor="middle"
              fill="#3a6030"
              fontSize="10"
              fontWeight="700"
              letterSpacing="0.05em"
            >
              GREEN QUADRANGLE
            </text>
          </g>

          {/* Heatmap overlay (if active) */}
          {activeLayer === 'heatmap' && (
            <g opacity="0.5">
              <circle cx="200" cy="180" r="45" fill="#ef4444" filter="blur(10px)" />
              <circle cx="380" cy="220" r="40" fill="#f59e0b" filter="blur(10px)" />
              <circle cx="250" cy="110" r="35" fill="#10b981" filter="blur(10px)" />
            </g>
          )}

          {/* 1. Centenary Bhavan (Admin Block) */}
          <g
            id="map-block-admin"
            onClick={() => {
              triggerHaptic('tap');
              const b = {
                id: 'centenary-bhavan',
                name: 'Centenary Bhavan',
                shortName: 'ADMIN BLOCK',
                subtitle: 'Vice Chancellor & Admissions HQ',
                badge: 'Admin HQ',
                category: 'admin' as const,
                liveStatus: 'Open • 09:00 - 17:30',
                isOpen: true,
                distanceMeters: 180,
                walkMinutes: 3,
                levels: 'G + 2 Floors',
                totalFloors: 3,
                description: 'Heritage neoclassical administrative center of SR University.',
                imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1000&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=400&q=80',
                mapX: 50,
                mapY: 20,
                facilities: [
                  { id: 'cb1', name: 'Admissions & Counseling Wing', room: 'Ground Floor', level: 'Ground Floor', iconName: 'Shield' as const },
                  { id: 'cb2', name: 'Vice Chancellor Secretariat', room: 'Level 1', level: 'Level 1', iconName: 'Lightbulb' as const },
                ],
              };
              onSelectBuilding(b as Building);
            }}
            className="cursor-pointer group"
          >
            {activeLayer === '3d' && (
              <rect
                x="184"
                y="94"
                width="132"
                height="62"
                rx="14"
                fill="#b8a78e"
                opacity="0.7"
              />
            )}
            <rect
              x="180"
              y="90"
              width="132"
              height="62"
              rx="12"
              fill={isAdminSelected ? '#f5eedb' : '#ede2cb'}
              stroke={isAdminSelected ? '#c88d3b' : '#d5c7aa'}
              strokeWidth={isAdminSelected ? '3' : '1.5'}
              className="transition-all"
            />
            <rect
              x="215"
              y="82"
              width="70"
              height="16"
              rx="8"
              fill="#000923"
            />
            <text
              x="250"
              y="93"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="7.5"
              fontWeight="700"
              letterSpacing="0.04em"
            >
              CENTENARY BHAVAN
            </text>
            <text
              x="250"
              y="126"
              textAnchor="middle"
              fill="#2d2922"
              fontSize="11"
              fontWeight="600"
            >
              Admin Block
            </text>
          </g>

          {/* 2. BLOCK A • CSE & IT */}
          <g
            id="map-block-cse"
            onClick={() => {
              triggerHaptic('tap');
              const b = {
                id: 'srix-block-a',
                name: 'SRiX & School of Computer Science',
                shortName: 'BLOCK A • CSE & IT',
                subtitle: 'School of Computer Science & SR Innovation Exchange',
                badge: 'Center of Excellence',
                badgeVariant: 'lavender' as const,
                category: 'academic' as const,
                liveStatus: 'Open • In Session',
                isOpen: true,
                distanceMeters: 120,
                walkMinutes: 2,
                levels: 'G + 4 Floors',
                totalFloors: 5,
                description: 'Premier academic and research center.',
                imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80',
                mapX: 25,
                mapY: 34,
                facilities: [
                  { id: 'f1', name: 'AI & Deep Learning Lab', room: 'Room 204 • Level 2', level: 'Level 2', iconName: 'Brain' as const },
                  { id: 'f2', name: 'SRiX Incubator Hub', room: 'DST Supported • Level 1', level: 'Level 1', iconName: 'Rocket' as const },
                  { id: 'f3', name: 'Embedded IoT & Robotics', room: 'Room 312 • Level 3', level: 'Level 3', iconName: 'Cpu' as const },
                  { id: 'f4', name: 'Nest Entrepreneurship', room: 'Ground Floor • Block A', level: 'Ground Floor', iconName: 'Lightbulb' as const },
                ],
              };
              onSelectBuilding(b as Building);
            }}
            className="cursor-pointer group"
          >
            {activeLayer === '3d' && (
              <rect
                x="56"
                y="184"
                width="128"
                height="74"
                rx="14"
                fill="#b8a78e"
                opacity="0.7"
              />
            )}
            <rect
              x="52"
              y="180"
              width="128"
              height="74"
              rx="12"
              fill={isBlockASelected ? '#ffffff' : '#f5eedb'}
              stroke={isBlockASelected ? '#000923' : '#d5c7aa'}
              strokeWidth={isBlockASelected ? '3' : '1.5'}
              className="transition-all"
            />
            <rect
              x="58"
              y="172"
              width="114"
              height="18"
              rx="9"
              fill="#000923"
            />
            <text
              x="115"
              y="184"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="8"
              fontWeight="700"
              letterSpacing="0.04em"
            >
              BLOCK A • CSE &amp; IT
            </text>
            <text
              x="115"
              y="212"
              textAnchor="middle"
              fill="#0c1c2f"
              fontSize="12"
              fontWeight="700"
            >
              CSE &amp; AI School
            </text>
            <circle cx="75" cy="232" r="3.5" fill="#c88d3b" />
            <text
              x="84"
              y="235"
              fill="#68778d"
              fontSize="9"
              fontWeight="500"
            >
              AI/ML Lab...
            </text>
          </g>

          {/* 3. Central Library */}
          <g
            id="map-block-library"
            onClick={() => {
              triggerHaptic('tap');
              const b = {
                id: 'central-library',
                name: 'Central Library',
                shortName: 'CENTRAL LIBRARY',
                subtitle: 'Learning Resource Center & Digital Catalog',
                badge: 'Open Till 9 PM',
                category: 'academic' as const,
                liveStatus: 'Open Till 9:00 PM',
                isOpen: true,
                distanceMeters: 240,
                walkMinutes: 4,
                levels: 'G + 3 Floors',
                totalFloors: 4,
                description: 'Modern library with over 65,000 physical volumes and digital research suites.',
                imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
                mapX: 75,
                mapY: 34,
                facilities: [
                  { id: 'cl1', name: 'Digital Reference Lounge', room: 'Level 1', level: 'Level 1', iconName: 'Cpu' as const },
                  { id: 'cl2', name: '24/7 Reading Hall', room: 'Ground Floor', level: 'Ground Floor', iconName: 'BookOpen' as const },
                ],
              };
              onSelectBuilding(b as Building);
            }}
            className="cursor-pointer group"
          >
            {activeLayer === '3d' && (
              <rect
                x="324"
                y="184"
                width="124"
                height="70"
                rx="14"
                fill="#b8a78e"
                opacity="0.7"
              />
            )}
            <rect
              x="320"
              y="180"
              width="124"
              height="70"
              rx="12"
              fill={isLibrarySelected ? '#ffffff' : '#ede2cb'}
              stroke={isLibrarySelected ? '#c88d3b' : '#d5c7aa'}
              strokeWidth={isLibrarySelected ? '3' : '1.5'}
            />
            <text
              x="382"
              y="208"
              textAnchor="middle"
              fill="#000923"
              fontSize="10"
              fontWeight="800"
              letterSpacing="0.03em"
            >
              CENTRAL LIBRAR...
            </text>
            <text
              x="382"
              y="226"
              textAnchor="middle"
              fill="#68778d"
              fontSize="9"
              fontWeight="500"
            >
              Learning Resource Ctr
            </text>
          </g>

          {/* 4. BLOCK B */}
          <g
            id="map-block-b"
            onClick={() => {
              triggerHaptic('tap');
              const b = {
                id: 'block-b',
                name: 'Block B - Mechanical & Civil Engg',
                shortName: 'BLOCK B',
                subtitle: 'School of Mechanical & Civil Engineering',
                badge: 'Heavy Machinery',
                category: 'academic' as const,
                liveStatus: 'Open • Labs Running',
                isOpen: true,
                distanceMeters: 220,
                walkMinutes: 3,
                levels: 'G + 3 Floors',
                totalFloors: 4,
                description: 'Engineering labs with heavy CNC workshops and materials testing suites.',
                imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
                mapX: 25,
                mapY: 48,
                facilities: [],
              };
              onSelectBuilding(b as Building);
            }}
            className="cursor-pointer"
          >
            {activeLayer === '3d' && (
              <rect
                x="56"
                y="284"
                width="120"
                height="65"
                rx="14"
                fill="#b8a78e"
                opacity="0.7"
              />
            )}
            <rect
              x="52"
              y="280"
              width="120"
              height="65"
              rx="12"
              fill={isBlockBSelected ? '#ffffff' : '#ede2cb'}
              stroke={isBlockBSelected ? '#000923' : '#d5c7aa'}
              strokeWidth={isBlockBSelected ? '3' : '1.5'}
            />
            <text
              x="112"
              y="306"
              textAnchor="middle"
              fill="#000923"
              fontSize="11"
              fontWeight="800"
            >
              BLOCK B
            </text>
            <text
              x="112"
              y="323"
              textAnchor="middle"
              fill="#68778d"
              fontSize="9"
              fontWeight="500"
            >
              Mech &amp; Civil Engg
            </text>
          </g>

          {/* 5. SPORTS COMPLEX */}
          <g
            id="map-block-sports"
            onClick={() => {
              triggerHaptic('tap');
              const b = {
                id: 'sports-complex',
                name: 'SRU Sports Complex',
                shortName: 'SPORTS COMPLEX',
                subtitle: 'Badminton Courts, Gymnasium & Indoor Arena',
                badge: 'Open Turf',
                category: 'sports' as const,
                liveStatus: 'Open Till 8:30 PM',
                isOpen: true,
                distanceMeters: 310,
                walkMinutes: 5,
                levels: 'Arena + Grounds',
                totalFloors: 2,
                description: 'Badminton courts, gym, squash, and basketball.',
                imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
                mapX: 75,
                mapY: 48,
                facilities: [],
              };
              onSelectBuilding(b as Building);
            }}
            className="cursor-pointer"
          >
            {activeLayer === '3d' && (
              <rect
                x="324"
                y="284"
                width="120"
                height="65"
                rx="14"
                fill="#b8a78e"
                opacity="0.7"
              />
            )}
            <rect
              x="320"
              y="280"
              width="120"
              height="65"
              rx="12"
              fill={isSportsSelected ? '#ffffff' : '#ede2cb'}
              stroke={isSportsSelected ? '#c88d3b' : '#d5c7aa'}
              strokeWidth={isSportsSelected ? '3' : '1.5'}
            />
            <text
              x="380"
              y="306"
              textAnchor="middle"
              fill="#000923"
              fontSize="10"
              fontWeight="800"
            >
              SPORTS COMPLEX
            </text>
            <text
              x="380"
              y="323"
              textAnchor="middle"
              fill="#68778d"
              fontSize="9"
              fontWeight="500"
            >
              Badminton &amp; Gym
            </text>
          </g>

          {/* 6. Hostels */}
          <g
            id="map-block-hostels"
            onClick={() => {
              triggerHaptic('tap');
              const b = {
                id: 'hostels-mess',
                name: 'Student Hostels & Dining Hall',
                shortName: 'HOSTELS & MESS',
                subtitle: 'Boys & Girls Resident Blocks & Central Dining',
                badge: 'Resident Zone',
                category: 'hostel' as const,
                liveStatus: 'Dinner 19:30 - 21:30',
                isOpen: true,
                distanceMeters: 450,
                walkMinutes: 6,
                levels: 'G + 5 Floors',
                totalFloors: 6,
                description: 'Hostels with cafeteria and dining mess.',
                imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80',
                mapX: 72,
                mapY: 62,
                facilities: [],
              };
              onSelectBuilding(b as Building);
            }}
            className="cursor-pointer"
          >
            <rect
              x="305"
              y="365"
              width="150"
              height="45"
              rx="10"
              fill={isHostelSelected ? '#ffffff' : '#ede2cb'}
              stroke={isHostelSelected ? '#000923' : '#d5c7aa'}
              strokeWidth={isHostelSelected ? '2.5' : '1.5'}
            />
            <text
              x="380"
              y="392"
              textAnchor="middle"
              fill="#3a3731"
              fontSize="10"
              fontWeight="600"
            >
              Boys &amp; Girls Hostels / Mess
            </text>
          </g>

          {/* Main Gate */}
          <g id="map-block-gate">
            <rect
              x="220"
              y="450"
              width="60"
              height="20"
              rx="4"
              fill="#000923"
            />
            <text
              x="250"
              y="464"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="8"
              fontWeight="700"
              letterSpacing="0.05em"
            >
              MAIN GATE
            </text>
          </g>

          {/* ======================================================== */}
          {/* GOOGLE MAPS LIVE ROUTE VISUALIZATION                     */}
          {/* ======================================================== */}

          {/* 1. Alternate Route (Gray dashed route with ETA badge) */}
          <g
            className="cursor-pointer opacity-75 hover:opacity-100 transition-opacity"
            onClick={() => {
              triggerHaptic('tap');
              setSelectedRouteType('alternate');
            }}
          >
            <path
              d={getAlternateRouteD()}
              stroke="#94a3b8"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 6"
            />
            <path
              d={getAlternateRouteD()}
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* 2. Primary Google Maps Vibrant Blue Polyline with Animated Chevrons */}
          <g
            filter="url(#route-glow)"
            className="cursor-pointer"
            onClick={() => {
              triggerHaptic('tap');
              setSelectedRouteType('primary');
            }}
          >
            {/* Outer border stroke */}
            <path
              d={getPrimaryRouteD()}
              stroke="#1557b0"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Signature Google Maps Blue route */}
            <path
              d={getPrimaryRouteD()}
              stroke="#1a73e8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Flowing animated dashes along route */}
            <path
              d={getPrimaryRouteD()}
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 10"
              opacity="0.85"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-30"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* 3. Google Maps ETA Pills on Route Nodes */}
          <g id="route-eta-pills">
            {/* Primary ETA Badge on middle segment */}
            <g transform="translate(160, 222)">
              <rect
                x="0"
                y="0"
                width="38"
                height="15"
                rx="7.5"
                fill="#000923"
                stroke="#ffffff"
                strokeWidth="1.2"
                className="shadow-sm"
              />
              <text
                x="19"
                y="10.5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="7.5"
                fontWeight="800"
              >
                {selectedBuilding.walkMinutes} min
              </text>
            </g>
          </g>

          {/* 4. Destination Pin: Iconic Google Maps 3D Red Teardrop Landmark */}
          <g id="google-maps-dest-pin" transform={`translate(${destCoords.x - 12}, ${destCoords.y - 28})`}>
            {/* Ground shadow */}
            <ellipse cx="12" cy="28" rx="7" ry="2.5" fill="#000000" opacity="0.3" />
            {/* Pin body */}
            <path
              d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 18 8 18s8-12.75 8-18c0-4.42-3.58-8-8-8z"
              fill="#ea4335"
              stroke="#c5221f"
              strokeWidth="1.2"
            />
            {/* Pin inner white circle */}
            <circle cx="12" cy="10" r="3.5" fill="#ffffff" />
            <circle cx="12" cy="10" r="1.5" fill="#ea4335" />
          </g>

          {/* 4b. Highlighted Next Class Timetable Marker (if present) */}
          {highlightedNextClass && (() => {
            const nextCoords = getNextClassPinCoords(highlightedNextClass.buildingId);
            return (
              <g
                id="next-class-map-marker"
                transform={`translate(${nextCoords.x}, ${nextCoords.y})`}
                className="cursor-pointer"
                onClick={() => {
                  triggerHaptic('start_navigation');
                  onFocusNextClass?.();
                }}
              >
                {/* Radar target waves */}
                <circle cx="0" cy="0" r="30" fill="#f59e0b" opacity="0.2">
                  <animate
                    attributeName="r"
                    values="14;34;14"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.35;0.05;0.35"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Floating Badge Box */}
                <g transform="translate(0, -28)">
                  <rect
                    x="-68"
                    y="-18"
                    width="136"
                    height="22"
                    rx="11"
                    fill="#000923"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    filter="url(#route-glow)"
                  />
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="7.5"
                    fontWeight="800"
                    letterSpacing="0.03em"
                  >
                    🎓 NEXT: {highlightedNextClass.courseCode || 'CLASS'} • {highlightedNextClass.time}
                  </text>
                  {/* Down pointer arrow */}
                  <polygon points="-4,-18 4,-18 0,-13" fill="#f59e0b" transform="translate(0, 18)" />
                </g>

                {/* Golden target center dot */}
                <circle cx="0" cy="0" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              </g>
            );
          })()}

          {/* 5. Live User Navigation Beacon (Google Maps Blue Dot + Flashlight Heading Cone) */}
          <g id="user-location-node" transform={`translate(${liveUserPos.x}, ${liveUserPos.y})`}>
            {/* Field-of-View Heading Cone */}
            <g transform={`rotate(${liveUserPos.angle})`}>
              <path
                d="M 0 0 L 45 -22 A 45 45 0 0 1 45 22 Z"
                fill="url(#heading-cone)"
              />
            </g>

            {/* Radar Pulsing Rings */}
            <circle cx="0" cy="0" r="14" fill="#1a73e8" opacity="0.15">
              <animate
                attributeName="r"
                values="8;20;8"
                dur="1.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.35;0;0.35"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Solid White Outer Rim */}
            <circle cx="0" cy="0" r="7.5" fill="#ffffff" stroke="#174ea6" strokeWidth="1" />

            {/* Google Maps Blue Core Dot */}
            <circle cx="0" cy="0" r="5" fill="#1a73e8" />

            {/* Center Heading White Arrow */}
            <g transform={`rotate(${liveUserPos.angle})`}>
              <path d="M 3 0 L -2 -3 L -0.5 0 L -2 3 Z" fill="#ffffff" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
