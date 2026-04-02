import React from 'react';
import { Users, BookOpen, Clock, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import SectionCard from '../../components/dashboard/SectionCard';
import StatCard from '../../components/dashboard/StatCard';
import HeroBanner from '../../components/dashboard/HeroBanner';
import { RankingCard } from '../../components/dashboard/RankingCard';

// Using the same character but with a different message
const heroImage = '/dashboard_hero_character_1775105958488.png';

export const TeacherDashboard: React.FC = () => {
  const stats = [
    { title: 'Total Students', value: '1,284', icon: Users, color: 'blue', trend: { value: 12, isUp: true } },
    { title: 'Active Classes', value: '08', icon: BookOpen, color: 'purple', trend: { value: 5, isUp: true } },
    { title: 'Assignments', value: '34', icon: FileText, color: 'orange', trend: { value: 8, isUp: false } },
  ];

  const recentActivities = [
    { id: 1, student: 'Alice Johnson', activity: 'submitted Assignment #3', time: '2 mins ago', status: 'pending' },
    { id: 2, student: 'Bob Smith', activity: 'joined Class 10A', time: '1 hour ago', status: 'completed' },
    { id: 3, student: 'Charlie Davis', activity: 'requested help on Quiz 2', time: '3 hours ago', status: 'high' },
  ];

  const upcomingClasses = [
    { id: 1, title: 'Medical Pathology', time: '09:00 AM', duration: '1h 30m', students: 45 },
    { id: 2, title: 'Clinical Anatomy', time: '11:00 AM', duration: '1h 00m', students: 38 },
    { id: 3, title: 'Neurology Seminar', time: '02:30 PM', duration: '2h 00m', students: 52 },
  ];

  return (
    <div className="animate-fadeIn pb-8 max-w-[1400px] mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-blue-900 tracking-tight">Welcome back, Teacher 👋</h1>
      </header>

      {/* Hero Section */}
      <HeroBanner 
        title="Grading period ending soon!"
        description="Don't forget to review all pending assignments before the weekend. Your current grading completion is at 85%. Keep up the great work!"
        ctaText="Go to Grading"
        imageSrc={heroImage}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <SectionCard title="Recent Activities" viewAllPath="/teacher/activities">
          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  act.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                  act.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {act.student.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 tracking-tight">
                    {act.student} <span className="text-gray-500 font-medium">{act.activity}</span>
                  </p>
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {act.time}
                  </span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-all p-2 bg-white rounded-lg shadow-sm text-blue-500 hover:text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Upcoming Classes */}
        <SectionCard title="Upcoming Classes" viewAllPath="/teacher/schedule">
           <div className="space-y-4">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex flex-col items-center justify-center">
                    <span className="text-blue-600 font-black text-xs">{cls.time.split(' ')[0]}</span>
                    <span className="text-blue-400 font-bold text-[10px] tracking-widest">{cls.time.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 tracking-tight transition-colors group-hover:text-blue-600">{cls.title}</h4>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-400" /> {cls.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-blue-400" /> {cls.students} students</span>
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-50 group-hover:bg-blue-500 group-hover:text-white text-gray-600 rounded-xl font-bold text-xs transition-all tracking-wide">
                  Join
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default TeacherDashboard;
