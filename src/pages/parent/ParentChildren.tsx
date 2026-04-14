import React, { useState, useEffect } from 'react';
import { useGetParentChildrenQuery } from '../../features/user/userApi';
import SectionCard from '../../components/dashboard/SectionCard';
import { User, BookOpen, Clock, Activity, Calendar, Award, Search, Filter, ChevronRight, X } from 'lucide-react';
import Loading from '../../ui/Loading';
import ChildDetailModal from '../../components/Enrollment/ChildDetailModal';
import { motion, AnimatePresence } from 'framer-motion';

export const ParentChildren: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [progressCategory, setProgressCategory] = useState<string>('');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: response, isLoading, error, refetch } = useGetParentChildrenQuery({
    search: debouncedSearch,
    progressCategory: progressCategory
  });

  const childrenData = response?.data || [];

  const handleOpenDetails = (id: string) => {
    setSelectedChildId(id);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setProgressCategory('');
  };

  if (isLoading && !debouncedSearch && !progressCategory) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-8 max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tight mb-3">My Children 👨‍👩‍👧‍👦</h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl leading-relaxed">
            Monitor your children's educational journey, track their progress, and view their latest enrollments all in one place.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm border border-blue-100 flex items-center gap-2">
            <User className="w-4 h-4" />
            {childrenData.length} Students
          </div>
        </div>
      </header>

      {/* Search and Filters Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50/50 mb-10 flex flex-col lg:flex-row gap-6 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full text-gray-400 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-gray-400 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Progress:</span>
          </div>
          
          {[
            { id: '', label: 'All' },
            { id: '0', label: '0% Progress' },
            { id: 'lessThan50', label: '< 50%' },
            { id: 'above50', label: '> 50%' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setProgressCategory(cat.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                progressCategory === cat.id 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105' 
                  : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:bg-blue-50/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="p-12 text-center bg-red-50 rounded-[2.5rem] border border-red-100 shadow-lg shadow-red-900/5">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <Activity className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-red-900 mb-3 tracking-tight">System Connection Error</h3>
          <p className="text-red-700 mb-8 max-w-md mx-auto leading-relaxed">
            We're having trouble reaching our servers. This could be a temporary issue.
          </p>
          <button 
            onClick={() => refetch()}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            Try Reconnecting
          </button>
        </div>
      ) : childrenData.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-[3rem] border border-blue-50 shadow-xl shadow-blue-900/5 flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 shadow-inner">
             <User className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">
            {searchTerm || progressCategory ? "No matching students found" : "Your student list is empty"}
          </h3>
          <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed text-lg">
            {searchTerm || progressCategory 
              ? "Try adjusting your search terms or filters to find what you're looking for." 
              : "Start your children's journey with EthioHope by enrolling them in our world-class programs."}
          </p>
          
          {(searchTerm || progressCategory) ? (
            <button 
              onClick={handleClearFilters}
              className="px-8 py-4 bg-gray-800 text-white rounded-[1.5rem] font-bold shadow-xl hover:bg-gray-900 transition-all active:scale-95 flex items-center gap-3"
            >
              Clear All Filters
            </button>
          ) : (
            <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-200 transition-all active:scale-95 transform">
              Enroll Your First Child
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {childrenData.map((child: any) => (
            <motion.div 
              key={child._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group cursor-pointer"
              onClick={() => handleOpenDetails(child._id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              
              <SectionCard title={child.firstname + ' ' + child.lastname} className="h-full relative overflow-hidden backdrop-blur-sm bg-white/95 border border-white/60 shadow-2xl shadow-blue-900/10 hover:shadow-blue-900/20 transition-all duration-500 group-hover:-translate-y-2 rounded-[2.5rem]">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                
                {/* Header Section */}
                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-200 relative overflow-hidden group-hover:scale-105 transition-transform">
                    <User className="w-12 h-12 relative z-10" />
                    <div className="absolute inset-0 bg-white/20 w-full h-full -rotate-45 translate-x-12 group-hover:translate-x-0 transition-transform duration-1000"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-black text-gray-800 tracking-tight">{child.firstname} {child.lastname}</h2>
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                       <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">@{child.username}</span>
                       <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-purple-100">Grade {child.grade}</span>
                    </div>
                  </div>
                </div>

                {/* Overall Stats Section */}
                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-blue-600">{child.stats?.avgProgress || 0}%</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg Progress</span>
                  </div>
                  <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-purple-600">{child.stats?.totalCourses || 0}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Tracks</span>
                  </div>
                </div>

                {/* Enrollment Section */}
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Academic Track</h4>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                      {child.enrollments?.length || 0} Enrollments
                    </span>
                  </div>

                  {child.enrollments && child.enrollments.length > 0 ? (
                    <div className="space-y-4">
                      {child.enrollments.map((enrollment: any, idx: number) => (
                        <div key={enrollment._id || idx} className="p-5 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 hover:border-blue-200 hover:bg-white transition-all group/card shadow-sm hover:shadow-md">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-blue-500 group-hover/card:scale-110 transition-transform">
                                 <BookOpen className="w-6 h-6" />
                              </div>
                              <div>
                                <h5 className="text-base font-black text-gray-800 leading-tight">{enrollment.program?.title || 'Unknown Program'}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5 text-purple-400" />
                                    {enrollment.phase?.orderIndex ? `Phase ${enrollment.phase.orderIndex}` : 'Phase 1'}
                                    {enrollment.phase?.title ? ` - ${enrollment.phase.title}` : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${
                              enrollment.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-100' : 
                              enrollment.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                              'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {enrollment.status}
                            </span>
                          </div>

                          {/* Progress Indicator */}
                          <div className="space-y-2 mt-6">
                            <div className="flex justify-between items-center px-1">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-orange-400" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                              </div>
                              <span className="text-sm font-black text-blue-600">{enrollment.progress || 0}%</span>
                            </div>
                            <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-gray-100 p-0.5">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                style={{ width: `${enrollment.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 rounded-[2rem] bg-gray-50 border border-dashed border-gray-300 text-center flex flex-col items-center justify-center group/empty">
                      <Calendar className="w-10 h-10 text-gray-300 mb-3 group-hover/empty:scale-110 transition-transform" />
                      <p className="text-base font-bold text-gray-600">No active enrollments</p>
                      <p className="text-xs text-gray-400 mt-2 max-w-[200px]">This child hasn't started their learning journey yet.</p>
                    </div>
                  )}
                </div>
              </SectionCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ChildDetailModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            childId={selectedChildId} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParentChildren;
