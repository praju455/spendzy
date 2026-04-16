import React, { useEffect, useRef } from 'react';
import { Calendar as CalendarFull } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

const CalendarView = ({ familyData }) => {
  const calendarRef = useRef(null);
  const calendarInstance = useRef(null);

  useEffect(() => {
    if (calendarRef.current) {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
      }
      
      calendarInstance.current = new CalendarFull(calendarRef.current, {
        plugins: [ dayGridPlugin, timeGridPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: familyData?.calendarEvents || []
      });
      calendarInstance.current.render();

      return () => {
        if(calendarInstance.current) calendarInstance.current.destroy();
      };
    }
  }, [familyData?.calendarEvents]);

  return (
    <motion.section 
      id="calendar-trends" 
      className="view-section active-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="view-header" style={{ marginBottom: '2rem' }}>
        <h1>Interactive Calendar View</h1>
        <p className="subtitle">Dynamically loading DB entries via FullCalendar.io</p>
      </div>

      <GlassCard className="windowHeightFix">
        <div ref={calendarRef} style={{ width: '100%', height: '600px', color: 'var(--text-main)' }}></div>
      </GlassCard>
    </motion.section>
  );
};

export default CalendarView;
