import React from 'react';
import { BookOpen, Calendar, Clock, Trophy } from 'lucide-react';
import SectionCard from '../../components/dashboard/SectionCard';
import StatCard from '../../components/dashboard/StatCard';
import HeroBanner from '../../components/dashboard/HeroBanner';
import RankingCard from '../../components/dashboard/RankingCard';
import ProgressChart from '../../components/dashboard/ProgressChart';

// Import the generated character image (using placeholder path for now)
const heroImage = '/dashboard_hero_character_1775105958488.png';

interface CourseCardProps {
  title: string;
  topics: number;
  students: number;
  progress: number;
  date: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, topics, students, progress, date }) => (
  <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-4 mb-4">
      <div className="relative w-14 h-14">
        {/* Progress circle SVG */}
        <svg className="w-14 h-14 -rotate-90">
          <circle cx="28" cy="28" r="24" fill="transparent" stroke="#f3f4f6" strokeWidth="4" />
          <circle cx="28" cy="28" r="24" fill="transparent" stroke="#3b82f6" strokeWidth="4" 
            strokeDasharray={`${2 * Math.PI * 24}`} 
            strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-red-500 fill-red-500/20" />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{title}</h4>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] flex items-center gap-1 text-gray-400 font-bold uppercase tracking-wider">
             <BookOpen className="w-2.5 h-2.5 text-blue-500" /> {topics} Topics
          </span>
          <span className="text-[10px] flex items-center gap-1 text-gray-400 font-bold uppercase tracking-wider">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> {students} Students
          </span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-4 mb-5 text-[10px] font-bold text-gray-400 ml-1">
      <span className="flex items-center gap-1 uppercase tracking-widest"><Calendar className="w-3 h-3 text-blue-500" /> {date}</span>
      <span className="flex items-center gap-1 uppercase tracking-widest"><Clock className="w-3 h-3 text-blue-500" /> {students} Students</span>
    </div>
    
    <button className="w-full py-2.5 bg-blue-500 text-white rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all shadow-lg shadow-blue-100/50">
      Enroll Now
    </button>
  </div>
);

export const StudentDashboard: React.FC = () => {
  const mockRankings = [
    { name: 'Joe Doe', rank: '50th', isCurrentUser: true },
    { name: 'Bella', rank: '1st' },
    { name: 'Lucas', rank: '2nd' }
  ];

  const mockChartData = [
    { day: '1 w', completed: 150, inProgress: 80 },
    { day: '2 w', completed: 180, inProgress: 110 },
    { day: '3 w', completed: 210, inProgress: 90 },
  ];

  const mockCourses = [
    { title: 'Cardiovascular Pro Exam', topics: 12, students: 200, progress: 72, date: '03/29/2023' },
    { title: 'Neurology Advanced', topics: 15, students: 150, progress: 45, date: '04/05/2023' },
    { title: 'Endocrinology Basics', topics: 8, students: 300, progress: 100, date: '02/12/2023' },
    { title: 'Pathology Review', topics: 20, students: 90, progress: 20, date: '05/10/2023' },
  ];

  return (
    <div className="animate-fadeIn pb-8 max-w-[1400px] mx-auto overflow-hidden">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-blue-900 tracking-tight">Welcome back 👋</h1>
      </header>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <HeroBanner 
            title="New Exams Available Now!"
            description="well come to our new exam to attend and chek your results how log are you pertice for your papers, we provide the best service for every one this platfoam boost your"
            ctaText="Explore More"
            imageSrc={heroImage}
            className="h-full"
          />
        </div>
        <div className="lg:col-span-1">
          <RankingCard rankings={mockRankings} className="h-full" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <StatCard title="Active Courses" value="12" icon={BookOpen} color="blue" />
        <StatCard title="Assignments" value="08" icon={Calendar} color="orange" />
        <StatCard title="Grade Average" value="85%" icon={Trophy} color="green" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Lessons Section */}
        <div className="lg:col-span-2">
          <SectionCard title="Popular Lessons" viewAllPath="/student/courses" className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mockCourses.map((course, idx) => (
                <CourseCard key={idx} {...course} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Progress Section */}
        <div className="lg:col-span-1">
          <ProgressChart data={mockChartData} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
