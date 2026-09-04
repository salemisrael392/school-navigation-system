import React, { useState, useEffect } from 'react';
import { X, QrCode, Flashlight, RefreshCw, CheckCircle2, MapPin } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationDetected: (locationName: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onLocationDetected,
}) => {
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [scannedLocation, setScannedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setScannedLocation(null);
      setTorchOn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const simulateScan = (locationName: string) => {
    triggerHaptic('qr_success');
    setScannedLocation(locationName);
    setTimeout(() => {
      onLocationDetected(locationName);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div
        id="modal-qr-scanner"
        className="bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700 flex flex-col animate-in fade-in zoom-in-95 duration-200 text-white"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Campus QR Waypoint Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative h-64 bg-black flex items-center justify-center overflow-hidden">
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Alignment frame */}
          <div className="relative w-48 h-48 border-2 border-white/40 rounded-2xl flex items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-md" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-md" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-md" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-md" />

            {/* Laser scanning beam */}
            {!scannedLocation ? (
              <div className="absolute left-2 right-2 h-0.5 bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-bounce duration-1000" />
            ) : (
              <div className="flex flex-col items-center justify-center p-3 bg-emerald-900/90 rounded-xl border border-emerald-400 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-1" />
                <span className="text-xs font-bold text-white text-center">
                  Location Verified!
                </span>
                <span className="text-[11px] text-emerald-200">
                  {scannedLocation}
                </span>
              </div>
            )}
          </div>

          {/* Flashlight button */}
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`absolute top-3 right-3 p-2 rounded-full border transition-colors cursor-pointer ${
              torchOn
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-slate-800/80 text-white border-slate-700'
            }`}
            title="Torch"
          >
            <Flashlight className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions & Quick QR Presets */}
        <div className="p-4 bg-slate-800/90 space-y-3">
          <p className="text-xs text-slate-300 text-center font-medium">
            Point camera at the QR code plaque at entrance gates or building porches to sync your location:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'gate-1', name: 'Main Gate 1 Kiosk' },
              { id: 'gate-2', name: 'Gate 2 Shuttle Bay' },
              { id: 'block-a', name: 'Near Block A Lawns' },
              { id: 'library', name: 'Central Library Porch' },
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => simulateScan(loc.name)}
                className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 border border-slate-600 text-left transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] font-bold text-white truncate">
                  {loc.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
