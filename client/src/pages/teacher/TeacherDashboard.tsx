import React from 'react';
import { Rocket, ShieldCheck, Sparkles, Layout, Zap, ArrowRight } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center overflow-hidden rounded-3xl">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-violet-400/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl w-full px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-8 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Evolution in Progress</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Instructor Dashboard <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
            Coming Soon
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          We're crafting a state-of-the-art experience for our instructors. 
          Your new command center will be faster, smarter, and more intuitive than ever before.
        </p>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Layout className="w-6 h-6" />, title: "Smart Insights", desc: "Real-time performance analytics" },
            { icon: <Zap className="w-6 h-6" />, title: "Quick Actions", desc: "One-click class management" },
            { icon: <ShieldCheck className="w-6 h-6" />, title: "Advanced Security", desc: "Enterprise-grade protection" }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
              <p className="text-xs text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 animate-float">
        <div className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/40 shadow-xl flex items-center justify-center rotate-12">
          <Rocket className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="absolute bottom-1/4 right-12 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="w-20 h-20 rounded-full bg-white/40 backdrop-blur-sm border border-white/40 shadow-xl flex items-center justify-center -rotate-12">
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-20px) rotate(var(--tw-rotate)); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default TeacherDashboard;
