import React from "react";
import { FaSitemap, FaCode, FaLock } from 'react-icons/fa';
import { IoFlash } from "react-icons/io5";
import { AiOutlineBarChart } from "react-icons/ai";

const ProgrammingService = () => {
  return (
    <div className="bg-background text-foreground font-sans">

      {/* Hero Section */}
      <section className="py-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left ">
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl border-l-4  border-primary  pl-6 mb-12 ">
              Empowering businesses and individuals with cutting-edge programming solutions, ensuring transparency, scalability, and security like never before. Explore the future of digital innovation today.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight mb-10 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Revolutionizing Industries with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Next-Gen Code Solutions
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 rounded-lg font-bold text-white bg-primary cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                  Get Started
                </button>
                <button className="px-8 py-3 rounded-lg font-bold text-primary hover:text-white  border cursor-pointer border-primary hover:bg-primary transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                  Learn more
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-2">Why Choose Our Programming Service?</h2>
          <p className="text-lg  text-center max-w-3xl mx-auto mb-16 text-muted-foreground">
            Designed for security, scalability, and efficiency, our programming solutions provide everything you need to power your digital transformations with confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-card p-8 rounded-xl text-center flex flex-col items-center border border-border">
              <FaSitemap className="text-5xl text-primary mb-5" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">Scalable Architecture</h3>
              <p className="text-muted-foreground mb-6">Eliminate single points of failure and ensure enhanced security with our robust, distributed architecture.</p>
              <button className="mt-auto px-6  py-2 rounded-lg font-bold text-white bg-primary text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-card p-8 rounded-xl text-center flex flex-col items-center border border-border">
              <IoFlash className="text-5xl text-primary mb-5" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">High-Speed Performance</h3>
              <p className="text-muted-foreground mb-6">Experience lightning-fast applications with our optimized code, capable of handling thousands of requests per second.</p>
              <button className="mt-auto px-6 py-2 rounded-lg font-bold text-white bg-primary text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-card p-8 rounded-xl text-center flex flex-col items-center border border-border">
              <FaCode className="text-5xl text-primary mb-5" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">Clean & Efficient Code</h3>
              <p className="text-muted-foreground mb-6">We enforce best practices to write well-structured code that enhances operational efficiency.</p>
              <button className="mt-auto px-6 py-2 rounded-lg font-bold text-white bg-primary text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
            {/* Feature Card 4 */}
            <div className="bg-card p-8 rounded-xl text-center flex flex-col items-center border border-border">
              <FaLock className="text-5xl text-primary mb-5" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">Robust Security</h3>
              <p className="text-muted-foreground mb-6">Protect your data with military-grade encryption and advanced cryptographic algorithms against cyber threats.</p>
              <button className="mt-auto px-6 py-2 rounded-lg font-bold text-white bg-primary text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
            {/* Feature Card 5 */}
            <div className="bg-card p-8 rounded-xl text-center flex flex-col items-center border border-border">
              <AiOutlineBarChart className="text-5xl text-primary mb-5" />
              <h3 className="text-2xl font-bold mb-3 text-foreground">Scalability & Efficiency</h3>
              <p className="text-muted-foreground mb-6">Our solutions are designed to grow with your business, improving costs and enhancing overall efficiency.</p>
              <button className="mt-auto px-6 py-2 rounded-lg font-bold text-white bg-primary text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Applications Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <h2 className="text-3xl md:text-5xl font-bold text-center  mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Real-World Applications of Our Service</h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16">
            From finance to supply chain, our solutions are reshaping industries by improving security, reducing costs, and enhancing efficiency.
          </p>
          <div className="space-y-4">
            <div className="border-b border-border py-6 flex items-start gap-x-6">
              <span className="text-2xl font-bold text-primary">01</span>
              <h3 className="text-2xl font-semibold text-foreground">Finance & Payments</h3>
            </div>
            <div className="border-b border-border py-6 flex items-start gap-x-6">
              <span className="text-2xl font-bold text-primary">02</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-foreground">Supply Chain Transparency</h3>
                <p className="text-muted-foreground">Track and verify your entire supply chain process in real-time, reducing fraud and improving efficiency with immutable application records.</p>
              </div>
            </div>
            <div className="border-b border-border py-6 flex items-start gap-x-6">
              <span className="text-2xl font-bold text-primary">03</span>
              <h3 className="text-2xl font-semibold text-foreground">Healthcare Data Security</h3>
            </div>
            <div className="border-b border-border py-6 flex items-start gap-x-6">
              <span className="text-2xl font-bold text-primary">04</span>
              <h3 className="text-2xl font-semibold text-foreground">Identity Management</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-2">Our Vision for the Future of Programming</h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16">
            Explore our strategic development roadmap as we continue to push the boundaries of technology and real-world adoption.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-primary/60">
              <div className="bg-card p-8 rounded-lg h-full border border-border/50">
                <p className="text-muted-foreground text-lg">2025</p>
                <h3 className="text-3xl font-bold mb-3 text-foreground">Q1</h3>
                <p className="font-semibold text-lg text-foreground">Mainnet Launch & Security Enhancements</p>
              </div>
            </div>
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-primary/60">
              <div className="bg-card p-8 rounded-lg h-full border border-border/50">
                <p className="text-muted-foreground text-lg">2025</p>
                <h3 className="text-3xl font-bold mb-3 text-foreground">Q2</h3>
                <p className="font-semibold text-lg text-foreground">Smart Contracts & API Integrations</p>
              </div>
            </div>
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-primary/60">
              <div className="bg-card p-8 rounded-lg h-full border border-border/50">
                <p className="text-muted-foreground text-lg">2025</p>
                <h3 className="text-3xl font-bold mb-3 text-foreground">Q3</h3>
                <p className="font-semibold text-lg text-foreground">Enterprise Solutions & Mass Adoption</p>
              </div>
            </div>
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-primary/60">
              <div className="bg-card p-8 rounded-lg h-full border border-border/50">
                <p className="text-muted-foreground text-lg">2025</p>
                <h3 className="text-3xl font-bold mb-3 text-foreground">Q4</h3>
                <p className="font-semibold text-lg text-foreground">Global Expansion & Decentralized Governance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-12 md:p-16 rounded-2xl text-center border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-2">Ready to Experience the Future of Programming?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of businesses and individuals leveraging our technology to secure their digital transformations. Get started today!
            </p>
            <button className="px-8 py-3 rounded-lg font-bold bg-primary text-white transition duration-300 ease-in-out hover:bg-primary/90 cursor-pointer hover:scale-105">
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgrammingService;