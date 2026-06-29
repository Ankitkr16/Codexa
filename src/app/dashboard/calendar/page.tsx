"use client";

import { useEffect, useState } from "react";
import { getCalendarSchedule, CalendarEvent } from "@/server/actions/calendar";
import { Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Link2, CheckCircle2, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const schedule = await getCalendarSchedule();
        setEvents(schedule);
        // Default selected date to today
        setSelectedDate(new Date().toISOString().split("T")[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Pad previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const todayStr = new Date().toISOString().split("T")[0];

  // Group events by date for calendar render
  const eventsByDate: Record<string, CalendarEvent[]> = {};
  events.forEach((event) => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  const selectedDayEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4 text-left">
        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <CalendarIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Coding Calendar</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track scheduled problem revisions, set contest reminders, and view daily solving activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
          {/* Header Controls */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base sm:text-lg">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 text-white transition-all"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 text-white transition-all"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b border-white/5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;

              const dayStr = day.toISOString().split("T")[0];
              const isToday = dayStr === todayStr;
              const isSelected = dayStr === selectedDate;
              const dayEvents = eventsByDate[dayStr] || [];

              return (
                <button
                  key={dayStr}
                  onClick={() => setSelectedDate(dayStr)}
                  className={`aspect-square rounded-xl p-1.5 flex flex-col justify-between items-center border transition-all ${
                    isSelected
                      ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                      : isToday
                      ? "bg-white/10 border-primary/40 text-white"
                      : "bg-white/2 border-white/5 text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-xs font-semibold">{day.getDate()}</span>

                  {/* Indicators */}
                  <div className="flex gap-1 justify-center w-full min-h-[6px]">
                    {dayEvents.map((event) => (
                      <span
                        key={event.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.type === "REVISION"
                            ? "bg-yellow-400"
                            : event.type === "CONTEST_REMINDER"
                            ? "bg-blue-400"
                            : "bg-green-400"
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda panel */}
        <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-primary" />
              Agenda for {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : "Selected Day"}
            </h3>

            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-xl border flex flex-col gap-2 ${
                      event.type === "REVISION"
                        ? "bg-yellow-500/5 border-yellow-500/10"
                        : event.type === "CONTEST_REMINDER"
                        ? "bg-blue-500/5 border-blue-500/10"
                        : "bg-green-500/5 border-green-500/10"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                        event.type === "REVISION"
                          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                          : event.type === "CONTEST_REMINDER"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : "bg-green-500/10 border-green-500/20 text-green-400"
                      }`}>
                        {event.type.replace("_", " ")}
                      </span>
                      {event.platform && (
                        <span className="text-[8px] font-semibold text-muted-foreground uppercase">
                          {event.platform}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-white leading-relaxed">{event.title}</h4>

                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1 mt-1"
                      >
                        <Link2 className="h-3 w-3" />
                        Solve / Review Problem
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  No coding reminders or activities scheduled for this date.
                </div>
              )}
            </div>
          </div>

          {/* Quick Help Legend */}
          <div className="p-3 bg-white/2 rounded-xl border border-white/5 space-y-2 text-[10px]">
            <span className="font-semibold text-white block">Legend & Categories</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span>Problem Revisions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Contest Notifications</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>Solved Activities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
