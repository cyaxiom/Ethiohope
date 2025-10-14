
import { FaSitemap, FaCode, FaLock } from 'react-icons/fa';
import { IoFlash } from "react-icons/io5";
import { AiOutlineBarChart } from "react-icons/ai";

const ProgrammingService = () => {
  return (
    <div className="bg-dark-bg text-text-primary font-sans">

      {/* Hero Section */}
      <section className="py-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left ">
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl border-l-4  border-sky-500  pl-6 mb-12 ">
              Empowering businesses and individuals with cutting-edge programming solutions, ensuring transparency, scalability, and security like never before. Explore the future of digital innovation today.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight mb-10 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
              Revolutionizing Industries with{" "}
              <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                Next-Gen Code Solutions
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 rounded-lg font-bold text-white bg-green-500 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-blue/30">
                  Get Started
                </button>
                <button className="px-8 py-3 rounded-lg font-bold text-blue-500 hover:text-white  border cursor-pointer border-blue-500 hover:bg-blue-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-blue/30">
                  Learn more
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent pb-2">Why Choose Our Programming Service?</h2>
          <p className="text-lg  text-center max-w-3xl mx-auto mb-16">
            Designed for security, scalability, and efficiency, our programming solutions provide everything you need to power your digital transformations with confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-dark-card p-8 rounded-xl text-center flex flex-col items-center">
              <FaSitemap className="text-5xl text-brand-blue mb-5" />
              <h3 className="text-2xl font-bold mb-3">Scalable Architecture</h3>
              <p className="text-text-secondary mb-6">Eliminate single points of failure and ensure enhanced security with our robust, distributed architecture.</p>
              <button className="mt-auto px-6  py-2 rounded-lg font-bold text-white bg-green-500 text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-dark-card p-8 rounded-xl text-center flex flex-col items-center">
              <IoFlash className="text-5xl text-brand-blue mb-5" />
              <h3 className="text-2xl font-bold mb-3">High-Speed Performance</h3>
              <p className="text-text-secondary mb-6">Experience lightning-fast applications with our optimized code, capable of handling thousands of requests per second.</p>
              <button className="mt-auto px-6 py-2 rounded-lg font-bold text-white bg-green-500 text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-dark-card p-8 rounded-xl text-center flex flex-col items-center">
              <FaCode className="text-5xl text-brand-blue mb-5" />
              <h3 className="text-2xl font-bold mb-3">Clean & Efficient Code</h3>
              <p className="text-text-secondary mb-6">We enforce best practices to write well-structured code that enhances operational efficiency.</p>
              <button className="mt-auto px-6 py-2 rounded-lg font-bold text-white bg-green-500 text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
            {/* Feature Card 4 */}
            <div className="bg-dark-card p-8 rounded-xl text-center flex flex-col items-center">
              <FaLock className="text-5xl text-brand-blue mb-5" />
              <h3 className="text-2xl font-bold mb-3">Robust Security</h3>
              <p className="text-text-secondary mb-6">Protect your data with military-grade encryption and advanced cryptographic algorithms against cyber threats.</p>
              <button className="mt-auto px-6 py-2 rounded-lg font-bold text-white bg-green-500 text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
            {/* Feature Card 5 */}
            <div className="bg-dark-card p-8 rounded-xl text-center flex flex-col items-center">
              <AiOutlineBarChart className="text-5xl text-brand-blue mb-5" />
              <h3 className="text-2xl font-bold mb-3">Scalability & Efficiency</h3>
              <p className="text-text-secondary mb-6">Our solutions are designed to grow with your business, improving costs and enhancing overall efficiency.</p>
              <button className="mt-auto px-6 py-2 rounded-lg font-bold text-white bg-green-500 text-sm transition-transform duration-300 hover:scale-105">View Detail</button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Applications Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <h2 className="text-3xl md:text-5xl font-bold text-center  mb-4 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Real-World Applications of Our Service</h2>
          <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-16">
            From finance to supply chain, our solutions are reshaping industries by improving security, reducing costs, and enhancing efficiency.
          </p>
          <div className="space-y-4">
            <div className="border-b border-gray-700 py-6 flex items-start gap-x-6">
              <span className="text-2xl font-bold text-brand-blue">01</span>
              <h3 className="text-2xl font-semibold">Finance & Payments</h3>
            </div>
            <div className="border-b border-gray-700 py-6 flex items-start gap-x-6">
              <span className="text-2xl font-bold text-brand-blue">02</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Supply Chain Transparency</h3>
                <p className="text-text-secondary">Track and verify your entire supply chain process in real-time, reducing fraud and improving efficiency with immutable application records.</p>
              </div>
            </div>
            <div className="border-b border-gray-700 py-6 flex items-start gap-x-6">
              <span className="text-2xl font-bold text-brand-blue">03</span>
              <h3 className="text-2xl font-semibold">Healthcare Data Security</h3>
            </div>
            <div className="border-b border-gray-700 py-6 flex items-start gap-x-6">
              <span className="text-2xl font-bold text-brand-blue">04</span>
              <h3 className="text-2xl font-semibold">Identity Management</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent pb-2">Our Vision for the Future of Programming</h2>
          <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-16">
            Explore our strategic development roadmap as we continue to push the boundaries of technology and real-world adoption.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-1 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple">
              <div className="bg-dark-card p-8 rounded-lg h-full">
                <p className="text-text-secondary text-lg">2025</p>
                <h3 className="text-3xl font-bold mb-3">Q1</h3>
                <p className="font-semibold text-lg">Mainnet Launch & Security Enhancements</p>
              </div>
            </div>
            <div className="p-1 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple">
              <div className="bg-dark-card p-8 rounded-lg h-full">
                <p className="text-text-secondary text-lg">2025</p>
                <h3 className="text-3xl font-bold mb-3">Q2</h3>
                <p className="font-semibold text-lg">Smart Contracts & API Integrations</p>
              </div>
            </div>
            <div className="p-1 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple">
              <div className="bg-dark-card p-8 rounded-lg h-full">
                <p className="text-text-secondary text-lg">2025</p>
                <h3 className="text-3xl font-bold mb-3">Q3</h3>
                <p className="font-semibold text-lg">Enterprise Solutions & Mass Adoption</p>
              </div>
            </div>
            <div className="p-1 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple">
              <div className="bg-dark-card p-8 rounded-lg h-full">
                <p className="text-text-secondary text-lg">2025</p>
                <h3 className="text-3xl font-bold mb-3">Q4</h3>
                <p className="font-semibold text-lg">Global Expansion & Decentralized Governance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-blue to-brand-purple p-12 md:p-16 rounded-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent pb-2">Ready to Experience the Future of Programming?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Join thousands of businesses and individuals leveraging our technology to secure their digital transformations. Get started today!
            </p>
            <button className="px-8 py-3 rounded-lg font-bold bg-green-500 text-white transition duration-300 ease-in-out hover:bg-green-600 cursor-pointer hover:scale-105">
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgrammingService;