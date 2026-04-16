import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, BookOpen, Video, FileText, 
  HelpCircle, ChevronDown, ChevronRight, PlayCircle,
  CheckCircle, Clock, Award, Layout, 
  ArrowLeft, Activity, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetStudentCourseByIdQuery } from '../../features/courses/courseApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'course.read') || hasPermission(permissions, 'dashboard.student');

  const { data: courseData, isLoading, isError } = useGetStudentCourseByIdQuery(id || '', { skip: !canRead });

  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({ "0": true });

  const toggleWeek = (index: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view this course.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <Activity className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading curriculum...</p>
      </div>
    );
  }

  if (isError || !courseData) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Course Not Found</h2>
        <p className="text-gray-500 mb-8">The course you are looking for might have been moved or you don't have access to it.</p>
        <Link to="/student/courses" className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const course = courseData.data;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fadeIn">
      {/* Back Button */}
      <Link to="/student/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors mb-8 group">
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Course Info & Weeks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {course.program?.title}
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {course.phase?.title}
                </span>
              </div>
              
              <h1 className="text-3xl font-black text-gray-800 mb-4">{course.title}</h1>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                {course.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Duration</span>
                  <span className="text-sm font-bold text-gray-700">{course.weeks?.length || 0} Weeks</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lessons</span>
                  <span className="text-sm font-bold text-gray-700">
                    {course.weeks?.reduce((acc, week) => acc + (week.lessons?.length || 0), 0)} Total
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Exercises</span>
                  <span className="text-sm font-bold text-gray-700">
                    {course.weeks?.reduce((acc, week) => acc + (week.exercises?.length || 0), 0)} Total
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> In Progress
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3 ml-2">
              <Layout className="w-6 h-6 text-blue-500" />
              Course Curriculum
            </h2>

            <div className="space-y-4">
              {course.weeks?.map((week, weekIndex) => (
                <div key={weekIndex} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Week Toggle Header */}
                  <button 
                    onClick={() => toggleWeek(weekIndex)}
                    className="w-full px-8 py-6 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                        expandedWeeks[weekIndex] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {weekIndex + 1}
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Week {weekIndex + 1}</span>
                        <h3 className="text-lg font-black text-gray-800">{week.title}</h3>
                      </div>
                    </div>
                    <div className={`p-2 rounded-xl bg-gray-50 transition-transform duration-300 ${expandedWeeks[weekIndex] ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>

                  {/* Week Content */}
                  <AnimatePresence>
                    {expandedWeeks[weekIndex] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8 space-y-6 pt-2">
                          {/* Lessons Sub-section */}
                          {week.lessons && week.lessons.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                <Video className="w-3.5 h-3.5 text-blue-500" /> Lessons
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                {week.lessons.map((lesson, lessonIndex) => (
                                  <div key={lessonIndex} className="group/item flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover/item:text-blue-600 transition-colors">
                                        <PlayCircle className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-bold text-gray-700 group-hover/item:text-blue-700 transition-colors">{lesson.title}</h5>
                                        <div className="flex items-center gap-3 mt-0.5">
                                           <span className="text-[10px] font-bold text-gray-400 uppercase">Video Lesson</span>
                                           {lesson.pdfUrl && (
                                             <span className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1">
                                               <FileText className="w-3 h-3" /> PDF Included
                                             </span>
                                           )}
                                        </div>
                                      </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-blue-400 group-hover/item:translate-x-1 transition-all" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Exercises Sub-section */}
                          {week.exercises && week.exercises.length > 0 && (
                            <div className="space-y-3 pt-2">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Exercises
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                {week.exercises.map((exercise, exerciseIndex) => (
                                  <div key={exerciseIndex} className="group/item flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-amber-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover/item:text-amber-600 transition-colors">
                                        <Award className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-bold text-gray-700 group-hover/item:text-amber-700 transition-colors">{exercise.title}</h5>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Interactive Quiz</span>
                                      </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-amber-400 group-hover/item:translate-x-1 transition-all" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Sidebar Info */}
        <div className="space-y-8">
          {/* Progress Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h4 className="text-lg font-black text-gray-800 mb-6">Course Progress</h4>
            
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 -rotate-90">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="#3b82f6" strokeWidth="12" 
                  strokeDasharray={`${2 * Math.PI * 58}`} 
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - 0.15)}`}
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-blue-600">15%</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Completed</span>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between text-xs font-bold">
                 <span className="text-gray-500">Completed Lessons</span>
                 <span className="text-gray-800">2 / 12</span>
               </div>
               <div className="flex items-center justify-between text-xs font-bold">
                 <span className="text-gray-500">Quiz Average</span>
                 <span className="text-gray-800">85%</span>
               </div>
            </div>

            <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
              Continue Learning
            </button>
          </div>

          {/* Instructor Card */}
          <div className="bg-blue-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h4 className="text-lg font-black mb-4">Need Help?</h4>
              <p className="text-blue-100/70 text-sm font-medium leading-relaxed mb-6">
                Our instructors are available to help you with any questions about the curriculum or exercises.
              </p>
              <Link to="/student/chat" className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-black text-xs hover:bg-blue-50 transition-colors">
                Contact Instructor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
