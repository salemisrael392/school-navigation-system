import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Settings,
  AlertTriangle,
  Sparkles,
  Clock,
  Info,
  Navigation,
  Volume2,
  VolumeX,
  Vibrate,
  MapPin,
  Calendar,
  Radio,
  Sliders,
} from 'lucide-react';
import { CampusNotification, NotificationCategory } from '../types';
import { NotificationSettings } from '../utils/notificationEngine';
import { triggerHaptic } from '../utils/haptics';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CampusNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDeleteNotification: (id: string) => void;
  onSelectNotificationAction: (notification: CampusNotification) => void;
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  onSimulateAlert: (type: 'closure' | 'event' | 'schedule' | 'advisory') => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onDeleteNotification,
  onSelectNotificationAction,
  settings,
  onUpdateSettings,
  onSimulateAlert,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationCategory>('all');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  const getCategoryBadge = (category: NotificationCategory) => {
    switch (category) {
      case 'closure':
        return {
          bg: 'bg-red-100 text-red-700 border-red-200',
          icon: <AlertTriangle className="w-3 h-3 text-red-600" />,
          label: 'Closure',
        };
      case 'event':
        return {
          bg: 'bg-purple-100 text-purple-700 border-purple-200',
          icon: <Sparkles className="w-3 h-3 text-purple-600" />,
          label: 'Campus Event',
        };
      case 'schedule':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Clock className="w-3 h-3 text-amber-700" />,
          label: 'Class Schedule',
        };
      case 'advisory':
      default:
        return {
          bg: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Info className="w-3 h-3 text-blue-600" />,
          label: 'Advisory',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div
        id="modal-notifications"
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#000923] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white ring-2 ring-[#000923]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Real-Time Campus Alerts
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Push Active
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                Location &amp; Timetable Synchronized Broadcasts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                triggerHaptic('tap');
                setShowSettings(!showSettings);
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showSettings
                  ? 'bg-amber-400 text-slate-900'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel (Expandable) */}
        {showSettings && (
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                Notification Preferences
              </span>
              <span className="text-[10px] text-slate-500">Auto-saved to device</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={settings.locationAlerts}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, locationAlerts: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    Location Alerts
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Nearby events &amp; closures
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={settings.scheduleAlerts}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, scheduleAlerts: e.target.checked })
                  }
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    Class Alerts
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Room closures &amp; timings
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, soundEnabled: e.target.checked })
                  }
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-purple-600" />
                    Audio Chime
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Two-tone alert bell
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={settings.hapticEnabled}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, hapticEnabled: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Vibrate className="w-3 h-3 text-emerald-600" />
                    Haptic Vibe
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Vibration pulses
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Live Simulation Trigger Bar */}
        <div className="p-2.5 bg-[#f0f4ff] border-b border-blue-100 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#000923] flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              Simulate Real-Time Push Triggers:
            </span>
            <span className="text-[10px] text-slate-500">Triggers live banner toast</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              onClick={() => {
                triggerHaptic('tap');
                onSimulateAlert('closure');
              }}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
              <span>Building Closure</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap');
                onSimulateAlert('event');
              }}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
              <span>Campus Event</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap');
                onSimulateAlert('schedule');
              }}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Clock className="w-3 h-3 text-amber-700 shrink-0" />
              <span>Class Alert</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap');
                onSimulateAlert('advisory');
              }}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Info className="w-3 h-3 text-blue-600 shrink-0" />
              <span>Location Advisory</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Quick Actions */}
        <div className="px-3 pt-2.5 pb-2 flex items-center justify-between gap-2 border-b border-slate-100 overflow-x-auto">
          <div className="flex items-center gap-1">
            {(
              [
                { id: 'all', label: 'All', count: notifications.length },
                {
                  id: 'closure',
                  label: 'Closures',
                  count: notifications.filter((n) => n.category === 'closure').length,
                },
                {
                  id: 'event',
                  label: 'Events',
                  count: notifications.filter((n) => n.category === 'event').length,
                },
                {
                  id: 'schedule',
                  label: 'Schedule',
                  count: notifications.filter((n) => n.category === 'schedule').length,
                },
                {
                  id: 'advisory',
                  label: 'Advisory',
                  count: notifications.filter((n) => n.category === 'advisory').length,
                },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  triggerHaptic('tap');
                  setActiveFilter(filter.id);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === filter.id
                    ? 'bg-[#000923] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  onMarkAllAsRead();
                }}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3 h-3" />
                Read All
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  onClearAll();
                }}
                className="text-[10px] font-semibold text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-3 space-y-2.5 overflow-y-auto max-h-[48vh] flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
              <p className="text-xs font-medium">No alerts under this category</p>
              <p className="text-[10px] text-slate-400">
                You will receive alerts automatically as you move across campus or as your schedule updates.
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const badge = getCategoryBadge(n.category);
              return (
                <div
                  key={n.id}
                  onClick={() => onMarkAsRead(n.id)}
                  className={`p-3 rounded-2xl border transition-all space-y-2 relative cursor-pointer ${
                    n.read
                      ? 'border-slate-200 bg-white hover:border-slate-300'
                      : 'border-blue-200 bg-[#f8faff] hover:bg-white hover:border-blue-300 shadow-xs'
                  }`}
                >
                  {/* Top metadata */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                      {n.locationTag && (
                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          {n.locationTag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {n.timeFormatted}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" title="Unread" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic('tap');
                          onDeleteNotification(n.id);
                        }}
                        className="text-slate-300 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                        title="Delete notification"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className="text-xs font-bold text-[#000923] leading-snug">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      {n.body}
                    </p>
                  </div>

                  {/* Actions footer */}
                  {n.buildingId && (
                    <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500">
                        {n.buildingName}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic('start_navigation');
                          onSelectNotificationAction(n);
                        }}
                        className="px-2.5 py-1 bg-[#000923] hover:bg-[#13234d] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        <Navigation className="w-2.5 h-2.5 fill-current text-amber-400" />
                        <span>{n.actionLabel || 'Route on Map'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-600" />
            <span>Geo-fence polling active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
