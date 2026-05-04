import React from 'react';
import { Link } from 'react-router-dom';
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
    <div className="w-full pt-20 bg-muted/30 text-foreground min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 bg-white">
        <SectionContainer containerSize="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide border border-blue-200">
                GUIDE FOR PARENTS & LEARNERS
              </span>
              <Heading variant="h1" className="text-4xl md:text-5xl font-extrabold leading-tight">
                How EthioHope Works
              </Heading>
              <Text className="text-xl text-muted-foreground font-medium max-w-xl">
                A simple step-by-step journey from registration to learning.
              </Text>
            </div>
            <div className="relative isolate flex justify-center">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[2rem] transform rotate-3 scale-105 -z-10 opacity-70"></div>
              {/* Optional: Replace with actual image when available */}
              <div className="w-full max-w-md aspect-video bg-muted rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white">
                <img 
                  src="/how-it-works.png" 
                  alt="Process guide" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60";
                  }}
                />
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* 2. STEP-BY-STEP FLOW */}
      <section className="py-20 md:py-32 relative">
        <SectionContainer containerSize="md">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-200 via-purple-300 to-blue-200 -translate-x-1/2 rounded-full hidden md:block opacity-60"></div>
            <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-purple-300 to-blue-200 md:hidden rounded-full"></div>

            <div className="space-y-12 md:space-y-24 relative z-10 w-full pt-4">
              {steps.map((step, idx) => {
                const isEven = idx % 2 !== 0;
                return (
                  <div key={step.id} className={`flex flex-col md:flex-row items-start md:items-center w-full group ${isEven ? 'md:flex-row-reverse' : ''} relative`}>
                    
                    {/* Center Icon */}
                    <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-14 md:w-16 h-14 md:h-16 mt-0 md:mt-0 top-0 md:top-auto bg-white border-4 border-blue-200 rounded-full flex items-center justify-center text-primary shadow-lg z-20 group-hover:scale-110 transition-transform duration-300 group-hover:border-primary`}>
                      {step.icon}
                    </div>

                    {/* Content Half */}
                    <div className={`w-full md:w-1/2 pl-[88px] md:pl-0 ${isEven ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}>
                      <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 relative ${isEven ? 'text-left' : 'text-left md:text-right'}`}>
                        <div className={`text-sm font-bold tracking-widest text-primary mb-2 uppercase flex ${isEven ? '' : 'md:justify-end'}`}>Step {step.id}</div>
                        <Heading variant="h4" className="mb-3">{step.title}</Heading>
                        <Text className="text-muted-foreground">{step.description}</Text>
                        {step.note && (
                          <div className={`mt-4 p-3 bg-blue-50 text-blue-800 text-sm font-medium rounded-lg border border-blue-100 inline-block text-left`}>
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

      {/* 4. FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-blue-500/20 pointer-events-none blur-3xl"></div>
        <SectionContainer containerSize="sm" className="relative z-10">
          <Heading variant="h2" className="text-white mb-6">Ready to get started?</Heading>
          <Text className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
            Join EthioHope today and give your child the tools to build their future.
          </Text>
          <Link to="/register">
            <Button 
              className="text-lg bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white font-bold px-10 py-6 rounded-full shadow-xl transition-transform hover:scale-105"
              rightIcon={<ArrowRight className="w-5 h-5 ml-2" />}
            >
              Create Your Account
            </Button>
          </Link>
        </SectionContainer>
      </section>
    </div>
  );
}
