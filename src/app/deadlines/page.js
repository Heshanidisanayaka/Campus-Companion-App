'use client';

import React, { useState, useEffect } from 'react';

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    type: 'Assignment',
    dueDate: '',
  });

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const res = await fetch('/api/deadlines?userId=dummy-user-123');
      const data = await res.json();
      if (data.success) {
        setDeadlines(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch deadlines', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: 'dummy-user-123' })
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData({ title: '', subject: '', type: 'Assignment', dueDate: '' });
        setIsModalOpen(false);
        fetchDeadlines();
      } else {
        alert(data.error || 'Failed to save deadline');
      }
    } catch (error) {
      console.error('Save error', error);
      alert('An error occurred while saving.');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      const res = await fetch(`/api/deadlines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchDeadlines();
      }
    } catch (error) {
      console.error('Status update error', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this deadline?')) {
      try {
        const res = await fetch(`/api/deadlines/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchDeadlines();
        }
      } catch (error) {
        console.error('Delete error', error);
      }
    }
  };

  // Helper to determine date styling (Overdue, Due Soon, Future)
  const getDateWarningStyles = (dateString, status) => {
    if (status === 'Completed') return 'text-zinc-500';
    
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-full'; // Overdue
    if (diffDays <= 2) return 'text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full'; // Due Soon (<= 2 days)
    return 'text-zinc-500'; // Normal
  };

  const pendingTasks = deadlines.filter(d => d.status === 'Pending');
  const completedTasks = deadlines.filter(d => d.status === 'Completed');

  const renderDeadlineCard = (deadline) => (
    <div key={deadline._id} className={`group relative p-5 rounded-2xl border transition-all ${deadline.status === 'Completed' ? 'bg-zinc-50 border-zinc-200 opacity-60' : 'bg-white border-zinc-200 hover:border-indigo-300 hover:shadow-md'}`}>
      <div className="flex items-start gap-4">
        
        {/* Custom Checkbox */}
        <button 
          onClick={() => handleStatusToggle(deadline._id, deadline.status)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${deadline.status === 'Completed' ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-300 hover:border-indigo-400 text-transparent hover:text-indigo-200'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              deadline.type === 'Exam' ? 'bg-rose-100 text-rose-700' : 
              deadline.type === 'Quiz' ? 'bg-amber-100 text-amber-700' : 
              'bg-blue-100 text-blue-700'
            }`}>
              {deadline.type}
            </span>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{deadline.subject}</span>
          </div>
          <h3 className={`font-bold text-lg truncate ${deadline.status === 'Completed' ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
            {deadline.title}
          </h3>
          <div className="flex items-center mt-2 text-sm">
            <svg className="w-4 h-4 mr-1.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className={getDateWarningStyles(deadline.dueDate, deadline.status)}>
              {new Date(deadline.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <button 
          onClick={() => handleDelete(deadline._id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6 md:p-12 font-sans selection:bg-indigo-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">
              Deadline <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">Tracker</span>
            </h1>
            <p className="mt-2 text-zinc-500 text-lg">Stay on top of your assignments, quizzes, and exams.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add Deadline
          </button>
        </header>

        {loading ? (
          <div className="p-20 text-center text-zinc-500 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            Loading deadlines...
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Pending Tasks */}
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center">
                <span className="w-3 h-3 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
                Pending Tasks <span className="ml-2 text-sm font-medium text-zinc-400 bg-zinc-200 px-2 py-0.5 rounded-full">{pendingTasks.length}</span>
              </h2>
              {pendingTasks.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-zinc-200 rounded-3xl text-center text-zinc-500">
                  <span className="text-4xl mb-2 block">🎉</span>
                  <p className="font-bold">You're all caught up!</p>
                  <p className="text-sm mt-1 text-zinc-400">No pending deadlines at the moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.map(renderDeadlineCard)}
                </div>
              )}
            </section>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-zinc-400 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  Completed <span className="ml-2 text-sm font-medium text-zinc-300 bg-zinc-200 px-2 py-0.5 rounded-full">{completedTasks.length}</span>
                </h2>
                <div className="space-y-3">
                  {completedTasks.map(renderDeadlineCard)}
                </div>
              </section>
            )}

          </div>
        )}

      </div>

      {/* Modal for Add Deadline */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h2 className="text-xl font-bold text-zinc-900">Add New Deadline</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors p-2 rounded-full hover:bg-zinc-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Task Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. Linear Algebra Problem Set 3"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange} 
                  required
                  placeholder="e.g. Mathematics"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Type</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleInputChange} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white text-zinc-900"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Due Date</label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    value={formData.dueDate} 
                    onChange={handleInputChange} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-zinc-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Add Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
