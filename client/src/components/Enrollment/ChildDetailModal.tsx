import React from 'react';
import { X, User, BookOpen, Award, Activity, Calendar, MapPin, GraduationCap, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetChildDetailsQuery } from '../../features/user/userApi';
import Loading from '../../ui/Loading';
import { getImageUrl } from '../../lib/utils';
import EditScheduleModal from './EditScheduleModal';
import ChildCredentialsCard from './ChildCredentialsCard';
import { timeZoneLabel, ETHIOPIA_TZ } from '../../lib/timezone';

interface ChildDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string | null;
}

const formatTime12h = (time: string) => {
  if (!time) return '';
  const parts = time.split(':');
  if (parts.length < 2) return time;
  const [hours, minutes] = parts;
  let h = parseInt(hours, 10);
  if (isNaN(h)) return time;
  const m = minutes;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
};

const ChildDetailModal: React.FC<ChildDetailModalProps> = ({ isOpen, onClose, childId }) => {
  const { data: response, isLoading, error } = useGetChildDetailsQuery(childId!, { skip: !childId });
  const [selectedEnrollmentForEdit, setSelectedEnrollmentForEdit] = React.useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleEditSchedule = (enrollment: any) => {
    setSelectedEnrollmentForEdit(enrollment);
    setIsEditModalOpen(true);
  };

  if (!isOpen) return null;

  const child = response?.data;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-t-2xl sm:rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-20 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loading />
            <p className="text-blue-600 font-bold animate-pulse">Fetching Student Records...</p>
          </div>
        ) : error || !child ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <X className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Details</h3>
            <p className="text-gray-500 mb-8">We couldn't retrieve the student information at this time.</p>
            <button onClick={onClose} className="px-8 py-3 bg-gray-800 text-white rounded-2xl font-bold">Close</button>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header / Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 md:p-12 text-white overflow-hidden header-gradient">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl no-print"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-24 -mb-24 blur-2xl no-print"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl relative group">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-400 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg no-print">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{child.firstname} {child.lastname}</h2>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-[11px] font-black uppercase tracking-[0.2em] rounded-full border border-white/20">
                      @{child.username}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-blue-100 font-bold">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      <span>Grade {child.grade}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300/50 hidden md:block" />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{child.isUSA ? 'United States' : child.country || 'International'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 custom-scrollbar bg-gray-50/50 pb-[max(2rem,env(safe-area-inset-bottom))]">
              <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10 pb-8">
                
                {/* Academic Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Overall Progress', value: `${child.stats?.avgProgress || 0}%`, icon: Activity, color: 'blue' },
                    { label: 'Total Courses', value: child.stats?.totalCourses || 0, icon: BookOpen, color: 'purple' },
                    { label: 'Achievements', value: child.stats?.achievements || 0, icon: Award, color: 'orange' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-blue-200 transition-all card">
                      <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500 mb-3 group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-gray-800">{stat.value}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Detailed Enrollments Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                      <div className="w-2 h-8 bg-blue-600 rounded-full" />
                      Active Enrollments
                    </h3>
                  </div>

                  {child.enrollments && child.enrollments.length > 0 ? (
                    <div className="space-y-4">
                      {child.enrollments.map((enrollment: any) => (
                        <div key={enrollment._id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all card">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Course Image or Placeholder */}
                            <div className="w-full md:w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {enrollment.program?.image ? (
                                <img src={getImageUrl(enrollment.program.image)} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <BookOpen className="w-12 h-12 text-gray-300" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <h4 className="text-lg font-black text-gray-800">{enrollment.program?.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-100">
                                      {enrollment.phase?.orderIndex ? `Phase ${enrollment.phase.orderIndex}` : 'Phase 1'}
                                      {enrollment.phase?.title ? ` - ${enrollment.phase.title}` : ''}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-gray-200">
                                      {enrollment.batch?.batchName || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-200' :
                                    'bg-orange-100 text-orange-700 border border-orange-200'
                                  }`}>
                                    {enrollment.status}
                                  </span>
                                </div>
                              </div>

                              {/* Progress Section */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Progress</span>
                                  <span className="text-xs font-black text-blue-600">{enrollment.progress || 0}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${enrollment.progress || 0}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-6 pt-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Payment: {enrollment.paymentStatus}
                                  </span>
                                </div>
                              </div>

                              {/* Selected Schedules */}
                              {enrollment.selectedSchedules && (
                                <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selected Sessions</span>
                                    <button 
                                      onClick={() => handleEditSchedule(enrollment)}
                                      className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 transition-all hover:scale-105"
                                    >
                                      Edit Schedule
                                    </button>
                                  </div>
                                  {enrollment.selectedSchedules?.[0] && (
                                    <p className="text-[10px] text-emerald-700 font-semibold">
                                      Times in{' '}
                                      {timeZoneLabel(
                                        enrollment.selectedSchedules.find((s: any) => s?.timeZone)?.timeZone ||
                                          enrollment.selectedSchedules[0]?.timeZone ||
                                          ETHIOPIA_TZ
                                      )}
                                    </p>
                                  )}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {enrollment.selectedSchedules.map((s: any) => s && (
                                      <div key={s._id || s} className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span className="text-gray-400 font-black uppercase tracking-tight text-[9px] min-w-[70px]">{s.sessionLabel}:</span>
                                        <span className="text-blue-600">{s.dayOfWeek}</span>
                                        <span className="text-gray-400">•</span>
                                        <span>{formatTime12h(s.startTime)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center card">
                       <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
                       <p className="text-gray-500 font-bold">No active courses found for this student.</p>
                    </div>
                  )}
                </div>

                {/* Edit Schedule Modal */}
                <AnimatePresence>
                  {isEditModalOpen && (
                    <EditScheduleModal 
                      isOpen={isEditModalOpen}
                      onClose={() => setIsEditModalOpen(false)}
                      enrollment={selectedEnrollmentForEdit}
                    />
                  )}
                </AnimatePresence>

                {/* Quick Info / Personal Details */}
                <div className="bg-blue-900 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden header-gradient">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl no-print"></div>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
                    <div className="w-2 h-6 bg-blue-400 rounded-full" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {[
                      { label: 'Full Name', value: `${child.firstname} ${child.lastname}` },
                      { label: 'Birthdate', value: new Date(child.birthdate).toLocaleDateString() },
                      { label: 'Gender', value: child.gender.toUpperCase() },
                      { label: 'Current Grade', value: `Grade ${child.grade}` },
                      { label: 'Location', value: child.isUSA ? 'United States' : `${child.region || ''}, ${child.country || ''}` },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">{item.label}</span>
                        <p className="text-base font-bold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <ChildCredentialsCard
                  childId={child._id}
                  username={child.username}
                  plainPin={child.plainPin}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChildDetailModal;
