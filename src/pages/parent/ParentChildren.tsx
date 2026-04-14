import React from 'react';
import { useGetParentChildrenQuery } from '../../features/user/userApi';
import SectionCard from '../../components/dashboard/SectionCard';
import { User, BookOpen, Clock, Activity, Calendar, Award } from 'lucide-react';
import Loading from '../../ui/Loading';

export const ParentChildren: React.FC = () => {
  const { data: response, isLoading, error } = useGetParentChildrenQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-3xl mt-8 mx-auto max-w-4xl border border-red-100">
        <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Children Data</h3>
        <p className="text-sm text-red-500">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }

  const childrenData = response?.data || [];

  return (
    <div className="animate-fadeIn pb-8 max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-blue-900 tracking-tight mb-2">My Children 👨‍👩‍👧‍👦</h1>
        <p className="text-gray-500 font-medium">View your registered children and their current enrollments.</p>
      </header>

      {childrenData.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-50">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <User className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">No Children Registered Yet</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">It looks like you haven't enrolled any children into our programs. Start enrolling to see their courses and phases here!</p>
          <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 transform">
            Enroll a Child Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {childrenData.map((child: any) => (
            <div key={child._id} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <SectionCard title={child.firstname + ' ' + child.lastname} className="h-full relative overflow-hidden backdrop-blur-sm bg-white/90 border border-white/40 shadow-xl shadow-blue-900/5">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl"></div>
                
                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                    <User className="w-10 h-10 relative z-10" />
                    <div className="absolute inset-0 bg-white/20 w-full h-full -rotate-45 translate-x-12 group-hover:translate-x-0 transition-transform duration-700"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">{child.firstname} {child.lastname}</h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                       <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-widest rounded-full">@{child.username}</span>
                       <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[11px] font-bold uppercase tracking-widest rounded-full">Grade {child.grade}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Active Enrollments</h4>
                  {child.enrollments && child.enrollments.length > 0 ? (
                    child.enrollments.map((enrollment: any, idx: number) => (
                      <div key={enrollment._id || idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group/card">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-500 group-hover/card:text-blue-600">
                               <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-gray-800">{enrollment.program?.title || 'Unknown Program'}</h5>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{enrollment.program?.description || 'No description available'}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                            enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                            enrollment.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {enrollment.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/60">
                           <div className="flex items-center gap-2">
                             <Award className="w-4 h-4 text-purple-400" />
                             <div className="flex flex-col">
                               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Phase</span>
                               <span className="text-xs font-bold text-gray-700">
                                 {enrollment.phase?.orderIndex ? `Phase ${enrollment.phase.orderIndex}` : 'N/A'}
                                 {enrollment.phase?.title ? ` - ${enrollment.phase.title}` : ''}
                               </span>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <Activity className="w-4 h-4 text-orange-400" />
                             <div className="flex flex-col">
                               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                               <span className="text-xs font-bold text-gray-700">0%</span>
                             </div>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
                      <Calendar className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm font-semibold text-gray-600">No active enrollments</p>
                      <p className="text-xs text-gray-400 mt-1">This child is not enrolled in any program yet.</p>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentChildren;
