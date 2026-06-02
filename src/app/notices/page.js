'use client';

import React, { useState, useEffect, useCallback } from 'react';

const CATEGORIES = ['All', 'Academic', 'Exam', 'Library', 'Events', 'General'];

const CATEGORY_STYLES = {
  Academic: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  Exam: { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  Library: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  Events: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  General: { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
};

const ICONS = {
  Academic: '🎓',
  Exam: '📝',
  Library: '📚',
  Events: '🎉',
  General: '📢',
};

const emptyForm = {
  title: '',
  content: '',
  category: 'General',
  postedBy: 'Admin',
};

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [expandedId, setExpandedId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (search) params.set('search', search);

      const res = await fetch(`/api/notices?${params.toString()}`);
      const data = await res.json();
      if (data.success) setNotices(data.data);
    } catch (err) {
      console.error('Failed to fetch notices', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchNotices(), 300);
    return () => clearTimeout(debounce);
  }, [fetchNotices]);

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      postedBy: notice.postedBy || 'Admin',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingNotice ? `/api/notices/${editingNotice._id}` : '/api/notices';
      const method = editingNotice ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        closeModal();
        fetchNotices();
      } else {
        alert(data.error || 'Failed to save notice.');
      }
    } catch (err) {
      alert('An error occurred while saving.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchNotices();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-zinc-900 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 space-y-8">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              University{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600">
                Notices
              </span>
            </h1>
            <p className="mt-2 text-zinc-500 text-base">
              Stay updated with the latest announcements from your university.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setIsAdmin((v) => !v)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isAdmin
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-indigo-300'
              }`}
            >
              {isAdmin ? '🔐 Admin Mode' : '👁 View Mode'}
            </button>
            {isAdmin && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-5 py-2.5 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-700 transition-all hover:scale-105 active:scale-95 shadow-md text-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Post Notice
              </button>
            )}
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-zinc-900 transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {cat !== 'All' && <span className="mr-1">{ICONS[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="text-sm text-zinc-500 font-medium">
          {loading ? 'Loading...' : `${notices.length} notice${notices.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400">
            <span className="text-5xl block mb-3">📭</span>
            <p className="font-bold text-lg text-zinc-500">No notices found</p>
            <p className="text-sm mt-1">Try changing your filters or search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => {
              const style = CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General;
              const isExpanded = expandedId === notice._id;
              return (
                <div
                  key={notice._id}
                  className="group bg-white rounded-2xl border border-zinc-200 hover:border-indigo-300 hover:shadow-lg transition-all overflow-hidden"
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : notice._id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center text-2xl`}>
                        {ICONS[notice.category] || '📢'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                            {notice.category}
                          </span>
                          <span className="text-xs text-zinc-400">{formatDate(notice.createdAt)} · {formatTime(notice.createdAt)}</span>
                          {isExpanded && (
                            <span className="text-xs text-zinc-400">Posted by {notice.postedBy}</span>
                          )}
                        </div>
                        <h2 className="text-base font-bold text-zinc-900 leading-snug">{notice.title}</h2>
                        {!isExpanded && (
                          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{notice.content}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(notice); }}
                              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(notice._id); }}
                              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                        <svg
                          className={`w-5 h-5 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0">
                      <div className={`h-px ${style.bg} mb-4`} />
                      <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h2 className="text-xl font-bold text-zinc-900">
                {editingNotice ? 'Edit Notice' : 'Post New Notice'}
              </h2>
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-zinc-700 p-2 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Notice Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g. Semester Registration Open"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-zinc-900 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-zinc-900 transition-all"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Posted By</label>
                  <input
                    type="text"
                    value={formData.postedBy}
                    onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
                    placeholder="Admin"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-zinc-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={5}
                  placeholder="Write the full notice content here..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-zinc-900 resize-none transition-all"
                />
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
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
                  {editingNotice ? 'Update Notice' : 'Post Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
