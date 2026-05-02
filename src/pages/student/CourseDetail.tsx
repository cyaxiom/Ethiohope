import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, BookOpen, Video, FileText, 
  HelpCircle, ChevronDown, ChevronRight, PlayCircle,
  CheckCircle, Clock, Award, Layout, Layers,
  ArrowLeft, Activity, ShieldAlert, Lock, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetStudentCourseByIdQuery } from '../../features/courses/courseApi';
import { useGetProgressQuery, useCompleteLessonMutation } from '../../features/progress/progressApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast } from 'sonner';

type CourseVideoItem = string | {
  url?: string;
  subtitle?: string;
  description?: string;
};

const resolveVideoMeta = (video: CourseVideoItem, lesson: any, videoIndex: number) => {
  const lessonTitle = typeof lesson?.title === 'string' ? lesson.title.trim() : '';
  const fallbackSubtitle = lessonTitle || `Lecture ${videoIndex + 1}`;

  if (typeof video === 'string') {
    return {
      url: video,
      subtitle: fallbackSubtitle,
      description: lesson?.description || 'Watch this lecture video',
    };
  }

  const subtitle = video?.subtitle?.trim();
  const description = video?.description?.trim();
  return {
    url: video?.url || '',
    subtitle: subtitle || fallbackSubtitle,
    description: description || lesson?.description || 'Watch this lecture video',
  };
};

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // 1. Data Fetching & Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'course.read') || hasPermission(permissions, 'dashboard.student');

  const { data: courseData, isLoading: isCourseLoading, isError: isCourseError } = useGetStudentCourseByIdQuery(id || '', { skip: !canRead });
  const enrollmentId = courseData?.enrollmentId;
  const { data: progressData, isLoading: isProgressLoading } = useGetProgressQuery(enrollmentId || '', { skip: !enrollmentId });
  const [completeLesson, { isLoading: isCompleting }] = useCompleteLessonMutation();

  // 2. State & Refs
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, number>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({ "0": true });
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  const [selectedVideo, setSelectedVideo] = useState<{
    weekIndex: number;
    lessonIndex: number;
    videoIndex: number;
  } | null>(null);

  const playerRef = useRef<any>(null);

  // 3. Derived Data (Course & Progress)
  const course = courseData?.data;
  const progress = progressData?.data;

  // 4. Progress Helper Functions
  const isLectureCompleted = useMemo(() => (wIdx: number, lIdx: number, vIdx: number) => {
    if (!progress?.completedLessons) return false;
    return progress.completedLessons.some(
      l => String(l.courseId) === String(id) && l.weekIndex === wIdx && l.lessonIndex === lIdx && l.videoIndex === vIdx
    );
  }, [progress, id]);

  const isLessonCompleted = useMemo(() => (wIdx: number, lIdx: number) => {
    if (!course?.weeks?.[wIdx]?.lessons?.[lIdx]) return false;
    const videosInLesson = course.weeks[wIdx].lessons[lIdx].videoUrls || [];
    if (videosInLesson.length === 0) return true;
    return videosInLesson.every((_, vIdx) => isLectureCompleted(wIdx, lIdx, vIdx));
  }, [course, isLectureCompleted]);

  const isWeekCompleted = useMemo(() => (wIdx: number) => {
    if (!course?.weeks?.[wIdx]) return false;
    const lessonsInWeek = course.weeks[wIdx].lessons || [];
    if (lessonsInWeek.length === 0) return true;
    return lessonsInWeek.every((_, lIdx) => isLessonCompleted(wIdx, lIdx));
  }, [isLessonCompleted, course]);

  const isWeekLocked = useMemo(() => (wIdx: number) => {
    if (wIdx === 0) return false;
    return !isWeekCompleted(wIdx - 1);
  }, [isWeekCompleted]);

  const isLessonLocked = useMemo(() => (wIdx: number, lIdx: number) => {
    if (isWeekLocked(wIdx)) return true;
    if (lIdx === 0) return false;
    return !isLessonCompleted(wIdx, lIdx - 1);
  }, [isWeekLocked, isLessonCompleted]);

  const totalLectures = useMemo(() => {
    return course?.weeks?.reduce((acc: number, week: any) => {
      return acc + (week.lessons?.reduce((lAcc: number, lesson: any) => lAcc + (lesson.videoUrls?.length || 0), 0) || 0);
    }, 0) || 0;
  }, [course]);

  const completedInThisCourse = useMemo(() => {
    if (!progress?.completedLessons) return 0;
    return progress.completedLessons.filter(l => String(l.courseId) === String(id)).length;
  }, [progress, id]);
  
  const coursePercentage = useMemo(() => {
    if (totalLectures === 0) return 0;
    return Math.round((completedInThisCourse / totalLectures) * 100);
  }, [completedInThisCourse, totalLectures]);

  // 5. Action Handlers
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSelectOption = (weekIndex: number, exerciseIndex: number, questionIndex: number, optionIndex: number) => {
    const key = `${weekIndex}-${exerciseIndex}-${questionIndex}`;
    setExerciseAnswers(prev => ({
      ...prev,
      [key]: optionIndex
    }));
  };

  const handleContinueLearning = () => {
    if (!course?.weeks) return;
    
    // Find the first uncompleted lecture
    for (let wIdx = 0; wIdx < course.weeks.length; wIdx++) {
      const week = course.weeks[wIdx];
      if (isWeekLocked(wIdx)) break;
      
      for (let lIdx = 0; lIdx < (week.lessons?.length || 0); lIdx++) {
        const lesson = week.lessons[lIdx];
        if (isLessonLocked(wIdx, lIdx)) break;
        
        for (let vIdx = 0; vIdx < (lesson.videoUrls?.length || 0); vIdx++) {
          if (!isLectureCompleted(wIdx, lIdx, vIdx)) {
            setSelectedVideo({ weekIndex: wIdx, lessonIndex: lIdx, videoIndex: vIdx });
            return;
          }
        }
      }
    }
    
    // Fallback: if all completed or none found, open the first one
    setSelectedVideo({ weekIndex: 0, lessonIndex: 0, videoIndex: 0 });
  };

  const handleCompleteLecture = async (weekIndex: number, lessonIndex: number, videoIndex: number) => {
    if (!enrollmentId || !id) return;
    try {
      await completeLesson({
        enrollmentId,
        courseId: id,
        weekIndex,
        lessonIndex,
        videoIndex
      }).unwrap();
      toast.success('Lecture completed!');
    } catch (err: any) {
      if (err?.status !== 409) {
        toast.error(err?.data?.message || 'Failed to complete lecture');
      }
    }
  };

  const toggleWeek = (index: number) => {
    setExpandedWeeks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleLesson = (weekIndex: number, lessonIndex: number, isLocked: boolean) => {
    if (isLocked) {
      toast.error('This lecture is locked! Complete the previous one first.');
      return;
    }
    const key = `${weekIndex}-${lessonIndex}`;
    setExpandedLessons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExercise = (weekIndex: number, exerciseIndex: number) => {
    const key = `${weekIndex}-${exerciseIndex}`;
    setExpandedExercises(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 6. YouTube Player Effect
  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    if (!selectedVideo || !course) return;

    const currentLesson = course.weeks[selectedVideo.weekIndex].lessons[selectedVideo.lessonIndex];
    const selectedVideoMeta = resolveVideoMeta(currentLesson.videoUrls[selectedVideo.videoIndex], currentLesson, selectedVideo.videoIndex);
    const videoId = getYoutubeId(selectedVideoMeta.url);
    if (!videoId) return;

    let player: any = null;

    const initPlayer = () => {
      const elId = 'youtube-player-element';
      const el = document.getElementById(elId);
      
      if (!el || !(window as any).YT || !(window as any).YT.Player) return;

      player = new (window as any).YT.Player(elId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => event.target.playVideo(),
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              handleCompleteLecture(selectedVideo.weekIndex, selectedVideo.lessonIndex, selectedVideo.videoIndex);
            }
          },
        },
      });
      playerRef.current = player;
    };

    // If player already exists and is ready, just load the new video
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById(videoId);
        return;
      } catch (err) {
        console.warn("Re-initializing player due to load error", err);
      }
    }

    const runInit = () => {
      const elId = 'youtube-player-element';
      if (document.getElementById(elId) && (window as any).YT && (window as any).YT.Player) {
        initPlayer();
      } else {
        let retries = 0;
        const retryInterval = setInterval(() => {
          if (document.getElementById(elId) && (window as any).YT && (window as any).YT.Player) {
            initPlayer();
            clearInterval(retryInterval);
          }
          retries++;
          if (retries > 20) clearInterval(retryInterval);
        }, 100);
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      const t = setTimeout(runInit, 500); // Increased delay for stability
      return () => clearTimeout(t);
    } else {
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        runInit();
      };
    }

    return () => {
      // We don't destroy here to allow loadVideoById to work on next effect run
      // unless we're navigating away entirely which is handled by another effect or below
    };
  }, [selectedVideo, course]);

  // Clean up player when leaving the video view or unmounting
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [!!selectedVideo === false]); 

  // 7. Render Loading/Error States
  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view this course.</p>
      </div>
    );
  }

  if (isCourseLoading || isProgressLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <Activity className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading course details...</p>
      </div>
    );
  }

  if (isCourseError || !courseData || !course) {
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

  // 8. Main Render
  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fadeIn px-4">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/student/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Courses
        </Link>
        <div className="flex items-center gap-3">
           <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Course Progress</span>
           <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-500 transition-all duration-1000" 
               style={{ width: `${coursePercentage}%` }}
             />
           </div>
           <span className="text-xs font-black text-blue-600">{coursePercentage}%</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedVideo ? (
          <motion.div 
            key="video-player"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Main Player Column */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-black rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video relative border-4 border-white group/player">
                {(() => {
                  const currentLesson = course.weeks[selectedVideo.weekIndex].lessons[selectedVideo.lessonIndex];
                  const selectedVideoMeta = resolveVideoMeta(currentLesson.videoUrls[selectedVideo.videoIndex], currentLesson, selectedVideo.videoIndex);
                  const videoId = getYoutubeId(selectedVideoMeta.url);
                  return videoId ? (
                    <div 
                      id="youtube-player-element" 
                      className="absolute inset-0 w-full h-full" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                      <Video className="w-16 h-16 mb-4 text-gray-600" />
                      <p className="text-xl font-bold mb-4">External Video Content</p>
                      <a 
                        href={selectedVideoMeta.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-8 py-3 bg-blue-600 rounded-2xl font-black hover:bg-blue-700 transition-all"
                      >
                        Open in New Tab
                      </a>
                    </div>
                  );
                })()}

                {/* Mark as Completed Overlay Button */}
                <div className="absolute bottom-6 right-6 z-20 transition-all duration-300 translate-y-2 opacity-0 group-hover/player:translate-y-0 group-hover/player:opacity-100">
                  {isLectureCompleted(selectedVideo.weekIndex, selectedVideo.lessonIndex, selectedVideo.videoIndex) ? (
                    <div className="flex items-center gap-2 bg-green-600 text-white font-black text-[10px] px-4 py-2.5 rounded-xl shadow-xl border border-white/20 backdrop-blur-md">
                      <CheckCircle2 className="w-4 h-4" /> LECTURE COMPLETED
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleCompleteLecture(selectedVideo.weekIndex, selectedVideo.lessonIndex, selectedVideo.videoIndex)}
                      disabled={isCompleting}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-black text-[10px] px-6 py-3 rounded-xl shadow-2xl border border-white/30 backdrop-blur-xl transition-all active:scale-95 group/btn"
                    >
                      {isCompleting ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-green-400 group-hover/btn:scale-110 transition-transform" />}
                      MARK AS COMPLETED
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      Week {selectedVideo.weekIndex + 1}
                    </span>
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      Lecture {selectedVideo.lessonIndex + 1}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                
                {(() => {
                  const currentLesson = course.weeks[selectedVideo.weekIndex].lessons[selectedVideo.lessonIndex];
                  const selectedVideoMeta = resolveVideoMeta(currentLesson.videoUrls[selectedVideo.videoIndex], currentLesson, selectedVideo.videoIndex);
                  return (
                    <>
                      <h2 className="text-2xl font-black text-gray-800 mb-2">
                        {selectedVideoMeta.subtitle}
                      </h2>
                      <p className="text-gray-500 font-medium leading-relaxed">
                        {selectedVideoMeta.description}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm h-full max-h-[calc(100vh-200px)] flex flex-col">
                <div className="flex items-center gap-3 mb-6 px-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Week {selectedVideo.weekIndex + 1} Videos</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Course Playlist</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                   {course.weeks[selectedVideo.weekIndex].lessons.map((lesson, lIdx) => (
                    <div key={lIdx} className="space-y-1">
                      {lesson.videoUrls.map((video, vIdx) => {
                        const videoMeta = resolveVideoMeta(video, lesson, vIdx);
                        const isActive = selectedVideo.lessonIndex === lIdx && selectedVideo.videoIndex === vIdx;
                        const isDone = isLectureCompleted(selectedVideo.weekIndex, lIdx, vIdx);
                        return (
                          <button 
                            key={vIdx}
                            disabled={isLessonLocked(selectedVideo.weekIndex, lIdx)}
                            onClick={() => setSelectedVideo({ ...selectedVideo, lessonIndex: lIdx, videoIndex: vIdx })}
                            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                              isActive 
                                ? 'bg-blue-50 text-blue-600' 
                                : isLessonLocked(selectedVideo.weekIndex, lIdx)
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                                isDone 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : isActive ? 'border-blue-500' : 'border-gray-200 group-hover:border-blue-400'
                              }`}>
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                                  Part {vIdx + 1}
                                </p>
                                <p className={`text-xs font-bold truncate ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                                  {videoMeta.subtitle}
                                </p>
                              </div>
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" />}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="mt-6 w-full py-4 bg-gray-50 text-gray-500 font-black text-xs rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Curriculum
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="curriculum-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
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
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lectures</span>
                  <span className="text-sm font-bold text-gray-700">
                    {totalLectures} Total
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
                  <span className={`text-sm font-bold flex items-center gap-1 ${progress?.percentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                    {progress?.percentage === 100 ? <CheckCircle className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                    {progress?.percentage === 100 ? 'Course Completed' : 'In Progress'}
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
              {course.weeks?.map((week, weekIndex) => {
                const isLocked = isWeekLocked(weekIndex);
                const isCompleted = isWeekCompleted(weekIndex);
                
                return (
                  <div key={weekIndex} className={`bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm transition-all ${isLocked ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md'}`}>
                    {/* Week Toggle Header */}
                    <button 
                      onClick={() => !isLocked && toggleWeek(weekIndex)}
                      disabled={isLocked}
                      className={`w-full px-8 py-6 flex items-center justify-between group transition-colors ${isLocked ? 'cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50/50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                          isLocked ? 'bg-gray-200 text-gray-400' : 
                          isCompleted ? 'bg-green-600 text-white shadow-lg shadow-green-100' :
                          expandedWeeks[weekIndex] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isLocked ? <Lock className="w-5 h-5" /> : weekIndex + 1}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-gray-400' : 'text-blue-500'}`}>Week {weekIndex + 1}</span>
                             {isCompleted && (
                               <span className="flex items-center gap-1 text-[8px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                                 <CheckCircle2 className="w-3 h-3" /> Done
                               </span>
                             )}
                          </div>
                          <h3 className={`text-lg font-black ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{week.title}</h3>
                        </div>
                      </div>
                      <div className={`p-2 rounded-xl bg-gray-50 transition-transform duration-300 ${expandedWeeks[weekIndex] ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>

                    {/* Week Content */}
                    <AnimatePresence>
                      {expandedWeeks[weekIndex] && !isLocked && (
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
                                  <Video className="w-3.5 h-3.5 text-blue-500" /> Lectures
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                  {week.lessons.map((lesson, lessonIndex) => {
                                    const isExpanded = expandedLessons[`${weekIndex}-${lessonIndex}`];
                                    const lessonLocked = isLessonLocked(weekIndex, lessonIndex);
                                    const lessonDone = isLessonCompleted(weekIndex, lessonIndex);
                                    
                                    return (
                                      <div key={lessonIndex} className={`bg-gray-50 rounded-2xl overflow-hidden border transition-all ${
                                        lessonLocked ? 'opacity-60 border-transparent' : 
                                        isExpanded ? 'border-blue-200 bg-white' : 'border-transparent hover:border-blue-100'
                                      }`}>
                                        <button 
                                          onClick={() => toggleLesson(weekIndex, lessonIndex, lessonLocked)}
                                          className={`w-full flex items-center justify-between p-4 group/item transition-colors ${lessonLocked ? 'cursor-not-allowed' : 'hover:bg-blue-50/50'}`}
                                        >
                                          <div className="flex items-center gap-4 text-left">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${
                                              lessonLocked ? 'bg-gray-200 text-gray-400' :
                                              lessonDone ? 'bg-green-600 text-white' :
                                              isExpanded ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 group-hover/item:text-blue-600'
                                            }`}>
                                              {lessonLocked ? <Lock className="w-4 h-4" /> : lessonDone ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                                            </div>
                                            <div>
                                              <h5 className={`text-sm font-bold ${lessonLocked ? 'text-gray-400' : 'text-gray-700 group-hover/item:text-blue-700'} transition-colors`}>{lesson.title}</h5>
                                              <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{lessonLocked ? 'Locked' : 'Lecture'}</span>
                                                {lesson.pdfUrl && !lessonLocked && (
                                                  <span className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> PDF Included
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          {!lessonLocked && <ChevronDown className={`w-4 h-4 text-gray-300 group-hover/item:text-blue-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />}
                                        </button>

                                        <AnimatePresence>
                                          {isExpanded && !lessonLocked && (
                                            <motion.div 
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              className="px-6 pb-6 pt-2 space-y-4"
                                            >
                                              <div className="grid grid-cols-1 gap-4">
                                                {lesson.videoUrls?.map((video, videoIndex) => {
                                                  const videoMeta = resolveVideoMeta(video, lesson, videoIndex);
                                                  const lectureDone = isLectureCompleted(weekIndex, lessonIndex, videoIndex);
                                                  return (
                                                    <button 
                                                      key={videoIndex} 
                                                      onClick={() => setSelectedVideo({ weekIndex, lessonIndex, videoIndex })}
                                                      className={`w-full text-left bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4 transition-all group ${
                                                        lectureDone ? 'border-green-100 hover:border-green-300' : 'border-gray-100 hover:border-blue-500 hover:bg-blue-50'
                                                      }`}
                                                    >
                                                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                                        lectureDone ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white'
                                                      }`}>
                                                        {lectureDone ? <CheckCircle2 className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md transition-colors ${
                                                            lectureDone ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500 group-hover:bg-red-100'
                                                          }`}>Lecture {videoIndex + 1}</span>
                                                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{videoMeta.subtitle}</span>
                                                        </div>
                                                        <h6 className="text-sm font-black text-gray-800 truncate">{videoMeta.description}</h6>
                                                        <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">Click to play this lecture</p>
                                                      </div>
                                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all transform ${
                                                        lectureDone ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                                                      }`}>
                                                        {lectureDone ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                                                      </div>
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                              
                                              {lesson.pdfUrl && (
                                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group/pdf">
                                                  <div className="flex items-center gap-3">
                                                     <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                                       <FileText className="w-4 h-4" />
                                                     </div>
                                                     <div className="flex flex-col">
                                                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reading Material</span>
                                                       <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-gray-700 hover:underline line-clamp-1">
                                                         Download Lecture PDF
                                                       </a>
                                                     </div>
                                                  </div>
                                                  <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 text-gray-400 rounded-lg opacity-0 group-hover/pdf:opacity-100 transition-opacity">
                                                    <FileText className="w-4 h-4" />
                                                  </a>
                                                </div>
                                              )}
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
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
                                  {week.exercises.map((exercise, exerciseIndex) => {
                                    const isExpanded = expandedExercises[`${weekIndex}-${exerciseIndex}`];
                                    return (
                                      <div key={exerciseIndex} className="bg-gray-50 rounded-2xl overflow-hidden border border-transparent hover:border-amber-100 transition-all">
                                        <button 
                                          onClick={() => toggleExercise(weekIndex, exerciseIndex)}
                                          className="w-full flex items-center justify-between p-4 group/item hover:bg-amber-50/50 transition-colors"
                                        >
                                          <div className="flex items-center gap-4 text-left">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${isExpanded ? 'bg-amber-500 text-white' : 'bg-white text-gray-400 group-hover/item:text-amber-600'}`}>
                                              <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                              <h5 className="text-sm font-bold text-gray-700 group-hover/item:text-amber-700 transition-colors">{exercise.title}</h5>
                                              <span className="text-[10px] font-bold text-gray-400 uppercase">Interactive Quiz • {exercise.questions?.length || 0} Questions</span>
                                            </div>
                                          </div>
                                          <ChevronDown className={`w-4 h-4 text-gray-300 group-hover/item:text-amber-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                          {isExpanded && (
                                            <motion.div 
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              className="px-6 pb-6 pt-2 space-y-4"
                                            >
                                              <div className="bg-white p-6 rounded-2xl border border-amber-50 shadow-sm space-y-6">
                                                {exercise.questions?.map((q, qIdx) => (
                                                   <div key={qIdx} className="space-y-4">
                                                      <div className="flex gap-3">
                                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">Q{qIdx + 1}</span>
                                                        <p className="text-sm font-bold text-gray-700">{q.question}</p>
                                                      </div>
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                                                        {q.options?.map((opt, optIdx) => {
                                                          const isSelected = exerciseAnswers[`${weekIndex}-${exerciseIndex}-${qIdx}`] === optIdx;
                                                          return (
                                                            <button 
                                                              key={optIdx} 
                                                              onClick={() => handleSelectOption(weekIndex, exerciseIndex, qIdx, optIdx)}
                                                              className={`
                                                                flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border-2
                                                                ${isSelected 
                                                                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                                                                  : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-gray-50'
                                                                }
                                                              `}
                                                            >
                                                              <div className={`
                                                                w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                                                ${isSelected ? 'border-blue-500' : 'border-gray-300'}
                                                              `}>
                                                                {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                                              </div>
                                                              <span className="text-xs font-bold">{opt}</span>
                                                            </button>
                                                          );
                                                        })}
                                                      </div>
                                                   </div>
                                                 ))}
                                                <button className="w-full py-3 bg-amber-500 text-white rounded-xl font-black text-xs shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all active:scale-[0.98]">
                                                  Start Exercise
                                                </button>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
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
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - coursePercentage / 100)}`}
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-blue-600">{coursePercentage}%</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Completed</span>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between text-xs font-bold">
                 <span className="text-gray-500">Completed Lectures</span>
                 <span className="text-gray-800">{completedInThisCourse} / {totalLectures}</span>
               </div>
               <div className="flex items-center justify-between text-xs font-bold">
                 <span className="text-gray-500">Remaining Lectures</span>
                 <span className="text-gray-800">{totalLectures - completedInThisCourse}</span>
               </div>
            </div>

            <button 
              onClick={handleContinueLearning}
              className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              {coursePercentage === 100 ? 'Review Course' : 'Continue Learning'}
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
      </motion.div>
    )}
  </AnimatePresence>
</div>
);
};

export default CourseDetail;
