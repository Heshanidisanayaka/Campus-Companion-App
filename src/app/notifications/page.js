'use client';

import React, { useState, useEffect } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysUntil(dateStr) {
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

function getTodayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function parseTime(timeStr) {
  // Expects "HH:MM" format
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// ─── Build notifications from raw data ───────────────────────────────────────

function buildNotifications(deadlines, schedules) {
  const notifs = [];
  const today = getTodayName();
  const nowMins = getCurrentMinutes();

  // ── Deadline notifications ──────────────────────────────────────────────────
  deadlines
    .filter((d) => d.status === 'Pending')
    .forEach((d) => {
      const days = getDaysUntil(d.dueDate);

      if (days < 0) {
        notifs.push({
          id: `dl-overdue-${d._id}`,
          type: 'danger',
          icon: '🚨',
          badge: 'Overdue',
          title: `${d.type} Overdue: ${d.title}`,
          subtitle: `${d.subject} · was due ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`,
          priority: 0,
        });
      } else if (days === 0) {
        notifs.push({
          id: `dl-today-${d._id}`,
          type: 'danger',
          icon: '⚠️',
          badge: 'Due Today',
          title: `${d.type} Due Today: ${d.title}`,
          subtitle: `${d.subject} · Submit before midnight!`,
          priority: 1,
        });
      } else if (days === 1) {
        notifs.push({
          id: `dl-tomorrow-${d._id}`,
          type: 'warning',
          icon: '⚠️',
          badge: 'Due Tomorrow',
          title: `${d.type} Due Tomorrow: ${d.title}`,
          subtitle: `${d.subject} · Don't forget to submit!`,
          priority: 2,
        });
      } else if (days <= 7) {
        notifs.push({
          id: `dl-week-${d._id}`,
          type: 'info',
          icon: '📅',
          badge: `In ${days} days`,
          title: `Upcoming ${d.type}: ${d.title}`,
          subtitle: `${d.subject} · Due in ${days} days`,
          priority: 3,
        });
      }
    });

  // ── Schedule / class alerts ─────────────────────────────────────────────────
  schedules
    .filter((s) => s.day === today)
    .forEach((s) => {
      const startMins = parseTime(s.startTime);
      const diffMins = startMins - nowMins;

      if (diffMins > 0 && diffMins <= 60) {
        notifs.push({
          id: `sch-soon-${s._id}`,
          type: 'class',
          icon: '🔔',
          badge: `In ${diffMins} min`,
          title: `Class Starting Soon: ${s.subject}`,
          subtitle: `${s.venue} · ${s.startTime} – ${s.endTime}`,
          priority: 1,
        });
      } else if (diffMins > 60 && diffMins <= 180) {
        notifs.push({
          id: `sch-upcoming-${s._id}`,
          type: 'class',
          icon: '📖',
          badge: 'Today',
          title: `Upcoming Class: ${s.subject}`,
          subtitle: `${s.venue} · ${s.startTime} – ${s.endTime}`,
          priority: 3,
        });
      } else if (diffMins <= 0 && diffMins > -120) {
        notifs.push({
          id: `sch-ongoing-${s._id}`,
          type: 'success',
          icon: '✅',
          badge: 'Ongoing',
          title: `Class in Progress: ${s.subject}`,
          subtitle: `${s.venue} · Ends at ${s.endTime}`,
          priority: 2,
        });
      }
    });

  return notifs.sort((a, b) => a.priority - b.priority);
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const TYPE_STYLES = {
  danger: {
    card: 'border-l-4 border-rose-500 bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    icon: 'bg-rose-100',
  },
  warning: {
    card: 'border-l-4 border-amber-400 bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    icon: 'bg-amber-100',
  },
  info: {
    card: 'border-l-4 border-blue-400 bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    icon: 'bg-blue-100',
  },
  class: {
    card: 'border-l-4 border-violet-400 bg-violet-50',
    badge: 'bg-violet-100 text-violet-700',
    icon: 'bg-violet-100',
  },
  success: {
    card: 'border-l-4 border-emerald-400 bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: 'bg-emerald-100',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchData() {
      try {
        const [dlRes, schRes] = await Promise.all([
          fetch('/api/deadlines?userId=dummy-user-123'),
          fetch('/api/schedules?userId=dummy-user-123'),
        ]);
        const [dlData, schData] = await Promise.all([dlRes.json(), schRes.json()]);

        const deadlines = dlData.success ? dlData.data : [];
        const schedules = schData.success ? schData.data : [];

        setNotifications(buildNotifications(deadlines, schedules));
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const dismiss = (id) => setDismissed((prev) => [...prev, id]);
  const clearAll = () => setDismissed(notifications.map((n) => n.id));

  const FILTER_TYPES = {
    All: null,
    Deadlines: ['danger', 'warning', 'info'],
    Classes: ['class', 'success'],
  };

  const visible = notifications.filter((n) => {
    if (dismissed.includes(n.id)) return false;
    const allowed = FILTER_TYPES[filter];
    if (allowed) return allowed.includes(n.type);
    return true;
  });

  const countByFilter = (f) => {
    const allowed = FILTER_TYPES[f];
    return notifications.filter((n) => {
      if (dismissed.includes(n.id)) return false;
      return allowed ? allowed.includes(n.type) : true;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 font-sans text-zinc-900">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16 space-y-8">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-600">
                Notifications
              </span>
            </h1>
            <p className="mt-2 text-zinc-500">Your reminders, class alerts, and upcoming deadlines.</p>
          </div>
          {visible.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm px-4 py-2 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors font-medium"
            >
              Clear All
            </button>
          )}
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Deadlines', 'Classes'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all relative ${
                filter === f
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              {f}
              {countByFilter(f) > 0 && (
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    filter === f ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {countByFilter(f)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
            <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4" />
            Loading notifications...
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400">
            <span className="text-5xl block mb-3">🎉</span>
            <p className="font-bold text-lg text-zinc-500">All clear!</p>
            <p className="text-sm mt-1 text-zinc-400">No notifications right now. Great job staying on track!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((n) => {
              const s = TYPE_STYLES[n.type] || TYPE_STYLES.info;
              return (
                <div
                  key={n.id}
                  className={`group flex items-start gap-4 p-4 rounded-2xl ${s.card} transition-all hover:shadow-md`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${s.icon} flex items-center justify-center text-xl`}>
                    {n.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
                        {n.badge}
                      </span>
                    </div>
                    <p className="font-bold text-zinc-900 text-sm leading-snug">{n.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{n.subtitle}</p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => dismiss(n.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-white/60 rounded-lg transition-all"
                    title="Dismiss"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Info footer */}
        <p className="text-xs text-center text-zinc-400 pt-4">
          Notifications are generated from your Deadlines and Class Schedule. Refresh the page to get the latest.
        </p>
      </div>
    </div>
  );
}
