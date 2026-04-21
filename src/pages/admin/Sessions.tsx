import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, Calendar, Clock, Link as LinkIcon, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const formatTime12h = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);
  const m = minutes;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  return `${h}:${m} ${ampm}`;
};

// A beautifully styled Sessions management component for the admin panel.
export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: any) => state.auth);
  
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  
  // Create Session State
  const [formData, setFormData] = useState({
    scheduleId: '',
    targetDate: '',
  });

  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2707/api/v1'}/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setSessions(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch sessions");
    }
  };

   const fetchMetadata = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2707/api/v1'}/admin/schedules`, { headers });
      const schedData = await res.json();
      
      if (schedData.success) {
        setSchedules(schedData.data);
      }
    } catch (err) {
      console.error("Failed to fetch references");
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchMetadata();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    try {
      const { scheduleId, targetDate } = formData;
      if (!scheduleId || !targetDate) {
        setNotification({ type: 'error', message: 'Please select a schedule and a target date.' });
        setLoading(false);
        return;
      }

      const url = editingSessionId 
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2707/api/v1'}/sessions/${editingSessionId}`
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2707/api/v1'}/sessions/schedule/${scheduleId}`;
      
      const method = editingSessionId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetDate, scheduleId })
      });
      const result = await res.json();
      
      if (result.success) {
        setNotification({ type: 'success', message: `Session successfully ${editingSessionId ? 'updated' : 'created'}!` });
        setIsModalOpen(false);
        fetchSessions();
      } else {
        setNotification({ type: 'error', message: result.message || 'Failed to process session.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error encountered' });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSessionId(null);
    setFormData({ scheduleId: '', targetDate: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (session: any) => {
    setEditingSessionId(session._id);
    const sId = typeof session.scheduleId === 'object' ? session.scheduleId._id : session.scheduleId;
    
    // Extract date in YYYY-MM-DD format
    const date = new Date(session.startTime).toISOString().split('T')[0];
    
    setFormData({
      scheduleId: sId || '',
      targetDate: date
    });
    setIsModalOpen(true);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2707/api/v1'}/sessions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setNotification({ type: 'success', message: 'Session deleted and Zoom meeting cancelled.' });
        setDeletingId(null);
        fetchSessions();
      } else {
        setNotification({ type: 'error', message: result.message || 'Failed to delete.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8 bg-gray-50/30 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-600" />
            Live Sessions
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage and Reschedule your automated Zoom sessions.</p>
        </div>
        
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold tracking-wide shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Session
        </button>
      </div>

      {/* Notifications */}
      <AnimatePresence mode="wait">
        {notification && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 font-bold ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sessions.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 border-dashed">
            <Video className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No sessions currently scheduled.</h3>
            <p className="text-gray-400 text-sm mt-1">Click "Create Session" to get started.</p>
          </div>
        ) : (
          sessions.map((session, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={session._id} 
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group"
            >
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {session.sessionType}
                  </span>
                  <span className="text-gray-400 bg-gray-50 px-2 py-1 rounded text-[10px] font-bold font-mono">
                    PROG: {(session.programId as any)?.title || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <span className={`${new Date() > new Date(session.endTime) ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5`}>
                     <span className={`w-1.5 h-1.5 rounded-full ${new Date() > new Date(session.endTime) ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                     BATCH: {(session.batchId as any)?.batchName || 'N/A'}
                   </span>
                   {new Date() > new Date(session.endTime) && (
                     <span className="text-[9px] font-bold text-red-400 uppercase tracking-tighter italic">Needs Reschedule</span>
                   )}
                </div>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                {session.title}
              </h3>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {new Date(session.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                  <Clock className="w-4 h-4 text-orange-500" />
                  {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  <span className="text-gray-300 mx-1">-</span>
                  {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between gap-2">
                 <button 
                   onClick={() => openEditModal(session)}
                   className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2"
                 >
                    <Plus className="w-3.5 h-3.5" />
                    Reschedule Session
                 </button>
                 <a 
                   href={session.zoomLink} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="p-2.5 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"
                   title="Open Zoom Start Link"
                 >
                   <LinkIcon className="w-4 h-4" />
                 </a>
                 <button 
                   onClick={() => setDeletingId(session._id)}
                   className="p-2.5 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-xl transition-all"
                   title="Delete Session"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Creation/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-2xl font-black text-gray-900">
                  {editingSessionId ? 'Reschedule Session' : 'Configure Live Session'}
                </h2>
                <p className="text-gray-500 text-sm font-medium mt-1">
                  {editingSessionId ? 'Update the date of this specific session.' : 'Bind an automated Zoom Meeting to a schedule template.'}
                </p>
              </div>

              <div className="p-8 overflow-y-auto flex-1 text-left">
                <form id="sessionForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Schedule Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                      <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">Schedule Template</label>
                      <select 
                        required 
                        name="scheduleId" 
                        value={formData.scheduleId} 
                        onChange={handleChange} 
                        disabled={!!editingSessionId}
                        className="w-full bg-gray-50 border-transparent font-medium focus:bg-white focus:border-blue-500 focus:ring-0 p-4 rounded-2xl transition-all disabled:opacity-50"
                      >
                        <option value="">-- Choose Schedule --</option>
                        {schedules.map(s => (
                          <option key={s._id} value={s._id}>
                             {s.sessionLabel} ({s.dayOfWeek} {formatTime12h(s.startTime)} - {formatTime12h(s.endTime)}) (Batch: {s.batch?.batchName || '...'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">Target Date</label>
                      <input 
                        required 
                        type="date" 
                        name="targetDate" 
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.targetDate} 
                        onChange={handleChange} 
                        className="w-full bg-gray-50 border-transparent font-medium focus:bg-white focus:border-blue-500 focus:ring-0 p-4 rounded-2xl transition-all" 
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <div className="flex gap-4">
                       <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                       <div className="text-sm text-blue-900 font-medium leading-relaxed">
                          {editingSessionId 
                            ? "Rescheduling will update the join date for all enrolled students. The Zoom meeting details will be preserved but the time will be updated."
                            : "By choosing a template, the system will automatically pull the Program, Batch, and Phase. It will also generate a unique Zoom meeting for the selected date."
                          }
                       </div>
                    </div>
                  </div>

                </form>
              </div>

              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-[32px]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" form="sessionForm" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black tracking-wide rounded-xl shadow-lg shadow-blue-200 transition-all">
                  {loading ? 'Processing...' : editingSessionId ? 'Update Session' : 'Publish Session'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-900/10 backdrop-blur-md"
              onClick={() => setDeletingId(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 p-10 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Delete Session?</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                This action is irreversible. It will remove the record and <span className="text-red-600 font-bold">cancel the Zoom meeting</span> for all participants.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(deletingId)}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black tracking-wide shadow-xl shadow-red-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   {loading ? 'Deleting...' : 'Yes, Delete Session'}
                </button>
                <button 
                  onClick={() => setDeletingId(null)}
                  className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                   Keep Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
