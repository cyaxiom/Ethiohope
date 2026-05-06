import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Code, 
  Cpu, 
  Globe, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Lightbulb,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { SectionContainer } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const HeroSection = () => {
  const navigate = useNavigate();
  return (
  <section className="relative min-h-screen flex items-center pt-24 pb-32 overflow-hidden bg-slate-950">
    <div className="absolute inset-0 z-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero_bg_2.png')" }}
      />
      {/* Persistent Overlay matching Homepage Carousel style */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10"></div>
    </div>
    
    <SectionContainer containerSize="lg" className="relative z-20">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl"
      >
        <span className="inline-block px-5 py-2 mb-8 text-xs font-black tracking-[0.2em] uppercase bg-primary/20 border border-primary/40 rounded-full text-white backdrop-blur-md shadow-[0_0_15px_rgba(123,92,255,0.3)]">
          Redefining Tech Education
        </span>
        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] drop-shadow-2xl text-white">
          Empowering the Next <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent animate-gradient-x">
            Generation of Creators
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-medium drop-shadow-lg">
          From building sophisticated digital systems to mentoring future innovators, 
          EthioHope is bridging the gap between theoretical knowledge and real-world 
          industry excellence in Ethiopia's growing tech landscape.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                document.getElementById('popular-programs')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            size="lg" 
            className="rounded-full px-10 py-5 text-xl font-black bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 border-none"
          >
            Explore Our Programs
          </Button>
        </div>
      </motion.div>
    </SectionContainer>
  </section>
  );
};


const ExperienceSection = () => (
  <SectionContainer sectionSpacing="xl" className="bg-slate-50 dark:bg-slate-950/50">
    <div className="text-center max-w-3xl mx-auto mb-20">
      <motion.div {...fadeInUp}>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-4">Real-World Expertise</h2>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">We Don't Just Teach Tech. <br />We Build It.</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Our mentorship is rooted in active industry practice. Every lesson we share comes from the frontlines of software development.
        </p>
      </motion.div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { 
          icon: <Globe className="w-10 h-10" />, 
          title: "Modern Websites", 
          desc: "Building fast, responsive, and secure web architectures for the modern age." 
        },
        { 
          icon: <Cpu className="w-10 h-10" />, 
          title: "AI Applications", 
          desc: "Implementing intelligent systems that automate and enhance decision making." 
        },
        { 
          icon: <Zap className="w-10 h-10" />, 
          title: "Business Systems", 
          desc: "Developing custom ERP and management tools that streamline complex operations." 
        },
        { 
          icon: <Code className="w-10 h-10" />, 
          title: "Digital Tools", 
          desc: "Creating specialized software that solves specific industry bottlenecks." 
        }
      ].map((item, i) => (
        <motion.div 
          key={i}
          {...fadeInUp}
          transition={{ delay: i * 0.1 }}
          className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-105 transition-transform duration-300"
        >
          <div className="mb-6 text-primary">{item.icon}</div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </SectionContainer>
);

const TeachingSection = () => {
  const navigate = useNavigate();
  return (
  <SectionContainer sectionSpacing="xl" className="overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div {...fadeInUp} className="order-2 lg:order-1">
        <div className="relative">
           <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px]"></div>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4 pt-8">
               <div className="h-48 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-end text-white shadow-lg">
                 <Rocket className="w-8 h-8 mb-4" />
                 <span className="font-bold">Project Based</span>
               </div>
               <div className="h-64 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-600 p-8 flex flex-col justify-end text-white shadow-lg">
                 <Users className="w-8 h-8 mb-4" />
                 <span className="font-bold">Expert Mentors</span>
               </div>
             </div>
             <div className="space-y-4">
               <div className="h-64 rounded-3xl bg-gradient-to-bl from-orange-500 to-red-600 p-8 flex flex-col justify-end text-white shadow-lg">
                 <ShieldCheck className="w-8 h-8 mb-4" />
                 <span className="font-bold">Industry Ready</span>
               </div>
               <div className="h-48 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-8 flex flex-col justify-end text-white shadow-lg">
                 <Zap className="w-8 h-8 mb-4" />
                 <span className="font-bold">Rapid Growth</span>
               </div>
             </div>
           </div>
        </div>
      </motion.div>
      
      <motion.div {...fadeInUp} className="order-1 lg:order-2">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-4">What We Teach</h2>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8">Theory is Good. <br /><span className="text-primary">Execution is Everything.</span></h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          At EthioHope, we bypass traditional rote learning. Our students don't just read about algorithms; they implement them. They don't just study database schemas; they deploy them to support real user traffic.
        </p>
        <ul className="space-y-4 mb-10">
          {[
            "Real project simulations from day one",
            "Mentorship from active software engineers",
            "Focus on modern, in-demand tech stacks",
            "Industry-standard coding and design practices"
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <Button 
          onClick={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('popular-programs')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          size="lg" 
          className="rounded-full px-10 font-bold group"
        >
          See All Courses <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Button>
      </motion.div>
    </div>
  </SectionContainer>
  );
};

const WhyUsSection = () => (
  <SectionContainer sectionSpacing="xl" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-[4rem] my-20 border border-slate-200 dark:border-slate-800">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-1">
        <motion.div {...fadeInUp}>
          <h3 className="text-4xl font-black mb-6">Why Students <br />Trust Us</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
            Our reputation is built on the success of our graduates and the quality of our systems. We are more than a school; we are a technology partner.
          </p>
        </motion.div>
      </div>
      
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            icon: <ShieldCheck className="w-8 h-8 text-blue-400" />, 
            title: "Industry Credibility", 
            desc: "Our instructors are the same engineers building Ethiopia's digital infrastructure." 
          },
          { 
            icon: <TrendingUp className="w-8 h-8 text-purple-400" />, 
            title: "Career Growth", 
            desc: "We focus on skills that companies are actually hiring for right now." 
          },
          { 
            icon: <Users className="w-8 h-8 text-emerald-400" />, 
            title: "Supportive Community", 
            desc: "Join a network of creators who support each other's growth and success." 
          },
          { 
            icon: <Lightbulb className="w-8 h-8 text-yellow-400" />, 
            title: "Innovative Methods", 
            desc: "Constantly updating our curriculum to reflect the latest tech breakthroughs." 
          }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            {...fadeInUp} 
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="p-8 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm"
          >
            <div className="mb-6">{item.icon}</div>
            <h4 className="text-xl font-bold mb-3">{item.title}</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </SectionContainer>
);

const VisionSection = () => (
  <SectionContainer sectionSpacing="xl">
    <div className="text-center max-w-4xl mx-auto">
      <motion.div {...fadeInUp}>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-4">The Future</h2>
        <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-10">Our Mission is to <br />Transform Ethiopia's Tech.</h3>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium italic">
          "We envision an Ethiopia where every young person has the tools to build their own future, solving local problems with world-class technology solutions. EthioHope is here to provide those tools."
        </p>
        <div className="inline-flex items-center p-2 pr-6 rounded-full bg-slate-100 dark:bg-slate-800 gap-4">
           <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">EH</div>
           <span className="font-bold text-slate-900 dark:text-white">Our Future Vision for 2030</span>
        </div>
      </motion.div>
    </div>
  </SectionContainer>
);


export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      <HeroSection />
      <ExperienceSection />
      <TeachingSection />
      <WhyUsSection />
      <VisionSection />
    </div>
  );
}