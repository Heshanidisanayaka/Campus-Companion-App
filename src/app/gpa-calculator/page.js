'use client';

import React, { useState, useEffect, useMemo } from 'react';

const GRADE_POINTS = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0,
  'F': 0.0
};

export default function GPACalculatorPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    grade: 'A',
    credits: 3
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/results?userId=dummy-user-123');
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch results', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'credits' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: 'dummy-user-123' })
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData({ subject: '', grade: 'A', credits: 3 }); // Reset form
        fetchResults(); // Refresh list
      } else {
        alert(data.error || 'Failed to save result');
      }
    } catch (error) {
      console.error('Save error', error);
      alert('An error occurred while saving.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/results/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchResults();
      }
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  const gpaData = useMemo(() => {
    if (results.length === 0) return { gpa: '0.00', totalCredits: 0 };

    let totalPoints = 0;
    let totalCredits = 0;

    results.forEach(result => {
      const point = GRADE_POINTS[result.grade] || 0;
      totalPoints += point * result.credits;
      totalCredits += result.credits;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    return { gpa, totalCredits };
  }, [results]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6 md:p-12 font-sans selection:bg-emerald-200">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">
              GPA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Calculator</span>
            </h1>
            <p className="mt-2 text-zinc-500 text-lg">Track your academic progress in real-time.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main GPA Display & Form (Left Side) */}
          <div className="lg:col-span-1 space-y-8">
            {/* GPA Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
              <h2 className="text-emerald-100 font-bold uppercase tracking-widest text-sm mb-2 relative z-10">Cumulative GPA</h2>
              <div className="text-7xl font-black tracking-tighter mb-4 relative z-10 drop-shadow-sm">
                {gpaData.gpa}
              </div>
              <div className="flex items-center text-emerald-50 font-medium text-sm relative z-10 bg-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-md">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Total Credits: {gpaData.totalCredits}
              </div>
            </div>

            {/* Add Result Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Add New Subject</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Subject Name</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleInputChange} 
                    required
                    placeholder="e.g. Algorithms"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-zinc-900 bg-zinc-50 focus:bg-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Grade</label>
                    <select 
                      name="grade" 
                      value={formData.grade} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-zinc-50 focus:bg-white text-zinc-900 appearance-none cursor-pointer"
                    >
                      {Object.keys(GRADE_POINTS).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Credits</label>
                    <input 
                      type="number" 
                      name="credits" 
                      min="1" max="20"
                      value={formData.credits} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-zinc-900 bg-zinc-50 focus:bg-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-2 px-5 py-3.5 rounded-xl font-bold bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Add to Calculator
                </button>
              </form>
            </div>
          </div>

          {/* Results List (Right Side) */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-900">Academic History</h3>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                {results.length} Subjects
              </span>
            </div>
            
            <div className="flex-1 p-6">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10">
                  <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                  Loading your results...
                </div>
              ) : results.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-20 border-2 border-dashed border-zinc-100 rounded-2xl">
                  <svg className="w-16 h-16 mb-4 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <p className="font-medium text-lg text-zinc-500">No subjects added yet</p>
                  <p className="text-sm mt-1">Add your first subject to start calculating your GPA.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result) => (
                    <div 
                      key={result._id} 
                      className="group flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl shadow-sm">
                          {result.grade}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-lg leading-tight">{result.subject}</h4>
                          <p className="text-sm text-zinc-500 font-medium mt-0.5">{result.credits} Credits</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(result._id)}
                        className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove subject"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
