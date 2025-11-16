import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Shield, Users, Award, ArrowRight, TrendingUp,
  Play, ExternalLink, ChevronRight, Sparkles, Rocket,
  Layers, Database, Network, BarChart3, Calendar, MapPin
} from 'lucide-react';

const Web3Development = () => {
  // Core data for the page
  const features = [
    {
      icon: <Layers />,
      title: "Smart Contract Development",
      description: "Master Solidity, Vyper, and Rust to build secure, gas-optimized smart contracts for multiple chains.",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: <Network />,
      title: "DApp Architecture",
      description: "Build full-stack decentralized applications with React, Next.js, and Web3 integration libraries.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Database />,
      title: "NFT & DeFi Protocols",
      description: "Create sophisticated NFT marketplaces, DeFi protocols, and tokenization systems with advanced functionality.",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Projects Delivered", icon: <Award />, color: "text-amber-500" },
    { number: "10K+", label: "Students Enrolled", icon: <Users />, color: "text-blue-500" },
    { number: "98%", label: "Completion Rate", icon: <TrendingUp />, color: "text-green-500" },
    { number: "24/7", label: "Expert Support", icon: <Shield />, color: "text-purple-500" }
  ];

  const events = [
    { 
      date: "22 May", 
      location: "Bandung", 
      title: "Web3 Development Workshop", 
      description: "Hands-on session for building smart contracts",
      type: "Workshop",
      duration: "Full Day"
    },
    { 
      date: "30 Jul", 
      location: "London", 
      title: "DeFi Protocol Summit", 
      description: "Advanced DeFi development techniques",
      type: "Summit",
      duration: "2 Days"
    },
    { 
      date: "22 Aug", 
      location: "Indianapolis", 
      title: "NFT Marketplace Bootcamp", 
      description: "Create your own NFT marketplace",
      type: "Bootcamp",
      duration: "3 Days"
    },
    { 
      date: "10 Oct", 
      location: "Kathmandu", 
      title: "Blockchain Security Conference", 
      description: "Security best practices for Web3",
      type: "Conference",
      duration: "2 Days"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-neutral-50 dark:from-slate-900 dark:via-slate-800 dark:to-neutral-900">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-gray-500/10 to-slate-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg backdrop-blur-sm">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Empowering the Future with Blockchain
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-slate-700 via-gray-700 to-slate-600 dark:from-slate-300 dark:via-gray-300 dark:to-slate-400 bg-clip-text text-transparent">
                  Explore the potential
                </span>
                <br />
                <span className="text-5xl md:text-7xl text-slate-800 dark:text-slate-200">
                  of blockchain!
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-4xl mx-auto mb-12">
                Redefine the way your business operates. Join us on this transformative journey today and become part of the Web3 revolution!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link 
                  to="/register" 
                  className="group relative bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                >
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <button className="group relative bg-white dark:bg-slate-800 border-2 border-blue-500 text-slate-900 dark:text-slate-100 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-500/20 to-gray-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-200/30 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                    <div className="mt-6 flex items-center text-slate-600 dark:text-slate-400 font-medium">
                      <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Learn More
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-neutral-50 dark:from-slate-800 dark:via-slate-700 dark:to-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(71,85,105,0.05)_0%,transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group relative">
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1 border border-slate-200/70 dark:border-slate-700/70">
                  <div className="w-14 h-14 bg-gradient-to-r from-slate-600 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {React.cloneElement(stat.icon, { className: `w-7 h-7 text-white ${stat.color}` })}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-base text-slate-700 dark:text-slate-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(71,85,105,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-500/20 to-gray-500/20 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20 shadow-xl">
              <Sparkles className="w-5 h-5 animate-pulse" />
              Revolutionary Technology
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-300 via-gray-300 to-slate-400 bg-clip-text text-transparent">
                Advanced Features
              </span>
            </h2>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-16">
              Create and manage digital assets with cutting-edge blockchain technology.
              Automate workflows and build the future of decentralized applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-500/30 to-gray-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-900/40 to-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-400/20 shadow-xl hover:shadow-slate-500/25 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-gray-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Network className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-slate-300 transition-colors">
                  Seamless Blockchain Integration
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Enable frictionless data and asset transfers across platforms with military-grade security and authentication.
                </p>
                <div className="flex items-center text-slate-300 font-medium group-hover:text-slate-200 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Explore Networks
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/30 to-slate-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/40 to-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-400/20 shadow-xl hover:shadow-gray-500/25 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-300 transition-colors">
                  Decentralized Security
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Leverage blockchain's decentralized architecture for tamper-proof security with advanced cryptographic protocols.
                </p>
                <div className="flex items-center text-gray-300 font-medium group-hover:text-gray-200 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Learn Security
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/20 shadow-xl hover:shadow-blue-500/25 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                  Smart Contract Automation
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Self-executing smart contracts reduce intermediaries and enhance efficiency through autonomous code execution.
                </p>
                <div className="flex items-center text-blue-300 font-medium group-hover:text-blue-200 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Build Contracts
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-indigo-900 dark:to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1)_0%,transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 backdrop-blur-xl text-indigo-700 dark:text-indigo-300 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg">
                <Rocket className="w-5 h-5" />
                Development Process
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Streamlined Workflow
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-16">
                Automate your development process with comprehensive workflow tools and smart contract integration
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BarChart3 />,
                  title: "Trading",
                  description: "Set up recurring buys with automated trading strategies and risk management",
                  color: "from-blue-500 to-cyan-500",
                  action: "Learn Trading"
                },
                {
                  icon: <Network />,
                  title: "Transaction",
                  description: "Secure multi-signature verification with instant settlement and tracking",
                  color: "from-purple-500 to-pink-500",
                  action: "Process Transactions"
                },
                {
                  icon: <Rocket />,
                  title: "Deployment",
                  description: "Seamless deployment pipelines with continuous integration and testing",
                  color: "from-emerald-500 to-teal-500",
                  action: "Deploy Now"
                }
              ].map((item, index) => (
                <div key={index} className="text-center group relative">
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-slate-200/30 dark:border-slate-700/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      {React.cloneElement(item.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium group-hover:text-indigo-500 transition-colors">
                      <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      {item.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.2)_0%,transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20 shadow-xl">
                <Calendar className="w-5 h-5" />
                Professional Events
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Upcoming Events
                </span>
              </h2>
              
              <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-16">
                Connect with industry leaders and advance your Web3 career through our professional events
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event, index) => (
                <div key={index} className="group relative">
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-white/25 transition-all duration-500 hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-blue-400">{event.date}</div>
                      <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {event.type}
                      </div>
                    </div>
                    
                    <div className="text-base font-medium text-white mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {event.location}
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {event.title}
                    </h4>
                    
                    <p className="text-white/70 leading-relaxed mb-4 text-sm">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-white/60 text-xs">{event.duration}</div>
                      <div className="flex items-center text-blue-400 font-medium text-sm group-hover:text-blue-300 transition-colors">
                        Register
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl">
                View All Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Web3Development;