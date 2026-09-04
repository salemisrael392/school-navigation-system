import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Navigation,
  Compass,
  User,
  CheckCircle2,
  Sparkles,
  BookOpen,
  X,
  RotateCcw,
} from 'lucide-react';
import { ClassScheduleItem, DayOfWeek, Building } from '../types';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { DAYS_OF_WEEK, getNextUpcomingClass } from '../utils/scheduleHelper';
import { triggerHaptic } from '../utils/haptics';

interface ScheduleViewProps {
  scheduleItems: ClassScheduleItem[];
  onAddClass: (newItem: Omit<ClassScheduleItem, 'id'>) => void;
  onDeleteClass: (id: string) => void;
  onResetSchedule: () => void;
  onHighlightBuildingOnMap: (buildingId: string, room?: string) => void;
  currentDay: DayOfWeek;
  onChangeDay: (day: DayOfWeek) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  scheduleItems,
  onAddClass,
  onDeleteClass,
  onResetSchedule,
  onHighlightBuildingOnMap,
  currentDay,
  onChangeDay,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [subjectName, setSubjectName] = useState<string>('');
  const [courseCode, setCourseCode] = useState<string>('');
  const [formDay, setFormDay] = useState<DayOfWeek>(currentDay);
  const [startTime, setStartTime] = useState<string>('09:30 AM');
  const [endTime, setEndTime] = useState<string>('10:30 AM');
  const [buildingId, setBuildingId] = useState<string>('srix-block-a');
  const [room, setRoom] = useState<string>('Room 204 • Level 2');
  const [facultyName, setFacultyName] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Determine next upcoming class
  const nextClassInfo = getNextUpcomingClass(scheduleItems, currentDay);
  const nextClass = nextClassInfo.item;

  // Filter for currently selected day tab
  const dayClasses = scheduleItems
    .filter((item) => item.day === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setFormError('Please enter a subject title');
      return;
    }

    const selectedBuilding = CAMPUS_BUILDINGS.find((b) => b.id === buildingId);
    const buildingName = selectedBuilding ? selectedBuilding.name : 'Campus Building';

    triggerHaptic('tap');
    onAddClass({
      subjectName: subjectName.trim(),
      courseCode: courseCode.trim() || 'ACAD-101',
      day: formDay,
      startTime,
      endTime,
      buildingId,
      buildingName,
      room: room.trim() || 'Classroom',
      facultyName: facultyName.trim() || undefined,
      color: '#3b82f6',
    });

    // Reset and close
    setSubjectName('');
    setCourseCode('');
    setFacultyName('');
    setFormError('');
    setIsAddModalOpen(false);
  };

  const handleShowOnMap = (item: ClassScheduleItem) => {
    triggerHaptic('start_navigation');
    onHighlightBuildingOnMap(item.buildingId, item.room);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-5 pb-24">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#000923] text-white flex items-center justify-center shadow-xs">
            <CalendarDays className="w-5 h-5 text-[#c88d3b]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#000923]">Student Timetable</h2>
            <p className="text-xs sm:text-sm text-slate-500">Live schedule with automatic map wayfinding</p>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('tap');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#000923] hover:bg-[#0e2044] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column on Desktop: Next Class Spotlight & Day Selector */}
        <div className="lg:col-span-5 space-y-4">
          {/* NEXT CLASS SPOTLIGHT BANNER */}
          {nextClass ? (
            <div className="bg-gradient-to-br from-[#000923] via-[#091e42] to-[#173366] text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-blue-900/60 relative overflow-hidden">
              {/* Subtle decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-300">
                    {nextClassInfo.status === 'ongoing'
                      ? '⚡ Ongoing Class Now'
                      : '🎯 Next Upcoming Class'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-900/80 text-[10px] font-mono text-blue-200 border border-blue-700/50">
                  {nextClass.courseCode}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                {nextClass.subjectName}
              </h3>

              <div className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">
                    {nextClass.startTime} - {nextClass.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-bold text-white">
                    {nextClass.buildingName} • {nextClass.room}
                  </span>
                </div>
                {nextClass.facultyName && (
                  <div className="flex items-center gap-2 text-xs text-blue-200/80">
                    <User className="w-4 h-4 text-blue-300 shrink-0" />
                    <span>Instructor: {nextClass.facultyName}</span>
                  </div>
                )}
              </div>

              {/* Action Button: Highlight on Map */}
              <div className="mt-4 pt-3.5 border-t border-blue-800/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-blue-300 font-medium">
                  Auto-focuses location on map
                </span>
                <button
                  onClick={() => handleShowOnMap(nextClass)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Highlight &amp; Route</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl text-emerald-800 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">No Classes Pending Today</p>
                <p className="text-[11px] text-emerald-700">Enjoy your free time or explore study spaces in the library.</p>
              </div>
            </div>
          )}

          {/* Day Selector Pills */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
              Select Day of Week
            </span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
              {DAYS_OF_WEEK.map((day) => {
                const count = scheduleItems.filter((i) => i.day === day).length;
                const isSelected = currentDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      triggerHaptic('tap');
                      onChangeDay(day);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#000923] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{day.slice(0, 3)}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-blue-900 text-blue-200' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column on Desktop: Daily Class Cards List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span>{currentDay}&apos;s Class Schedule ({dayClasses.length})</span>
            <button
              onClick={() => {
                triggerHaptic('tap');
                onResetSchedule();
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              title="Reload default university schedule"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
          </div>

          {dayClasses.map((item) => {
            const isNext = nextClass?.id === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-white border transition-all flex flex-col gap-2.5 shadow-2xs ${
                  isNext
                    ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20'
                    : 'border-[#e6dec8] hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10.5px] font-bold border border-blue-200">
                        {item.courseCode}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.startTime} - {item.endTime}
                      </span>
                      {isNext && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                          NEXT
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#000923] mt-1">
                      {item.subjectName}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#c88d3b] shrink-0" />
                      <span className="font-semibold text-[#0c1c2f]">
                        {item.buildingName}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">{item.room}</span>
                    </div>

                    {item.facultyName && (
                      <div className="text-[10.5px] text-slate-400 mt-0.5">
                        Faculty: {item.facultyName}
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleShowOnMap(item)}
                      className="p-2 rounded-xl bg-[#000923] hover:bg-[#0e2044] text-white transition-all active:scale-95 cursor-pointer shadow-2xs"
                      title="Highlight this class on map"
                    >
                      <Navigation className="w-3.5 h-3.5 fill-white" />
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic('tap');
                        onDeleteClass(item.id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove from schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {dayClasses.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">
                No classes scheduled for {currentDay}
              </p>
              <p className="text-[11px] text-slate-400">
                Click &quot;Add Class&quot; above to input your period schedule.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: INPUT NEW CLASS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div
            id="modal-add-class"
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#000923] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Add Timetable Period
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
              {formError && (
                <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Subject Title */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Distributed Operating Systems"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#000923]"
                  required
                />
              </div>

              {/* Course Code & Day */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CS-312"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#000923]"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Day of Week
                  </label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as DayOfWeek)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#000923] bg-white cursor-pointer"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:30 AM"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#000923]"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#000923]"
                  />
                </div>
              </div>

              {/* Campus Building */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Campus Building Location *
                </label>
                <select
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#000923] bg-white cursor-pointer"
                >
                  {CAMPUS_BUILDINGS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.shortName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Number & Faculty */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Room / Lab Number
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Room 204 • Level 2"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#000923]"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Faculty / Professor
                  </label>
                  <input
                    type="text"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="e.g. Dr. K. Srinivas"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#000923]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#000923] hover:bg-[#0e2044] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save to Timetable
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
