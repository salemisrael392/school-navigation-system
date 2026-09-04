import React, { useState, useEffect } from 'react';
import {
  X,
  Navigation,
  ArrowUp,
  CornerUpRight,
  CornerUpLeft,
  ChevronsUp,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Building, NavigationStep } from '../types';
import { DEFAULT_NAVIGATION_STEPS } from '../data/campusData';

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

  const steps = DEFAULT_NAVIGATION_STEPS;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isArrived = currentStepIndex >= steps.length - 1;

  // Speak instruction using Web Speech synthesis if enabled
  const speakInstruction = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      speakInstruction(`Starting route to ${roomDestination || destination.name}. ${steps[0].instruction}`);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAutoSimulating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (isAutoSimulating && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
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
      speakInstruction(steps[nextIdx].instruction);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      speakInstruction(steps[prevIdx].instruction);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'turn-right':
        return <CornerUpRight className="w-8 h-8 text-white" />;
      case 'turn-left':
        return <CornerUpLeft className="w-8 h-8 text-white" />;
      case 'elevator':
        return <ChevronsUp className="w-8 h-8 text-white" />;
      case 'arrive':
        return <CheckCircle2 className="w-8 h-8 text-white" />;
      default:
        return <ArrowUp className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#000923]/80 backdrop-blur-sm p-3 sm:p-4">
      {/* Top Wayfinding HUD Banner */}
      <div className="w-full max-w-md mx-auto bg-[#000923] text-white rounded-3xl p-4 shadow-2xl border border-slate-700">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Live Campus Navigation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-slate-800 text-amber-400'
                  : 'bg-slate-800/50 text-slate-500'
              }`}
              title={isVoiceEnabled ? 'Voice Guidance On' : 'Voice Guidance Muted'}
            >
              {isVoiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Maneuver Box */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0e2044] border border-[#3b82f6]/40 flex items-center justify-center shrink-0 shadow-inner">
            {getStepIcon(currentStep.iconType)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-amber-400 font-bold mb-0.5">
              Step {currentStepIndex + 1} of {steps.length} • in {currentStep.distance}
            </div>
            <h2 className="text-base sm:text-lg font-extrabold leading-snug text-white">
              {currentStep.instruction}
            </h2>
            {currentStep.landmarkNote && (
              <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
                <span>📍</span> {currentStep.landmarkNote}
              </p>
            )}
          </div>
        </div>

        {/* ETA & Remaining Progress */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Destination:</span>{' '}
            <span className="font-bold text-white">
              {roomDestination || destination.shortName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 font-bold">
              {Math.max(1, 2 - Math.floor((currentStepIndex / steps.length) * 2))} min
            </span>{' '}
            <span className="text-slate-400">
              ({Math.max(10, 120 - currentStepIndex * 28)}m)
            </span>
          </div>
        </div>
      </div>

      {/* Center Action Controls (Simulate Movement) */}
      <div className="w-full max-w-md mx-auto my-auto py-4 flex flex-col items-center">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              Interactive Route Simulator
            </span>
            <span className="text-[11px] text-slate-500">
              {isArrived ? 'Arrived at destination' : 'Walking to point'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoSimulating(!isAutoSimulating)}
              disabled={isArrived}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAutoSimulating
                  ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                  : 'bg-[#000923] text-white hover:bg-[#0e2044]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isAutoSimulating ? 'Simulating Walk...' : 'Auto-Simulate Walk'}</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={isArrived}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Next Step ➔
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsAutoSimulating(false);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Step List Drawer */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#000923] uppercase tracking-wider">
            All Route Steps
          </h3>
          <button
            onClick={onClose}
            className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
          >
            End Navigation
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {steps.map((step, idx) => (
            <div
              key={step.stepIndex}
              onClick={() => {
                setCurrentStepIndex(idx);
                speakInstruction(step.instruction);
              }}
              className={`p-2 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-[#eff4ff] border border-[#bfd2fd]'
                  : idx < currentStepIndex
                  ? 'opacity-50 line-through text-slate-400'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  idx === currentStepIndex
                    ? 'bg-[#000923] text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0c1c2f] truncate">
                  {step.instruction}
                </p>
                <span className="text-[10px] text-slate-400">{step.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
