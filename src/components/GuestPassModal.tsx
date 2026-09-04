import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, Wifi, Check, Download, Calendar, Clock, MapPin } from 'lucide-react';

interface GuestPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestPassModal: React.FC<GuestPassModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [visitorName, setVisitorName] = useState<string>('Alex Johnson');
  const [purpose, setPurpose] = useState<string>('Campus Visit & Lab Tour');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div
        id="modal-guest-pass"
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#000923] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white text-[#000923] flex items-center justify-center font-bold text-xs">
              sru
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                SR University Telangana
              </h3>
              <p className="text-[10px] text-slate-300">
                Official Digital Campus Pass
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-4 space-y-3.5 bg-gradient-to-b from-[#f8f9ff] to-white">
          {/* Status Chip */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Active Pass • Verified
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              #SRU-2026-8942
            </span>
          </div>

          {/* QR Code Presentation */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="w-36 h-36 bg-slate-900 rounded-xl p-2 flex items-center justify-center shadow-inner relative group">
              {/* Simulated QR Pattern */}
              <div className="w-full h-full bg-white rounded-lg p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-4 border-black p-0.5"><div className="w-full h-full bg-black"/></div>
                  <div className="w-6 h-6 border-4 border-black p-0.5"><div className="w-full h-full bg-black"/></div>
                </div>
                <div className="text-[9px] font-black tracking-widest text-slate-900">
                  SCAN AT GATE 1 / 2
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-6 h-6 border-4 border-black p-0.5"><div className="w-full h-full bg-black"/></div>
                  <div className="w-4 h-4 bg-black"/>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">
              Present at turnstile reader at Gate 1 or Gate 2
            </p>
          </div>

          {/* Visitor Details */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Visitor Name</span>
              <span className="font-bold text-[#0c1c2f]">{visitorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Purpose</span>
              <span className="font-bold text-[#0c1c2f]">{purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Valid Until</span>
              <span className="font-bold text-emerald-700">Today, 21:00 IST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Host Wing</span>
              <span className="font-bold text-[#0c1c2f]">Admissions &amp; SRiX</span>
            </div>
          </div>

          {/* Guest Wi-Fi Voucher */}
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#0e2044]" />
              <div>
                <p className="font-bold text-[#000923]">Complimentary Wi-Fi</p>
                <p className="text-[10px] text-slate-500">SSID: SRU_Guest_Free</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-white rounded-lg font-mono text-[11px] font-bold text-[#0e2044] border border-blue-200">
              PASS2026
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 2000);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#000923] text-white text-xs font-bold shadow-xs hover:bg-[#0e2044] transition-all active:scale-98 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved to Device</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Save Pass</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
