import React from 'react';
import { X, Bell, Calendar, BookOpen, Bus, Sparkles } from 'lucide-react';
import { CAMPUS_NOTIFICATIONS } from '../data/campusData';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Event':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Academic':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div
        id="modal-notifications"
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-4 py-3 bg-[#000923] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Campus Alerts &amp; Notices
              </h3>
              <p className="text-[10px] text-slate-300">
                Official SR University Broadcasts
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

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {CAMPUS_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-2xl border border-slate-200 bg-[#f8f9ff] hover:bg-white hover:border-[#bfd2fd] transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadge(
                    n.category
                  )}`}
                >
                  {n.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {n.time}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#000923]">{n.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {n.body}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
