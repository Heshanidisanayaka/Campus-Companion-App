'use client';

import React, { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    venue: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules?userId=dummy-user-123');
      const data = await res.json();
      if (data.success) {
        setSchedules(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch schedules', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (schedule = null) => {
    if (schedule) {
      setCurrentSchedule(schedule);
      setFormData({
        subject: schedule.subject,
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        venue: schedule.venue
      });
    } else {
      setCurrentSchedule(null);
      setFormData({
        subject: '',
        day: 'Monday',
        startTime: '',
        endTime: '',
        venue: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSchedule(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentSchedule ? `/api/schedules/${currentSchedule._id}` : '/api/schedules';
      const method = currentSchedule ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: 'dummy-user-123' })
      });
      
      const data = await res.json();
      if (data.success) {
        fetchSchedules();
        closeModal();
      } else {
        alert(data.error || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Save error', error);
      alert('An error occurred while saving.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        const res = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchSchedules();
        }
      } catch (error) {
        console.error('Delete error', error);
      }
    }
  };

  // Group schedules by day
  const getSchedulesForDay = (day) => {
    return schedules.filter(s => s.day === day).sort((a, b) => {
      // Simple string sort for time (e.g. '09:00' < '10:00')
      return a.startTime.localeCompare(b.startTime);
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6 md:p-12 font-sans selection:bg-indigo-200">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">
              Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Schedule</span>
            </h1>
            <p className="mt-2 text-zinc-500 text-lg">Manage your weekly timetable efficiently.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="inline-flex items-center justify-center px-6 py-3 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Class
          </button>
        </header>

        {/* Weekly Timetable Grid */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-zinc-500 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              Loading timetable...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
              {DAYS.map((day) => {
                const daySchedules = getSchedulesForDay(day);
                // Highlight current day (mocked as Monday for visual testing if you want, but we'll leave it neutral)
                return (
                  <div key={day} className="flex flex-col h-full bg-zinc-50/50">
                    <div className="p-4 bg-white border-b border-zinc-100 sticky top-0 z-10 text-center lg:text-left">
                      <h3 className="font-bold text-zinc-800 tracking-tight">{day}</h3>
                      <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {daySchedules.length} Classes
                      </span>
                    </div>
                    <div className="p-4 space-y-4 flex-1">
                      {daySchedules.length === 0 ? (
                        <div className="h-full min-h-[100px] flex items-center justify-center text-zinc-300 text-sm italic border-2 border-dashed border-zinc-200 rounded-2xl">
                          Free Day
                        </div>
                      ) : (
                        daySchedules.map((schedule) => (
                          <div 
                            key={schedule._id} 
                            className="group relative bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
                          >
                            {/* Action Buttons (visible on hover) */}
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openModal(schedule)}
                                className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button 
                                onClick={() => handleDelete(schedule._id)}
                                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>

                            <div className="text-xs font-bold text-indigo-600 mb-1">{schedule.startTime} - {schedule.endTime}</div>
                            <h4 className="font-bold text-zinc-900 leading-tight mb-2 pr-10">{schedule.subject}</h4>
                            <div className="flex items-center text-xs font-medium text-zinc-500">
                              <svg className="w-3.5 h-3.5 mr-1 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {schedule.venue}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h2 className="text-xl font-bold text-zinc-900">{currentSchedule ? 'Edit Class' : 'Add New Class'}</h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-700 transition-colors p-2 rounded-full hover:bg-zinc-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. Data Structures"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Day</label>
                <select 
                  name="day" 
                  value={formData.day} 
                  onChange={handleInputChange} 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white text-zinc-900"
                >
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Start Time</label>
                  <input 
                    type="time" 
                    name="startTime" 
                    value={formData.startTime} 
                    onChange={handleInputChange} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">End Time</label>
                  <input 
                    type="time" 
                    name="endTime" 
                    value={formData.endTime} 
                    onChange={handleInputChange} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Venue</label>
                <input 
                  type="text" 
                  name="venue" 
                  value={formData.venue} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. Room 402"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900"
                />
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  {currentSchedule ? 'Save Changes' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
