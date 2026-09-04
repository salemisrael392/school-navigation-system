import React, { useState } from 'react';
import { X, PhoneCall, ShieldAlert, HeartPulse, ShieldCheck, Flame, BellRing, MapPin } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/campusData';
import { triggerHaptic } from '../utils/haptics';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocationName: string;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  userLocationName,
}) => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [alarmTriggered, setAlarmTriggered] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCall = (title: string, phone: string) => {
    triggerHaptic('sos_trigger');
    setActiveCall(title);
    setTimeout(() => {
      // simulate dial
      window.location.href = `tel:${phone.replace(/[^0-9]/g, '')}`;
    }, 500);
  };

  const handleToggleAlarm = () => {
    const nextState = !alarmTriggered;
    if (nextState) {
      triggerHaptic('sos_trigger');
    } else {
      triggerHaptic('tap');
    }
    setAlarmTriggered(nextState);
  };

  const getContactIcon = (icon: string) => {
    switch (icon) {
      case 'ambulance':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-orange-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#000923]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-red-950/70 backdrop-blur-xs">
      <div
        id="modal-emergency-sos"
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border-2 border-red-500 flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3.5 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-black">
              ✱
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Emergency SOS &amp; Medical Help
              </h3>
              <p className="text-[11px] text-red-100 font-medium">
                SR University Campus Safety Desk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-red-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Location readout */}
        <div className="p-3 bg-red-50 border-b border-red-200 flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-slate-500 font-medium">Your Current Location: </span>
            <span className="font-bold text-red-700">{userLocationName}</span>
            <p className="text-[10px] text-slate-500">
              Tell security: &quot;Near Block A Lawns, SR University Main Campus, Ananthasagar&quot;
            </p>
          </div>
        </div>

        {/* Contact List */}
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.phone}
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-red-300 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  {getContactIcon(contact.icon)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#000923] truncate">
                    {contact.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {contact.role}
                  </p>
                  <span className="text-[10.5px] font-bold text-red-600">
                    {contact.phone}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCall(contact.title, contact.phone)}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call</span>
              </button>
            </div>
          ))}
        </div>

        {/* Siren Alert Toggle */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className={`w-4 h-4 ${alarmTriggered ? 'text-red-600 animate-bounce' : 'text-slate-500'}`} />
            <span className="text-xs font-bold text-slate-700">
              {alarmTriggered ? 'Audible Alarm Emitting!' : 'Sound Local Alert Siren'}
            </span>
          </div>
          <button
            onClick={handleToggleAlarm}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              alarmTriggered
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {alarmTriggered ? 'Silence Siren' : 'Test Siren'}
          </button>
        </div>
      </div>
    </div>
  );
};
