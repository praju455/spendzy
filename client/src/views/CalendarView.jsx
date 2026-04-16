import React, { useEffect, useRef, useState } from 'react';
import { Calendar as CalendarFull } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { motion } from 'framer-motion';
import { PlusCircle, Bell } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import socket from '../utils/socket';

const defaultEvents = [
  { id: '1', title: '⚡ Electricity Bill', start: new Date().toISOString().split('T')[0], color: '#ef4444' },
  { id: '2', title: '🏠 Rent Due', start: '2026-05-01', color: '#f59e0b' },
  { id: '3', title: '📺 Netflix Renewal', start: '2026-04-22', color: '#E50914' },
  { id: '4', title: '🎵 Spotify Renewal', start: '2026-05-01', color: '#1DB954' },
];

const CalendarView = ({ familyData }) => {
  const calendarRef = useRef(null);
  const calendarInstance = useRef(null);
  const [reminders, setReminders] = useState(defaultEvents);
  const [newDate, setNewDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');
  const [error, setError] = useState('');

  const allEvents = [
    ...reminders,
    ...(familyData?.calendarEvents?.filter(e => !reminders.find(r => r.id === e.id)) || [])
  ];

  useEffect(() => {
    if (calendarRef.current) {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
      }

      calendarInstance.current = new CalendarFull(calendarRef.current, {
        plugins: [dayGridPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        },
        events: allEvents,
        eventClick: (info) => {
          alert(`📅 ${info.event.title}\n🗓 ${info.event.startStr}`);
        }
      });
      calendarInstance.current.render();

      return () => {
        if (calendarInstance.current) calendarInstance.current.destroy();
      };
    }
  }, [reminders, familyData?.calendarEvents]);

  const addReminder = () => {
    if (!newDate || !newTitle) {
      return setError('Please enter both a date and a description.');
    }
    setError('');
    const newEvent = {
      id: 'rem_' + Date.now(),
      title: '🔔 ' + newTitle,
      start: newDate,
      color: newColor
    };
    setReminders(prev => [...prev, newEvent]);
    socket.emit('add_calendar_event', newEvent);
    setNewDate('');
    setNewTitle('');
  };

  return (
    <motion.section
      id="calendar-trends"
      className="view-section active-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="view-header" style={{ marginBottom: '2rem' }}>
        <h1>📅 Calendar & Reminders</h1>
        <p className="subtitle">View your bills, renewals, and custom reminders</p>
      </div>

      {/* Add Reminder Form */}
      <GlassCard style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} style={{ color: 'var(--primary)' }} /> Add Reminder
        </h3>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', padding: '0.7rem', borderRadius: '8px', color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', gap: '1rem', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Date</label>
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Reminder Description</label>
            <input
              type="text"
              placeholder="e.g. Pay school fees, EMI due..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addReminder()}
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Color</label>
            <input
              type="color"
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
              style={{ height: '44px', width: '60px', padding: '2px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', cursor: 'pointer' }}
            />
          </div>
          <button className="btn btn-primary" onClick={addReminder} style={{ gap: '0.5rem', height: '44px' }}>
            <PlusCircle size={18} /> Add
          </button>
        </div>
      </GlassCard>

      {/* Upcoming Reminders List */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <GlassCard>
          <div ref={calendarRef} style={{ width: '100%', height: '500px', color: 'var(--text-main)' }}></div>
        </GlassCard>

        <GlassCard>
          <h3 style={{ marginBottom: '1.5rem' }}>Upcoming</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto' }}>
            {[...reminders]
              .sort((a, b) => new Date(a.start) - new Date(b.start))
              .map(event => (
                <div key={event.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'rgba(255,255,255,0.03)', padding: '0.75rem',
                  borderRadius: '8px', borderLeft: `4px solid ${event.color}`
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{event.title}</p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {new Date(event.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </GlassCard>
      </div>
    </motion.section>
  );
};

export default CalendarView;
