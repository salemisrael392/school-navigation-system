import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Navigation,
  Building2,
  CalendarDays,
  PhoneCall,
  Camera,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  Monitor,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

// Static screenshot artifacts generated for the project
import desktopScreenshot from '../assets/images/campus_portal_desktop_1788504545075.jpg';
import mobileScreenshot from '../assets/images/campus_navigation_mobile_1788504559500.jpg';
import scheduleScreenshot from '../assets/images/campus_schedule_ui_1788504574957.jpg';

interface SharePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureScreenshot?: () => void;
}

const PROJECT_SCREENSHOTS = [
  {
    id: 'desktop-portal',
    title: 'Web Portal & Interactive Campus Map',
    subtitle: 'Desktop view with 3D vector map, academic block finder & location cards',
    badge: 'Desktop Web App',
    image: desktopScreenshot,
    filename: 'SRU_Campus_Portal_Desktop.jpg',
  },
  {
    id: 'mobile-navigation',
    title: 'Mobile Turn-by-Turn Wayfinding',
    subtitle: 'Turn guidance banner, walking distance ETA & GPS route tracking',
    badge: 'Mobile Navigation',
    image: mobileScreenshot,
    filename: 'SRU_Campus_Wayfinding_Mobile.jpg',
  },
  {
    id: 'schedule-routing',
    title: 'Class Timetable & Schedule Routing',
    subtitle: 'Weekly day-wise timeline, faculty details & shortest class walk paths',
    badge: 'Class Schedule',
    image: scheduleScreenshot,
    filename: 'SRU_Class_Timetable_Schedule.jpg',
  },
];

export const SharePortalModal: React.FC<SharePortalModalProps> = ({
  isOpen,
  onClose,
  onCaptureScreenshot,
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'screenshots'>('qr');
  const [copied, setCopied] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState(false);
  const [downloadingShotId, setDownloadingShotId] = useState<string | null>(null);

  if (!isOpen) return null;

  const portalUrl =
    typeof window !== 'undefined' && window.location.href.startsWith('http')
      ? window.location.href.split('?')[0].split('#')[0]
      : 'https://sru-campus-portal.web.app';

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=15&format=png&data=${encodeURIComponent(
    portalUrl
  )}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(portalUrl);
      } else {
        const input = document.createElement('input');
        input.value = portalUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      triggerHaptic('success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    triggerHaptic('tap');
    const text = encodeURIComponent(
      `🎓 *SR University Campus Web Portal*\nInteractive 3D campus map, academic block finder, class timetable wayfinding, and emergency SOS services:\n👉 ${portalUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    triggerHaptic('tap');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SR University Campus Web Portal',
          text: 'Interactive Campus Map, Academic Block Finder, Class Timetable & Emergency Services for SR University.',
          url: portalUrl,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQR = async () => {
    triggerHaptic('tap');
    setDownloadingQR(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'SR_University_Campus_Portal_QR.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(qrImageUrl, '_blank');
    } finally {
      setDownloadingQR(false);
    }
  };

  const handleDownloadScreenshot = (shot: typeof PROJECT_SCREENSHOTS[0]) => {
    triggerHaptic('tap');
    setDownloadingShotId(shot.id);
    try {
      const link = document.createElement('a');
      link.href = shot.image;
      link.download = shot.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloadingShotId(null), 800);
    }
  };

  return (
    <div
      id="share-portal-modal-overlay"
      className="fixed inset-0 z-50 bg-[#000923]/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="share-portal-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#e2d8c3] overflow-hidden my-auto"
      >
        {/* University Header */}
        <div className="bg-[#000923] text-white px-5 sm:px-6 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c88d3b] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Share Portal & Screenshots
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wide border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Scan QR code or download high-res project screenshots
              </p>
            </div>
          </div>
          <button
            id="btn-close-share-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: QR Code vs Screenshots */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3">
          <button
            id="tab-btn-qr-share"
            onClick={() => {
              triggerHaptic('tap');
              setActiveTab('qr');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'border-[#c88d3b] text-[#000923]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4 text-[#c88d3b]" />
            <span>QR Code & Sharing</span>
          </button>

          <button
            id="tab-btn-screenshots"
            onClick={() => {
              triggerHaptic('tap');
              setActiveTab('screenshots');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'screenshots'
                ? 'border-[#c88d3b] text-[#000923]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#c88d3b]" />
            <span>Project Screenshots</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#c88d3b]/20 text-[#c88d3b] text-[10px] font-bold">
              3
            </span>
          </button>
        </div>

        {/* Tab 1: Scannable QR Code */}
        {activeTab === 'qr' && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* QR Code Card Showcase */}
            <div className="bg-gradient-to-b from-[#f8f9ff] to-[#f0f4ff] rounded-2xl p-4 sm:p-5 border border-slate-200 text-center flex flex-col items-center">
              {/* The Scannable QR Code */}
              <div className="bg-white p-3.5 rounded-2xl shadow-md border-2 border-[#000923]/10 relative group">
                <img
                  src={qrImageUrl}
                  alt="SR University Campus Portal Access QR Code"
                  className="w-44 h-44 sm:w-52 sm:h-52 object-contain mx-auto transition-transform group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#000923] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
                  Camera Scannable QR
                </div>
              </div>

              {/* Instruction */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-[#c88d3b]" />
                <span>Friends who scan this instantly load the portal on their phone</span>
              </div>

              {/* Live URL Pill */}
              <div className="mt-2.5 max-w-sm w-full bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                <span className="text-xs font-mono text-slate-700 truncate select-all">
                  {portalUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Copy Link Button */}
              <button
                id="btn-share-copy-link"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#000923] text-white hover:bg-slate-800 text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-300" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              {/* WhatsApp Share Button */}
              <button
                id="btn-share-whatsapp"
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>WhatsApp</span>
              </button>

              {/* Download QR Image */}
              <button
                id="btn-download-qr"
                onClick={handleDownloadQR}
                disabled={downloadingQR}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-2xs transition-all active:scale-98 cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>{downloadingQR ? 'Saving...' : 'Download QR'}</span>
              </button>
            </div>

            {/* What Services Friends Get Feature Badges */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#c88d3b]" />
                Services available upon scanning:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Interactive 3D Map</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">Block A–E & Labs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">Class Timetable</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">24/7 Emergency SOS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Project Screenshots Showcase & Direct Downloads */}
        {activeTab === 'screenshots' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <Camera className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Project Visual Screenshots: </span>
                Click the <span className="font-semibold">Download</span> button on any screenshot to save the high-resolution file to your device for your records, presentations, and submissions.
              </div>
            </div>

            <div className="space-y-4">
              {PROJECT_SCREENSHOTS.map((shot) => (
                <div
                  key={shot.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#c88d3b]/60 transition-all"
                >
                  <div className="relative aspect-video bg-slate-100 overflow-hidden group">
                    <img
                      src={shot.image}
                      alt={shot.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#000923]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {shot.badge}
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-3 bg-white">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#000923] truncate">
                        {shot.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {shot.subtitle}
                      </p>
                    </div>
                    <button
                      id={`btn-download-shot-${shot.id}`}
                      onClick={() => handleDownloadScreenshot(shot)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#000923] hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                      title="Save and download this screenshot"
                    >
                      <Download className="w-3.5 h-3.5 text-[#c88d3b]" />
                      <span>{downloadingShotId === shot.id ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Live Screen Capture */}
            {onCaptureScreenshot && (
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  id="btn-capture-live-screen"
                  onClick={() => {
                    triggerHaptic('tap');
                    onCaptureScreenshot();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-600" />
                  <span>Capture Current View</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
