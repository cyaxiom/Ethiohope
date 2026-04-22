import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, Calendar, Clock, Link as LinkIcon, CheckCircle2, AlertCircle, Trash2, Edit2, Activity, ShieldAlert } from 'lucide-react';
import { useSelector } from 'react-redux';
import { 
  useGetSessionsQuery, 
  useCreateSessionFromScheduleMutation, 
  useUpdateSessionMutation, 
  useDeleteSessionMutation 
} from '../../features/sessions/sessionApi';
import { useGetSchedulesQuery } from '../../features/batches/scheduleApi';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast } from 'sonner';

const formatTime12h = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);
  const m = minutes;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
};

export default function Sessions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    scheduleId: '',
    targetDate: '',
  });

  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'dashboard.admin') || hasPermission(permissions, 'session.read');
  const canCreate = hasPermission(permissions, 'session.create');
  const canUpdate = hasPermission(permissions, 'session.update');
  const canDelete = hasPermission(permissions, 'session.delete');

  // API Hooks
  const { data: sessionsData, isLoading: isSessionsLoading } = useGetSessionsQuery(undefined, { skip: !canRead });
  const { data: schedulesData, isLoading: isSchedulesLoading } = useGetSchedulesQuery({}, { skip: !canRead });
  
  const [createSession, { isLoading: isCreating }] = useCreateSessionFromScheduleMutation();
  const [updateSession, { isLoading: isUpdating }] = useUpdateSessionMutation();
  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to manage sessions.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { scheduleId, targetDate } = formData;
    if (!scheduleId || !targetDate) {
      toast.error('Please select a schedule and a target date.');
      return;
    }

    try {
      if (editingSessionId) {
        await updateSession({ id: editingSessionId, targetDate, scheduleId }).unwrap();
        toast.success('Session updated successfully!');
      } else {
        await createSession({ scheduleId, targetDate }).unwrap();
        toast.success('Session created successfully!');
      }
      setIsModalOpen(false);
      setEditingSessionId(null);
      setFormData({ scheduleId: '', targetDate: '' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save session');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await deleteSession(id).unwrap();
      toast.success('Session deleted successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete session');
    }
  };

  const sessions = sessionsData?.data || [];
  const schedules = schedulesData?.data || [];

  if (isSessionsLoading || isSchedulesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <Activity className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Video className="w-8 h-8" />
            </div>
            Live Sessions
          </h1>
          <p className="text-gray-500 font-medium mt-2">Create and manage upcoming live classes from your schedules.</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => {
              setEditingSessionId(null);
              setFormData({ scheduleId: '', targetDate: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Generate Session
          </button>
        )}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {sessions.map((session) => (
            <motion.div
              key={session._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    {canUpdate && (
                      <button 
                        onClick={() => {
                          const sId = typeof session.scheduleId === 'object' ? session.scheduleId._id : session.scheduleId;
                          setEditingSessionId(session._id);
                          setFormData({ 
                            scheduleId: sId || '', 
                            targetDate: session.startTime.split('T')[0] 
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button 
                        onClick={() => handleDelete(session._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                      {session.sessionType || 'Lecture'}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Live
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {session.title}
                  </h3>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    {new Date(session.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                    <Clock className="w-4 h-4 text-blue-400" />
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <a 
                    href={session.zoomLink || session.join_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 py-3 rounded-xl font-black text-xs transition-all active:scale-95"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Join Meeting
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sessions.length === 0 && !isSessionsLoading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <Video className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-800">No sessions yet</h3>
            <p className="text-gray-500 font-medium">Generate a session from a schedule to get started.</p>
          </div>
        )}
      </div>

      {/* Modal Section */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-800">
                    {editingSessionId ? 'Edit Session' : 'Generate New Session'}
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <AlertCircle className="w-6 h-6 text-gray-400 rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Select Schedule</label>
                    <select 
                      name="scheduleId" 
                      value={formData.scheduleId} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 appearance-none"
                    >
                      <option value="">Choose a schedule template...</option>
                      {schedules.map((s: any) => (
                        <option key={s._id} value={s._id}>
                          {s.sessionLabel} ({s.dayOfWeek} • {formatTime12h(s.startTime)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Target Date</label>
                    <input 
                      type="date" 
                      name="targetDate" 
                      value={formData.targetDate} 
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
                    />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isCreating || isUpdating}
                      className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {(isCreating || isUpdating) ? <Activity className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      {editingSessionId ? 'Save Changes' : 'Generate Session'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
