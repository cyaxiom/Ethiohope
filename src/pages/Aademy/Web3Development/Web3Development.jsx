import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Shield, Users, Award, ArrowRight, TrendingUp,
  Play, ExternalLink, ChevronRight, Sparkles, Rocket,
  Layers, Database, Network, BarChart3, Calendar, MapPin
} from 'lucide-react';
import { DS } from '@/constants/designSystem';
import Container from '@/components/ui/Container';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-muted/50 text-foreground px-6 py-3 rounded-full text-sm font-medium mb-8 border border-border shadow-lg backdrop-blur-sm">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Empowering the Future with Blockchain
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-foreground text-foreground bg-clip-text text-transparent drop-shadow-sm">
                  Explore the potential
                </span>
                <br />
                <span className="text-5xl md:text-7xl text-foreground font-extrabold">
                  of blockchain!
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-4xl mx-auto mb-12">
                Redefine the way your business operates. Join us on this transformative journey today and become part of the Web3 revolution!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link 
                  to="/register" 
                  className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                >
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <button className="group relative bg-background border-2 border-primary text-foreground px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="group relative h-full flex">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      <div className="mt-auto flex items-center text-muted-foreground font-medium">
                        <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        Learn More
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.05)_0%,transparent_50%)]"></div>
        
        <Container className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group relative">
                <div className="relative bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1 border border-border">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {React.cloneElement(stat.icon, { className: `w-7 h-7 ${stat.color}` })}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(var(--primary),0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-xl text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 border border-primary/20 shadow-xl">
              <Sparkles className="w-5 h-5 animate-pulse" />
              Revolutionary Technology
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                Advanced Features
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16">
              Create and manage digital assets with cutting-edge blockchain technology.
              Automate workflows and build the future of decentralized applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Network className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                  Seamless Blockchain Integration
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Enable frictionless data and asset transfers across platforms with military-grade security and authentication.
                </p>
                <div className="flex items-center text-muted-foreground font-medium group-hover:text-primary transition-colors mt-auto">
                  <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Explore Networks
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                  Decentralized Security
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Leverage blockchain's decentralized architecture for tamper-proof security with advanced cryptographic protocols.
                </p>
                <div className="flex items-center text-muted-foreground font-medium group-hover:text-primary transition-colors mt-auto">
                  <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Learn Security
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Code className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                  Smart Contract Automation
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Self-executing smart contracts reduce intermediaries and enhance efficiency through autonomous code execution.
                </p>
                <div className="flex items-center text-muted-foreground font-medium group-hover:text-primary transition-colors mt-auto">
                  <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Build Contracts
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(var(--primary),0.05)_0%,transparent_50%)]"></div>
        
        <Container className="relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-xl text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 border border-primary/20 shadow-lg">
                <Rocket className="w-5 h-5" />
                Development Process
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Streamlined Workflow
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16">
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
                  <div className="relative bg-card backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      {React.cloneElement(item.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <h4 className="text-xl font-bold text-card-foreground mb-4">{item.title}</h4>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="mt-auto flex items-center justify-center text-primary font-medium group-hover:text-primary/80 transition-colors">
                      <ChevronRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      {item.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(var(--primary),0.1)_0%,transparent_50%)]"></div>
        
        <Container className="relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-xl text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 border border-primary/20 shadow-xl">
                <Calendar className="w-5 h-5" />
                Professional Events
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Upcoming Events
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16">
                Connect with industry leaders and advance your Web3 career through our professional events
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event, index) => (
                <div key={index} className="group relative">
                  <div className="relative bg-card backdrop-blur-xl rounded-2xl p-6 border border-border shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary">{event.date}</div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {event.type}
                      </div>
                    </div>
                    
                    <div className="text-base font-medium text-foreground mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {event.location}
                    </div>
                    
                    <h4 className="text-lg font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                      {event.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-muted-foreground text-xs">{event.duration}</div>
                      <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary/80 transition-colors">
                        Register
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="group bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl">
                View All Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Web3Development;