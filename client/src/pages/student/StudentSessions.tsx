import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Calendar, Clock, ExternalLink, AlertCircle, ShieldAlert } from 'lucide-react';
import { useSelector } from 'react-redux';

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

export default function StudentSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useSelector((state: any) => state.auth);

  const fetchStudentSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2707/api/v1'}/sessions/student`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setSessions(result.data);
      } else {
        setError(result.message || "Failed to load sessions");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentSessions();
  }, []);

  const handleJoin = async (sessionId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2707/api/v1'}/sessions/${sessionId}/join`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success && result.data.url) {
        window.open(result.data.url, '_blank', 'noopener,noreferrer');
      } else {
        alert(result.message || "Could not retrieve join link. Make sure your enrollment is active.");
      }
    } catch (err) {
      alert("Error connecting to session server.");
    }
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[60vh]">
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
       </div>
     );
  }

  // Countdown Logic
  const CountdownTimer = ({ startTime, onComplete }: { startTime: string, onComplete: () => void }) => {
    const [timeLeft, setTimeLeft] = useState<any>(null);

    useEffect(() => {
      const calculateTimeLeft = () => {
        const difference = +new Date(startTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            total: difference
          };
        } else {
          onComplete();
          return null;
        }
        return timeLeft;
      };

      setTimeLeft(calculateTimeLeft());
      const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        if (!remaining) clearInterval(timer);
      }, 1000);

      return () => clearInterval(timer);
    }, [startTime]);

    if (!timeLeft) return null;

    return (
      <div className="grid grid-cols-4 gap-2 text-center">
        {Object.entries(timeLeft).filter(([key]) => key !== 'total').map(([unit, value]: any) => (
          <div key={unit} className="bg-gray-50 rounded-xl p-2 border border-gray-100">
            <p className="text-sm font-black text-blue-600 leading-none">{value}</p>
            <p className="text-[8px] uppercase font-bold text-gray-400 mt-1">{unit}</p>
          </div>
        ))}
      </div>
    );
  };

  const SessionCard = ({ session, i }: { session: any, i: number }) => {
    const now = new Date();
    const startTimeLocal = new Date(session.startTime);
    const endTimeLocal = new Date(session.endTime);

    const [isAvailable, setIsAvailable] = useState(now >= startTimeLocal);
    const isNow = now >= startTimeLocal && now <= endTimeLocal;
    const isEnded = now > endTimeLocal;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        key={session._id} 
        className={`bg-white rounded-[40px] p-8 border ${isNow ? 'border-blue-400 ring-4 ring-blue-50' : isEnded ? 'border-gray-200 grayscale-[0.5]' : 'border-gray-100'} shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full relative overflow-hidden group transition-all`}
      >
        {isNow && (
          <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
            Live Now
          </div>
        )}
        
        {isEnded && (
          <div className="absolute top-0 right-0 px-6 py-2 bg-gray-400 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
            Ended
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <span className={`px-4 py-1.5 ${isEnded ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'} rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2`}>
            <span className={`w-2 h-2 rounded-full ${isNow ? 'bg-blue-600 animate-pulse' : isEnded ? 'bg-gray-400' : 'bg-gray-300'}`} />
            {session.sessionType}
          </span>
          <span className={`${isEnded ? 'bg-gray-50 text-gray-400' : 'bg-green-50 text-green-600'} px-3 py-1 rounded-xl text-[10px] font-black`}>
            {isEnded ? 'CLOSED' : 'CONFIRMED'}
          </span>
        </div>
        
        <h3 className={`text-2xl font-black ${isEnded ? 'text-gray-400' : 'text-gray-900'} mb-4 line-clamp-2 leading-tight ${!isEnded && 'group-hover:text-blue-600'} transition-colors`}>
          {session.title}
        </h3>
        
        <div className="space-y-4 mb-8 flex-1">
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
            <div className={`w-12 h-12 rounded-2xl ${isEnded ? 'bg-gray-50' : 'bg-orange-50'} flex items-center justify-center`}>
              <Calendar className={`w-6 h-6 ${isEnded ? 'text-gray-300' : 'text-orange-500'}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-300 tracking-wider font-black">Scheduled Date</p>
              <span className={isEnded ? 'text-gray-400' : 'text-gray-600'}>
                {new Date(session.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
            <div className={`w-12 h-12 rounded-2xl ${isEnded ? 'bg-gray-50' : 'bg-blue-50'} flex items-center justify-center`}>
              <Clock className={`w-6 h-6 ${isEnded ? 'text-gray-300' : 'text-blue-500'}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-300 tracking-wider font-black">Session Period</p>
              <span className={isEnded ? 'text-gray-400' : 'text-gray-600'}>
                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                <span className="text-gray-300 mx-2">-</span>
                {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {isEnded ? (
           <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 text-center">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Recording soon available</p>
           </div>
        ) : !isAvailable ? (
          <div className="space-y-4">
            <p className="text-[10px] uppercase text-center font-black text-gray-400 tracking-[0.2em]">Session Starts In</p>
            <CountdownTimer startTime={session.startTime} onComplete={() => setIsAvailable(true)} />
            <button 
              disabled
              className="w-full bg-gray-100 text-gray-400 py-5 rounded-3xl font-black tracking-wide flex items-center justify-center gap-3 cursor-not-allowed border border-gray-200"
            >
              <Clock className="w-5 h-5" />
              Waiting for start...
            </button>
          </div>
        ) : (
          <button 
            onClick={() => handleJoin(session._id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-black tracking-wide shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 group/btn"
          >
            <Video className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            Join Live Class
            <ExternalLink className="w-4 h-4 opacity-50" />
          </button>
        )}
      </motion.div>
    );
  };

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
         <motion.div 
           animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
           transition={{ repeat: Infinity, duration: 2 }} 
           className="w-16 h-16 border-8 border-blue-600 border-t-transparent rounded-full shadow-2xl shadow-blue-200" 
         />
         <p className="text-gray-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing with Zoom...</p>
       </div>
     );
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-12 bg-gray-50/30 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
             Student Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            Live Learning
          </h1>
          <p className="text-gray-500 font-bold max-w-xl">
            Experience interactive education with expert instructors. Access your discussion groups and lectures from here.
          </p>
        </div>

        {sessions.length > 0 && (
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Video className="w-8 h-8 text-blue-600" />
             </div>
             <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Sessions</p>
                <p className="text-3xl font-black text-gray-900">{sessions.length}</p>
             </div>
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 border-2 border-red-100 text-red-700 p-8 rounded-[40px] flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <ShieldAlert className="w-16 h-16 flex-shrink-0 text-red-400" />
          <div>
            <h3 className="text-2xl font-black">Oops! Access Restricted</h3>
            <p className="text-lg font-medium opacity-80 mt-1">{error}</p>
            <button onClick={fetchStudentSessions} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Try Reconnecting</button>
          </div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[48px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
            <Video className="w-12 h-12 text-gray-200" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">Workspace Empty</h3>
          <p className="text-gray-400 font-bold text-center max-w-md px-6">Your batch currently has no active live sessions. They will appear here automatically when scheduled by your instructor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session, i) => (
            <SessionCard key={session._id} session={session} i={i} />
          ))}
        </div>
      )}
      
      {/* Batch Info Note */}
      <div className="bg-blue-900 p-8 rounded-[40px] shadow-2xl shadow-blue-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -mr-32 -mt-32 opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center flex-shrink-0 border border-white/20">
            <ShieldAlert className="w-8 h-8 text-blue-200" />
          </div>
          <div className="space-y-2">
            <h4 className="text-white text-xl font-black">Your Learning Group</h4>
            <p className="text-blue-100 font-medium leading-relaxed max-w-3xl">
              You are currently attending sessions with <strong>{sessions[0]?.batchId?.batchName || 'Your Assigned Batch'}</strong>. 
              Please ensure you join on time to get the most out of your interactive learning experience.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
