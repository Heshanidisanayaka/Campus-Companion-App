import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Welcome back, <span className="text-blue-600">Heshani!</span>
            </h1>
            <p className="mt-2 text-gray-500 text-lg">Here's what's happening with your studies today.</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-blue-100">
            H
          </div>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* GPA Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Current GPA</h2>
              <div className="p-2 bg-indigo-50 rounded-xl">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-5xl font-black text-gray-900 tracking-tight">3.75</div>
              <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                Top 10% of class
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 col-span-1 md:col-span-1 lg:col-span-2 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Upcoming Deadlines</h2>
              <div className="p-2 bg-red-50 rounded-xl">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4 flex-1 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-red-50 to-white rounded-2xl border border-red-100/50 group hover:border-red-200 transition-colors">
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold shadow-sm group-hover:scale-105 transition-transform">SE</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">SE Assignment 02</h3>
                    <p className="text-sm text-gray-500">Software Engineering</p>
                  </div>
                </div>
                <div className="sm:text-right flex items-center sm:block">
                  <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Tomorrow, 11:59 PM
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-white rounded-2xl border border-orange-100/50 group hover:border-orange-200 transition-colors">
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold shadow-sm group-hover:scale-105 transition-transform">DB</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">DBMS Project</h3>
                    <p className="text-sm text-gray-500">Database Management Systems</p>
                  </div>
                </div>
                <div className="sm:text-right flex items-center sm:block">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Friday, 5:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 shadow-lg text-white flex flex-col relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-sm font-bold text-blue-200 uppercase tracking-wider">Today's Classes</h2>
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="relative pl-6 border-l-2 border-blue-400">
                <div className="absolute w-4 h-4 bg-white rounded-full -left-[9px] top-1 shadow-sm ring-4 ring-blue-600"></div>
                <p className="text-xs font-bold text-blue-200 mb-1 uppercase tracking-wider">9:00 AM - 11:00 AM</p>
                <h3 className="font-bold text-xl mb-1">HCI</h3>
                <p className="text-sm text-blue-100 flex items-center opacity-90">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Room 402
                </p>
              </div>
              <div className="relative pl-6 border-l-2 border-white/20">
                <div className="absolute w-3 h-3 bg-white/40 rounded-full -left-[7px] top-1.5"></div>
                <p className="text-xs font-bold text-blue-200/70 mb-1 uppercase tracking-wider">1:00 PM - 3:00 PM</p>
                <h3 className="font-bold text-xl mb-1 text-white/90">DBMS</h3>
                <p className="text-sm text-blue-100/70 flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Main Lab
                </p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Latest Notices Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              Latest Notices
            </h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">Events</span>
                <span className="text-xs font-medium text-gray-400">2h ago</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">Annual Tech Symposium 2026</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Registration is now open for the upcoming Tech Symposium. Guest speakers from Google and Microsoft will be attending.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Academic</span>
                <span className="text-xs font-medium text-gray-400">1d ago</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">Mid-term Exam Schedules</h3>
              <p className="text-sm text-gray-500 leading-relaxed">The mid-term examination schedules for the Fall semester have been released. Please check the academic portal for your specific subjects.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Campus Life</span>
                <span className="text-xs font-medium text-gray-400">2d ago</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">Library Extended Hours</h3>
              <p className="text-sm text-gray-500 leading-relaxed">The main library will now be open until midnight on weekdays starting next week to support your study sessions.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
