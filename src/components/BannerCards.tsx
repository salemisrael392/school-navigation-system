import React, { useState } from 'react';
import { Download, QrCode, CheckCircle2 } from 'lucide-react';

interface BannerCardsProps {
  onOpenQRScanner: () => void;
}

export const BannerCards: React.FC<BannerCardsProps> = ({ onOpenQRScanner }) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  const handleStartDownload = () => {
    if (isDownloaded) return;
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloaded(true);
          setTimeout(() => setDownloadProgress(null), 1200);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="px-3 sm:px-4 py-2 space-y-2.5">
      {/* 1. Offline Campus Map Card */}
      <div
        id="card-offline-map"
        className="bg-white rounded-2xl p-3 border border-[#e6dec8] shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#e6eeff] text-[#0e2044] flex items-center justify-center shrink-0">
            {isDownloaded ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Download className="w-5 h-5 text-[#0e2044]" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#000923] truncate">
                Offline Campus M...
              </h3>
              <span className="px-1.5 py-0.5 rounded-md bg-[#dce9ff] text-[#0e2044] text-[10px] font-bold tracking-tight">
                4.2 MB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              High-res vector map for weak ...
            </p>
          </div>
        </div>

        {/* Download Button */}
        <button
          id="btn-download-map"
          onClick={handleStartDownload}
          disabled={downloadProgress !== null || isDownloaded}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 cursor-pointer ${
            isDownloaded
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : downloadProgress !== null
              ? 'bg-slate-100 text-slate-600'
              : 'bg-[#000923] text-white hover:bg-[#0e2044] shadow-xs'
          }`}
        >
          {isDownloaded ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved</span>
            </>
          ) : downloadProgress !== null ? (
            <span>{downloadProgress}%</span>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Scan QR at Entry Card */}
      <div
        id="card-scan-qr"
        className="bg-white rounded-2xl p-3 border border-[#e6dec8] shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#f5efeb] text-[#0e2044] flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-[#4c5e83]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#000923] truncate">
                Scan QR at Entry ...
              </h3>
              <span className="px-1.5 py-0.5 rounded-md bg-[#ffddb6] text-[#643f00] text-[10px] font-bold tracking-tight">
                Gate 1 &amp; 2
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              Sync route directly at campus e...
            </p>
          </div>
        </div>

        {/* Scan Button */}
        <button
          id="btn-open-scanner"
          onClick={onOpenQRScanner}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#000923] bg-[#f8f9ff] border border-[#e2d8c3] hover:bg-[#eff4ff] transition-all active:scale-95 shrink-0 shadow-2xs cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-[#c88d3b]" />
          <span>Scan QR</span>
        </button>
      </div>
    </div>
  );
};
