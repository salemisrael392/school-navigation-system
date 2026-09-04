import React, { useState } from 'react';
import { Download, QrCode, CheckCircle2, Share2 } from 'lucide-react';

interface BannerCardsProps {
  onOpenQRScanner: () => void;
  onOpenSharePortal?: () => void;
  className?: string;
}

export const BannerCards: React.FC<BannerCardsProps> = ({
  onOpenQRScanner,
  onOpenSharePortal,
  className = '',
}) => {
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
    <div className={`w-full py-1 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* 1. Share Portal & Friends QR Access Card */}
        {onOpenSharePortal && (
          <div
            id="card-share-portal"
            className="sm:col-span-2 bg-gradient-to-r from-[#000923] to-[#0e2044] text-white rounded-2xl p-3 sm:p-3.5 border border-[#c88d3b]/40 shadow-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#c88d3b] text-white flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Share Campus Portal with Friends
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-tight shrink-0 border border-emerald-500/40">
                    QR Access
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                  Show scannable QR code to friends for instant maps, blocks &amp; timetable
                </p>
              </div>
            </div>

            <button
              id="btn-banner-share-portal"
              onClick={onOpenSharePortal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#000923] bg-[#c88d3b] hover:bg-[#d99f4d] transition-all active:scale-95 shrink-0 shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#000923]" />
              <span className="whitespace-nowrap">Show QR</span>
            </button>
          </div>
        )}

        {/* 2. Offline Campus Map Card */}
        <div
          id="card-offline-map"
          className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#e6dec8] shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
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
                <h3 className="text-xs sm:text-sm font-bold text-[#000923]">
                  Offline Map
                </h3>
                <span className="px-1.5 py-0.5 rounded-md bg-[#dce9ff] text-[#0e2044] text-[10px] font-bold tracking-tight shrink-0">
                  4.2 MB
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Vector map for low reception zones
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

        {/* 3. Scan QR at Entry Card */}
        <div
          id="card-scan-qr"
          className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#e6dec8] shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#f5efeb] text-[#0e2044] flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5 text-[#4c5e83]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#000923]">
                  Scan Gate QR
                </h3>
                <span className="px-1.5 py-0.5 rounded-md bg-[#ffddb6] text-[#643f00] text-[10px] font-bold tracking-tight shrink-0">
                  Gate 1 &amp; 2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Sync route at physical entry pillars
              </p>
            </div>
          </div>

          <button
            id="btn-open-scanner"
            onClick={onOpenQRScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#000923] bg-[#f8f9ff] border border-[#e2d8c3] hover:bg-[#eff4ff] transition-all active:scale-95 shrink-0 shadow-2xs cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-[#c88d3b]" />
            <span>Scan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

