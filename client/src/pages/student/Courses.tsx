import React from 'react';
import { 
  BookOpen, Layers, ArrowRight, 
  Lock, AlertCircle, Search,
  Activity, ShieldAlert, CheckCircle, CreditCard
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { useGetStudentCoursesQuery } from '../../features/courses/courseApi';
import { useCreateCheckoutSessionMutation } from '../../features/payments/paymentApi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../lib/utils';
import { toast } from 'sonner';

const StudentCourses: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [payingId, setPayingId] = React.useState<string | null>(null);
  
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'course.read') || hasPermission(permissions, 'dashboard.student');

  const { data: coursesData, isLoading, isError } = useGetStudentCoursesQuery(undefined, { skip: !canRead });
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const handlePayNow = async (enrollmentId?: string) => {
    if (!enrollmentId) {
      toast.error('No enrollment found for payment');
      return;
    }
    try {
      setPayingId(enrollmentId);
      const res = await createCheckoutSession({ enrollmentIds: [enrollmentId] }).unwrap();
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error('Failed to generate payment link');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to start payment');
    } finally {
      setPayingId(null);
    }
  };

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
    (course.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto pb-12">
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
            {search
              ? `We couldn't find any courses matching "${search}".`
              : 'Enroll in a program to see your courses here. Unpaid enrollments appear locked until you complete payment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              payingId={payingId}
              onPayNow={handlePayNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CourseCardProps {
  course: any;
  payingId: string | null;
  onPayNow: (enrollmentId?: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, payingId, onPayNow }) => {
  const isInactive = !course.isActive;
  const isPaymentLocked = !!course.isLocked;
  const isLocked = isInactive || isPaymentLocked;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className={`
        bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 flex flex-col h-full
        ${isLocked ? 'hover:shadow-md' : 'hover:shadow-xl hover:shadow-blue-500/5'}
      `}>
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800">
          {course.thumbnail ? (
            <img 
              src={getImageUrl(course.thumbnail)} 
              alt={course.title} 
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLocked ? 'grayscale blur-[2px]' : ''}`}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isLocked ? 'grayscale' : ''}`}>
              <BookOpen className="w-16 h-16 text-white/40" />
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm border border-white/20">
              {course.program?.title}
            </span>
          </div>

          {isLocked && (
            <div className="absolute inset-0 bg-gray-900/45 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-xs font-black uppercase tracking-widest">
                  {isPaymentLocked ? 'Payment required' : 'Locked'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={`p-6 flex-1 flex flex-col ${isLocked ? 'opacity-90' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">
               {course.phase?.title}
             </span>
             <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               <Layers className="w-3 h-3" />
               {course.weeks?.length || 0} Weeks
             </div>
          </div>

          <h3 className={`text-xl font-black text-gray-800 mb-2 line-clamp-1 transition-colors ${!isLocked ? 'group-hover:text-blue-600' : ''}`}>
            {course.title}
          </h3>
          
          <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 flex-1">
            {course.description}
          </p>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                 isPaymentLocked ? 'bg-amber-50' : isInactive ? 'bg-gray-100' : 'bg-green-50'
               }`}>
                 {isPaymentLocked ? (
                   <Lock className="w-4 h-4 text-amber-500" />
                 ) : (
                   <CheckCircle className="w-4 h-4 text-green-500" />
                 )}
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   {isPaymentLocked ? 'Payment' : 'Progress'}
                 </span>
                 <span className="text-xs font-bold text-gray-700">
                   {isPaymentLocked ? 'Pending' : isInactive ? 'Coming soon' : 'Started'}
                 </span>
               </div>
            </div>

            {!isLocked && !course.isPlaceholder ? (
              <Link 
                to={`/student/courses/${course._id}`}
                className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Link>
            ) : isPaymentLocked ? (
              <button
                type="button"
                onClick={() => onPayNow(course.enrollmentId)}
                disabled={payingId === course.enrollmentId}
                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-2xl font-black text-xs hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 disabled:opacity-60"
              >
                <CreditCard className="w-4 h-4" />
                {payingId === course.enrollmentId ? '…' : 'Pay Now'}
              </button>
            ) : course.isPlaceholder ? (
              <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                Curriculum soon
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                Coming Soon
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCourses;
