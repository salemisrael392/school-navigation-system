import React, { useState, useEffect } from 'react';
import {
  X,
  Navigation2,
  ArrowUp,
  CornerUpRight,
  CornerUpLeft,
  ChevronsUp,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Crosshair,
  Search,
  MapPin,
  Footprints,
} from 'lucide-react';
import { Building, NavigationStep } from '../types';
import { DEFAULT_NAVIGATION_STEPS } from '../data/campusData';
import { triggerHaptic } from '../utils/haptics';

interface NavigationModalProps {
  destination: Building;
  roomDestination?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({
  destination,
  roomDestination,
  isOpen,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);
  const [walkingSpeed, setWalkingSpeed] = useState<string>('4.2 km/h');
  const [showStepsList, setShowStepsList] = useState<boolean>(false);

  const steps = DEFAULT_NAVIGATION_STEPS;
  const currentStep = steps[currentStepIndex] || steps[0];
  const nextStep = steps[currentStepIndex + 1];
  const isArrived = currentStepIndex >= steps.length - 1;

  // Speak instruction using Web Speech synthesis if enabled
  const speakInstruction = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // On open
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      triggerHaptic('start_navigation');
      speakInstruction(`Starting route to ${roomDestination || destination.name}. ${steps[0].instruction}`);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAutoSimulating(false);
    }
  }, [isOpen]);

  // Simulation timer
  useEffect(() => {
    let timer: any;
    if (isAutoSimulating && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        triggerHaptic(nextIdx === steps.length - 1 ? 'arrival' : 'turn_maneuver');
        speakInstruction(steps[nextIdx].instruction);
      }, 3500);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsAutoSimulating(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoSimulating, currentStepIndex]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      triggerHaptic(nextIdx === steps.length - 1 ? 'arrival' : 'turn_maneuver');
      speakInstruction(steps[nextIdx].instruction);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      triggerHaptic('tap');
      speakInstruction(steps[prevIdx].instruction);
    }
  };

  const handleExit = () => {
    triggerHaptic('tap');
    onClose();
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'turn-right':
        return <CornerUpRight className="w-8 h-8 text-white stroke-[2.5]" />;
      case 'turn-left':
        return <CornerUpLeft className="w-8 h-8 text-white stroke-[2.5]" />;
      case 'elevator':
        return <ChevronsUp className="w-8 h-8 text-white stroke-[2.5]" />;
      case 'arrive':
        return <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />;
      default:
        return <ArrowUp className="w-8 h-8 text-white stroke-[2.5]" />;
    }
  };

  // Google Maps route progress calculations
  const progressRatio = currentStepIndex / (steps.length - 1);
  const remainingMeters = Math.max(0, Math.round(destination.distanceMeters * (1 - progressRatio)));
  const remainingMinutes = Math.max(1, Math.ceil(destination.walkMinutes * (1 - progressRatio)));

  // SVG interpolation coordinates for the live mini-map
  // Start: (185, 236), End: (115, 215)
  const startX = 185;
  const startY = 236;
  const endX = 115;
  const endY = 215;
  const beaconX = startX + (endX - startX) * progressRatio;
  const beaconY = startY + (endY - startY) * progressRatio;
  const beaconAngle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  return (
    <div
      id="modal-google-maps-live-nav"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/90 backdrop-blur-xs select-none"
    >
      {/* 1. TOP GOOGLE MAPS GREEN HIGHWAY MANEUVER CARD */}
      <div className="p-3 sm:p-4 z-20">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-[#137333] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-emerald-400/40 relative overflow-hidden">
          {/* Subtle diagonal background sheen */}
          <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

          {/* Maneuver row */}
          <div className="flex items-start gap-3.5 relative z-10">
            {/* Big Google Maps Turn Arrow Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#0b5324] border border-emerald-300/40 flex items-center justify-center shrink-0 shadow-md">
              {getStepIcon(currentStep.iconType)}
            </div>

            <div className="flex-1 min-w-0">
              {/* Distance to next maneuver */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wide text-emerald-100">
                  In {currentStep.distance}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-emerald-800 text-emerald-200">
                  {walkingSpeed}
                </span>
              </div>

              {/* Main Instruction */}
              <h2 className="text-base sm:text-lg font-black leading-tight text-white mt-0.5 drop-shadow-xs">
                {currentStep.instruction}
              </h2>

              {/* Landmark hint */}
              {currentStep.landmarkNote && (
                <p className="text-[11px] text-emerald-100/90 mt-1 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>{currentStep.landmarkNote}</span>
                </p>
              )}
            </div>
          </div>

          {/* Next upcoming maneuver bar (just like Google Maps) */}
          {nextStep && !isArrived && (
            <div className="mt-3 pt-2.5 border-t border-emerald-700/60 flex items-center justify-between text-[11px] text-emerald-100 relative z-10">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-emerald-300 font-bold">Then:</span>
                <span className="truncate">{nextStep.instruction}</span>
              </div>
              <span className="text-emerald-300 font-mono font-bold shrink-0 ml-2">
                {nextStep.distance}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER LIVE GOOGLE MAPS VECTOR VIEWPORT */}
      <div className="flex-1 relative w-full max-w-md mx-auto my-2 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#ebe4d5] flex items-center justify-center">
        {/* Live Vector Map Canvas with dynamic Google Maps polyline */}
        <svg
          viewBox="0 0 400 350"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="nav-beam-cone" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="#4285f4" stopOpacity="0.55" />
              <stop offset="75%" stopColor="#4285f4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4285f4" stopOpacity="0" />
            </radialGradient>
            <filter id="live-route-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1a73e8" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Map Base ground */}
          <rect width="400" height="350" fill="#f5efeb" />

          {/* Campus walkways */}
          <path
            d="M 50 180 L 350 180 M 200 40 L 200 320 M 120 80 L 120 300 M 280 80 L 280 300"
            stroke="#ffffff"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 50 180 L 350 180 M 200 40 L 200 320 M 120 80 L 120 300 M 280 80 L 280 300"
            stroke="#d8cfbd"
            strokeWidth="36"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />

          {/* Green Quadrangle Lawn */}
          <rect
            x="150"
            y="140"
            width="100"
            height="70"
            rx="20"
            fill="#d2e7c9"
            stroke="#b5d6a8"
            strokeWidth="2"
          />
          <text
            x="200"
            y="178"
            textAnchor="middle"
            fill="#3a6030"
            fontSize="8"
            fontWeight="700"
          >
            QUADRANGLE
          </text>

          {/* Block A building (Target) */}
          <rect
            x="50"
            y="140"
            width="90"
            height="65"
            rx="10"
            fill="#ffffff"
            stroke="#000923"
            strokeWidth="2.5"
          />
          <rect x="55" y="134" width="80" height="14" rx="7" fill="#000923" />
          <text
            x="95"
            y="144"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="7"
            fontWeight="700"
          >
            BLOCK A • CSE
          </text>
          <text
            x="95"
            y="175"
            textAnchor="middle"
            fill="#0c1c2f"
            fontSize="10"
            fontWeight="800"
          >
            Target Block
          </text>

          {/* Centenary Bhavan (North) */}
          <rect
            x="150"
            y="60"
            width="100"
            height="45"
            rx="8"
            fill="#ede2cb"
            stroke="#d5c7aa"
            strokeWidth="1.5"
          />
          <text
            x="200"
            y="85"
            textAnchor="middle"
            fill="#2d2922"
            fontSize="8"
            fontWeight="700"
          >
            ADMIN BLOCK
          </text>

          {/* Central Library (East) */}
          <rect
            x="260"
            y="140"
            width="90"
            height="60"
            rx="8"
            fill="#ede2cb"
            stroke="#d5c7aa"
            strokeWidth="1.5"
          />
          <text
            x="305"
            y="175"
            textAnchor="middle"
            fill="#2d2922"
            fontSize="8"
            fontWeight="700"
          >
            LIBRARY
          </text>

          {/* ============================================== */}
          {/* THE LIVE GOOGLE MAPS NAVIGATION BLUE POLYLINE */}
          {/* ============================================== */}
          <g filter="url(#live-route-shadow)">
            {/* Dark outer casing */}
            <path
              d="M 185 236 L 150 236 L 150 215 L 115 215"
              stroke="#1557b0"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Signature Google Maps Blue */}
            <path
              d="M 185 236 L 150 236 L 150 215 L 115 215"
              stroke="#1a73e8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Flowing animated white chevron chevrons along path */}
            <path
              d="M 185 236 L 150 236 L 150 215 L 115 215"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 8"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-24"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Destination Landmark 3D Red Pin */}
          <g transform="translate(103, 190)">
            <ellipse cx="12" cy="24" rx="6" ry="2" fill="#000000" opacity="0.3" />
            <path
              d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8z"
              fill="#ea4335"
              stroke="#c5221f"
              strokeWidth="1"
            />
            <circle cx="12" cy="9" r="3" fill="#ffffff" />
            <circle cx="12" cy="9" r="1.5" fill="#ea4335" />
          </g>

          {/* LIVE MOVING USER BEACON (Google Maps Pulsing Blue Dot with Heading Beam) */}
          <g transform={`translate(${beaconX}, ${beaconY})`}>
            {/* Translucent Heading flashlight beam */}
            <g transform={`rotate(${beaconAngle})`}>
              <path
                d="M 0 0 L 50 -25 A 50 50 0 0 1 50 25 Z"
                fill="url(#nav-beam-cone)"
              />
            </g>

            {/* Radar Pulsing Rings */}
            <circle cx="0" cy="0" r="16" fill="#1a73e8" opacity="0.2">
              <animate
                attributeName="r"
                values="10;22;10"
                dur="1.6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0;0.3"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </circle>

            {/* White outer bezel */}
            <circle cx="0" cy="0" r="9" fill="#ffffff" stroke="#174ea6" strokeWidth="1.5" />
            {/* Google Blue Core */}
            <circle cx="0" cy="0" r="6" fill="#1a73e8" />
            {/* Inner heading white chevron arrow */}
            <g transform={`rotate(${beaconAngle})`}>
              <path d="M 3.5 0 L -2 -3 L -0.5 0 L -2 3 Z" fill="#ffffff" />
            </g>
          </g>
        </svg>

        {/* Floating Controls on Mini-Map */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <button
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center border transition-all cursor-pointer ${
              isVoiceEnabled
                ? 'bg-white text-emerald-700 border-emerald-200'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title={isVoiceEnabled ? 'Voice Guidance Active' : 'Muted'}
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              triggerHaptic('tap');
            }}
            className="w-9 h-9 rounded-full bg-white text-[#1a73e8] shadow-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50 cursor-pointer"
            title="Re-center on user"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Auto-Simulation Toggle Button */}
        <div className="absolute bottom-3 left-3 z-20">
          <button
            onClick={() => {
              triggerHaptic('tap');
              setIsAutoSimulating(!isAutoSimulating);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
              isAutoSimulating
                ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                : 'bg-slate-900/90 text-white hover:bg-slate-800'
            }`}
          >
            {isAutoSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-slate-950" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Auto-Simulate</span>
              </>
            )}
          </button>
        </div>

        {/* Next step manual advance button */}
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={handleNextStep}
            disabled={isArrived}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-slate-800 font-bold text-xs shadow-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <span>Next</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* 3. BOTTOM GOOGLE MAPS ETA CARD WITH BIG RED EXIT BUTTON */}
      <div className="p-3 sm:p-4 z-20">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200 flex flex-col gap-3">
          {/* Main Google Maps Stats Line */}
          <div className="flex items-center justify-between">
            {/* Time & Distance */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#137333]">
                {isArrived ? 'Arrived' : `${remainingMinutes} min`}
              </span>
              <span className="text-sm font-bold text-slate-500">
                ({isArrived ? '0 m' : `${remainingMeters} m`})
              </span>
              <span className="text-xs font-medium text-slate-400">
                • 10:45 AM
              </span>
            </div>

            {/* Red Exit Button (Signature Google Maps Round Exit Pill) */}
            <button
              id="btn-google-maps-exit"
              onClick={handleExit}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
              <span>EXIT</span>
            </button>
          </div>

          {/* Quick Route Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1a73e8] transition-all duration-300"
              style={{ width: `${Math.round(progressRatio * 100)}%` }}
            />
          </div>

          {/* Destination note & Steps list toggle */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="font-bold text-[#000923] truncate">
              To: {roomDestination || destination.shortName}
            </span>
            <button
              onClick={() => setShowStepsList(!showStepsList)}
              className="text-[#1a73e8] hover:underline font-bold cursor-pointer shrink-0"
            >
              {showStepsList ? 'Hide Steps' : 'View All Steps'}
            </button>
          </div>

          {/* Collapsible Steps list */}
          {showStepsList && (
            <div className="max-h-44 overflow-y-auto space-y-1.5 pt-2 border-t border-slate-100 no-scrollbar animate-in fade-in duration-150">
              {steps.map((step, idx) => (
                <div
                  key={step.stepIndex}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    triggerHaptic('turn_maneuver');
                    speakInstruction(step.instruction);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-xs ${
                    idx === currentStepIndex
                      ? 'bg-[#eff4ff] border border-[#bfd2fd]'
                      : idx < currentStepIndex
                      ? 'opacity-50 line-through text-slate-400'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      idx === currentStepIndex
                        ? 'bg-[#000923] text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="flex-1 truncate font-medium text-[#0c1c2f]">
                    {step.instruction}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {step.distance}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
