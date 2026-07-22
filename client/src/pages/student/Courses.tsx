import React from 'react';
import { 
  BookOpen, Layers, Clock, ArrowRight, 
  Lock, AlertCircle, Search, Filter,
  Activity, ShieldAlert, CheckCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { useGetStudentCoursesQuery } from '../../features/courses/courseApi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StudentCourses: React.FC = () => {
  const [search, setSearch] = React.useState('');
  
  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'course.read') || hasPermission(permissions, 'dashboard.student');

  // Queries
  const { data: coursesData, isLoading, isError } = useGetStudentCoursesQuery(undefined, { skip: !canRead });

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view your courses.</p>
      </div>
    );
  }

  const courses = coursesData?.data || [];

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">My Courses</h1>
          <p className="text-gray-500 font-medium mt-1">Continue your learning journey and track your progress.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your courses..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
      </header>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Activity className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading your courses...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-800">Failed to load courses</h3>
          <p className="text-red-600">Please try refreshing the page or contact support.</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 rounded-[2.5rem] text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">No courses found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {search ? `We couldn't find any courses matching "${search}".` : "Your courses will appear here as soon as they are assigned to your program. Stay tuned!"}
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CourseCardProps {
  course: any;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const isInactive = !course.isActive;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className={`
        bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 flex flex-col h-full
        ${isInactive ? 'hover:shadow-none' : 'hover:shadow-xl hover:shadow-blue-500/5'}
      `}>
        {/* Thumbnail Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isInactive ? 'grayscale blur-[2px]' : ''}`}
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm border border-white/20">
              {course.program?.title}
            </span>
          </div>

          {/* Inactive Overlay */}
          {isInactive && (
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center p-6 text-center transition-all duration-500 group-hover:bg-gray-900/50">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 transform transition-transform duration-500 group-hover:scale-110">
                <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-xs font-black uppercase tracking-widest">Locked</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`p-6 flex-1 flex flex-col ${isInactive ? 'opacity-50 blur-[0.5px]' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">
               {course.phase?.title}
             </span>
             <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               <Layers className="w-3 h-3" />
               {course.weeks?.length || 0} Weeks
             </div>
          </div>

          <h3 className="text-xl font-black text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          
          <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 flex-1">
            {course.description}
          </p>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                 <CheckCircle className="w-4 h-4 text-green-500" />
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                 <span className="text-xs font-bold text-gray-700">Started</span>
               </div>
            </div>

            {!isInactive ? (
              <Link 
                to={`/student/courses/${course._id}`}
                className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                Coming Soon
              </div>
            )}
          </div>
        </div>

        {/* Hover Tooltip for Inactive */}
        {isInactive && (
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gray-900/90 backdrop-blur-md">
            <p className="text-white text-sm font-black text-center flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              The course will be open soon
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentCourses;
