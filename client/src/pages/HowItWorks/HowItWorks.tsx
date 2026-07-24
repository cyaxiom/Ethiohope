import React from 'react';
import { SectionContainer } from '../../components/ui/Container';
import { Heading, Text } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { UserPlus, MailCheck, User, BookOpen, Users, Calendar, CreditCard, PlayCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Create Your Account",
      description: "Sign up using your email and create your account in seconds.",
      note: "You will verify your email to activate your account.",
      icon: <UserPlus className="w-6 md:w-8 h-6 md:h-8" />
    },
    {
      id: 2,
      title: "Verify Your Email",
      description: "Check your inbox and confirm your email to secure your account.",
      icon: <MailCheck className="w-6 md:w-8 h-6 md:h-8" />
    },
    {
      id: 3,
      title: "Complete Your Profile",
      description: "Add your contact details and basic information to get started.",
      icon: <User className="w-6 md:w-8 h-6 md:h-8" />
    },
    {
      id: 4,
      title: "Choose a Program",
      description: "Browse available programs like Summer Coding, Web Development, or AI and select the one that fits your goals.",
      icon: <BookOpen className="w-6 md:w-8 h-6 md:h-8" />
    },
    {
      id: 5,
      title: "Add Your Child",
      description: "Create a child profile by entering their name, age, and school information.",
      note: "You can add multiple children under one account.",
      icon: <Users className="w-6 md:w-8 h-6 md:h-8" />
    },
    {
      id: 6,
      title: "Select Schedule",
      description: "Choose available class times (morning or evening) based on your preference.",
      icon: <Calendar className="w-6 md:w-8 h-6 md:h-8" />
    },
    {
      id: 7,
      title: "Complete Enrollment",
      description: "Confirm your selection and proceed to payment to activate the program.",
      icon: <CreditCard className="w-6 md:w-8 h-6 md:h-8" />
    },
    {
      id: 8,
      title: "Start Learning",
      description: "Your child receives login credentials and begins learning through videos, live sessions, and exercises.",
      icon: <PlayCircle className="w-6 md:w-8 h-6 md:h-8" />
    }
  ];

  return (
    <div className="w-full pt-0 bg-[#070b16] text-slate-100 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#070b16]">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-500/10 rounded-full blur-[100px] -z-10"></div>

        <SectionContainer containerSize="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <div className="relative z-10 order-2 lg:order-1">
               <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-500/15 text-blue-300 text-xs md:text-sm font-bold tracking-widest border border-blue-400/20 mb-8 uppercase">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                Step-by-Step Guide
              </div>
              <Heading variant="h1" className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                Master the Path <br/>
                to <span className="text-blue-400">Success</span>
              </Heading>
              <Text className="text-lg md:text-xl text-slate-400 font-medium max-w-xl mb-12 leading-relaxed">
                We've simplified the journey. From your first click to your child's first project, here's how EthioHope empowers the next generation of tech leaders.
              </Text>
              <div className="flex flex-wrap gap-4">
                 <Button 
                  onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white border-none px-10 py-7 rounded-[2rem] shadow-2xl shadow-blue-900/40 text-lg font-bold transition-all hover:translate-y-[-4px] group"
                  rightIcon={<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                 >
                    See How It Works
                 </Button>
              </div>

              {/* Trust markers */}
              <div className="mt-16 pt-8 border-t border-white/10 flex items-center gap-8">
                <div>
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Practical</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-2xl font-black text-white">24/7</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Support</div>
                </div>
              </div>
            </div>

            {/* Right Image Container - Optimized for Tall Image */}
            <div className="relative group order-1 lg:order-2">
               {/* Decorative outer rings */}
               <div className="absolute -inset-10 border border-white/10 rounded-[4rem] -z-10 group-hover:scale-105 transition-transform duration-1000"></div>
               <div className="absolute -inset-20 border border-white/5 rounded-[5rem] -z-20 group-hover:scale-110 transition-transform duration-1000 delay-75"></div>
               
               {/* Main stylized image container */}
               <div className="relative bg-[#0b1224] rounded-[3.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.45)] border-8 border-white/10 aspect-[2/3] max-w-[450px] mx-auto lg:ml-auto lg:mr-0 transform rotate-2 group-hover:rotate-0 transition-all duration-700">
                  <img 
                    src="/banner.jpg" 
                    alt="EthioHope Student Learning" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Glassmorphic Overlay Card */}
                  <div className="absolute bottom-10 left-6 right-6 bg-[#0b1224]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/15 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                        <Users className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-white font-black text-xl">Join the Tribe</div>
                        <div className="text-slate-400 text-sm font-medium">Build your future today</div>
                      </div>
                    </div>
                  </div>

                  {/* Gradient bottom overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
               </div>

               {/* Abstract decorative elements */}
               <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
               <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* 2. STEP-BY-STEP FLOW */}
      <section id="steps" className="py-20 md:py-32 relative bg-[#0b1224] overflow-hidden">
        <SectionContainer containerSize="md">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-500/40 via-emerald-400/30 to-blue-500/40 -translate-x-1/2 rounded-full hidden md:block opacity-60"></div>
            <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500/40 via-emerald-400/30 to-blue-500/40 md:hidden rounded-full"></div>

            <div className="space-y-12 md:space-y-24 relative z-10 w-full pt-4">
              {steps.map((step, idx) => {
                const isEven = idx % 2 !== 0;
                return (
                  <div key={step.id} className={`flex flex-col md:flex-row items-start md:items-center w-full group ${isEven ? 'md:flex-row-reverse' : ''} relative`}>
                    
                    {/* Center Icon */}
                    <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-14 md:w-16 h-14 md:h-16 mt-0 md:mt-0 top-0 md:top-auto bg-[#0b1224] border-4 border-blue-500/40 rounded-full flex items-center justify-center text-blue-300 shadow-lg z-20 group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-400`}>
                      {step.icon}
                    </div>

                    {/* Content Half */}
                    <div className={`w-full md:w-1/2 pl-[88px] md:pl-0 ${isEven ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}>
                      <div className={`bg-[#070b16] p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 transform group-hover:-translate-y-2 relative overflow-hidden group/card`}>
                        {/* Subtle number background */}
                        <div className={`absolute -top-6 ${isEven ? '-right-6' : '-left-6'} text-8xl font-black text-white/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                          {step.id}
                        </div>
                        
                        <div className={`text-xs font-bold tracking-[0.2em] text-blue-400 mb-4 uppercase flex ${isEven ? '' : 'md:justify-end'}`}>
                          Step {step.id}
                        </div>
                        <Heading variant="h4" className="mb-4 text-2xl font-bold text-white leading-tight">
                          {step.title}
                        </Heading>
                        <Text className="text-slate-400 text-lg leading-relaxed mb-4">
                          {step.description}
                        </Text>
                        {step.note && (
                          <div className={`mt-4 p-4 bg-blue-500/10 text-blue-200 text-sm font-semibold rounded-2xl border border-blue-400/20 inline-block text-left backdrop-blur-sm`}>
                            <span className="text-blue-400 mr-2">●</span>
                            {step.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionContainer>
      </section>

    </div>
  );
}
