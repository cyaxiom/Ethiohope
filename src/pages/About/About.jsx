import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="w-full bg-[#151138]">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-between overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl"></div>
        
        {/* Left side content */}
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 relative z-20 text-left pr-0 md:pr-8 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              With A Passion For <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Commitment</span> To Success
            </h1>
            
            {/* Indicator dot and line */}
            <div className="flex items-center mb-10">
              <div className="h-2 w-2 rounded-full bg-cyan-400 mr-2"></div>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            </div>
          </div>
          
          {/* Right side image */}
          <div className="w-full md:w-1/2 relative z-10">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://res.cloudinary.com/skyrev/image/upload/v1692613891/bungalion/photos/l53_ghhq17.jpg" 
                alt="Hero" 
                className="w-full h-[50vh] object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT US Giant Text Background */}
      <div className="relative py-20">
        <div className="text-[10rem] md:text-[20rem] font-bold text-[#1e1a4f] absolute inset-0 flex items-center justify-center z-0 uppercase tracking-widest opacity-70">
          ABOUT US
        </div>
        
        {/* About Us Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            {/* Indicator dot and line */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-2 w-2 rounded-full bg-cyan-400 mr-2"></div>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">
              We're More Than Just A Team Of Experts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <p className="text-lg text-white/80 mb-6">
                  With a passion for innovation and a commitment to excellence, we've been
                  empowering businesses to thrive in the digital landscape since
                </p>
                <p className="text-lg text-white/80 mb-6">
                  Our journey is rooted in a deep understanding of your goals, and our mission is
                  to transform your visions into reality. With a track record of delivering
                  exceptional results, we're here to propel your brand forward, together.
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex-1 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 p-6 rounded-xl">
                  <h3 className="text-5xl md:text-7xl font-bold text-white">+300</h3>
                  <p className="text-xl text-cyan-400 mt-2">Developers</p>
                </div>
                
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-blue-400/30 to-purple-500/30 p-6 rounded-xl mb-6">
                    <p className="text-2xl text-white font-bold">Founded In</p>
                    <p className="text-5xl font-bold text-white">2011</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400/30 to-cyan-500/30 p-6 rounded-xl">
                    <h3 className="text-5xl font-bold text-white">+1000</h3>
                    <p className="text-xl text-purple-400 mt-2">Projects</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-2xl italic text-white/80">
              "it's not just about strategy, it's about the heart and soul you infuse into every endeavor."
            </div>
          </div>
          
          {/* Values Section */}
          <div className="relative py-20">
            <h2 className="text-5xl font-bold text-white mb-6">Our Values</h2>
            
            {/* Indicator dot and line */}
            <div className="flex items-center mb-16">
              <div className="h-2 w-2 rounded-full bg-cyan-400 mr-2"></div>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Propel your business forward
                </h3>
                <p className="text-lg text-white/80 mb-8">
                  We thrive on exploring the uncharted territories of creativity and technology,
                  delivering solutions that break new ground. Our collective brilliance is the
                  result of seamless teamwork, where every voice is valued, and every perspective matters.
                </p>
              </div>
              
              <div className="md:w-2/3 relative flex items-center justify-center min-h-[500px]">
                {/* Central circle with gradient text */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-[400px] h-[400px] rounded-full border-[3px] border-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="text-6xl font-bold bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 text-transparent bg-clip-text">3 Key</div>
                      <div className="text-7xl font-bold bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 text-transparent bg-clip-text">Values</div>
                    </div>
                  </div>
                </div>
                
                {/* Focus circle */}
                <div className="absolute top-0 right-1/4 z-20">
                  <div className="bg-black rounded-full p-6 w-44 h-44 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-2">
                        <div className="w-full h-full rounded-full border-2 border-gray-200 relative flex items-center justify-center">
                          <div className="w-8 h-8 bg-purple-200 rounded-full"></div>
                          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">Focus</h3>
                      <p className="text-white/70 text-sm max-w-[120px] mx-auto">
                        We work with you to understand your unique needs
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Commitment circle */}
                <div className="absolute bottom-10 right-10 z-20">
                  <div className="bg-black rounded-full p-6 w-44 h-44 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 2L2 20M20 2L38 20M20 2V38" stroke="white" strokeWidth="3"/>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">Commitment</h3>
                      <p className="text-white/70 text-sm max-w-[140px] mx-auto">
                        Enhancing our ability to deliver diverse and impactful solutions
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Will circle */}
                <div className="absolute bottom-10 left-10 z-20">
                  <div className="bg-black rounded-full p-6 w-44 h-44 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="2"/>
                          <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2"/>
                          <circle cx="20" cy="20" r="3" fill="white"/>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">Will</h3>
                      <p className="text-white/70 text-sm max-w-[120px] mx-auto">
                        The visionary behind it all and leads with a strategic mindset
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Partners Section */}
          <div className="py-20">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Partners and Investors</h2>
            <p className="text-lg text-white/80 mb-12 text-center max-w-3xl mx-auto">
              Trust is the foundation of our relationships – we're transparent, honest, and
              dedicated to upholding the highest ethical standards.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <div className="text-white text-xl">L{item}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Stats Section */}
            <div className="mt-24 py-16 px-8 md:px-16 bg-[#1c184f] rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-5xl font-bold text-cyan-400 mb-2">+123M</h3>
                  <div className="w-32 h-1 bg-cyan-400 mx-auto mb-4"></div>
                  <p className="text-2xl text-white">Clients</p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-5xl font-bold text-purple-400 mb-2">+456K</h3>
                  <div className="w-32 h-1 bg-purple-400 mx-auto mb-4"></div>
                  <p className="text-2xl text-white">Partners</p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-5xl font-bold text-cyan-400 mb-2">+789</h3>
                  <div className="w-32 h-1 bg-cyan-400 mx-auto mb-4"></div>
                  <p className="text-2xl text-white">Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CULTURE Giant Text Background */}
      <div className="relative py-20">
        <div className="text-[10rem] md:text-[20rem] font-bold text-[#1e1a4f] absolute inset-0 flex items-center justify-center z-0 uppercase tracking-widest opacity-70">
          CULTURE
        </div>
        
        {/* Culture Section */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            {/* Indicator dot and line */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-2 w-2 rounded-full bg-cyan-400 mr-2"></div>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">
              We're A Diverse Family Of Creative Minds
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <img 
                src="https://res.cloudinary.com/skyrev/image/upload/v1692613886/bungalion/photos/l15_scwgwc.jpg" 
                alt="Culture" 
                className="w-full h-72 object-cover rounded-xl"
              />
              <img 
                src="https://res.cloudinary.com/skyrev/image/upload/v1692613887/bungalion/photos/l22_z1thos.jpg" 
                alt="Culture" 
                className="w-full h-72 object-cover rounded-xl"
              />
              <img 
                src="https://res.cloudinary.com/skyrev/image/upload/v1692613894/bungalion/photos/p17_cwy0yc.jpg" 
                alt="Culture" 
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Our culture is the heartbeat of our success
                </h3>
                <p className="text-lg text-white/80 mb-6">
                  We believe in a workplace where each team member's strengths are celebrated, 
                  where learning is a constant, and where passion fuels every project
                </p>
              </div>
              
              <div className="text-left">
                <p className="text-lg text-white/80">
                  Unlock the full potential of your brand with our comprehensive range of services. 
                  From creative design and strategic marketing to cutting-edge development and beyond, 
                  we offer a holistic approach that ensures your brand's impact resonates across every touchpoint.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="py-20">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Meet Our Dynamic Team</h2>
            
            {/* Team Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Team Member 1 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:opacity-80 transition-opacity z-10"></div>
                  <div className="absolute left-0 bottom-0 z-20 p-8">
                    <h3 className="text-3xl font-bold text-white">John Doe</h3>
                    <p className="text-xl text-white/90">Founder & CEO</p>
                  </div>
                  <div className="absolute top-0 right-0 flex gap-2 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                  <img 
                    src="https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male8_iodxvm.png" 
                    alt="John Doe" 
                    className="w-full h-96 object-cover"
                  />
                </div>
                <p className="text-white/70">
                  Cras convallis lacus orci, tristique tincidunt magna consequat in. 
                  In vel pulvinar est, at euismod libero. Quisque ut metus sit amet augue rutrum feugiat.
                </p>
              </div>
              
              {/* Team Member 2 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:opacity-80 transition-opacity z-10"></div>
                  <div className="absolute left-0 bottom-0 z-20 p-8">
                    <h3 className="text-3xl font-bold text-white">Jane Doe</h3>
                    <p className="text-xl text-white/90">Founder & CEO</p>
                  </div>
                  <div className="absolute top-0 right-0 flex gap-2 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                  <img 
                    src="https://res.cloudinary.com/skyrev/image/upload/v1692613791/bungalion/avatars/female7_lrelgs.png" 
                    alt="Jane Doe" 
                    className="w-full h-96 object-cover"
                  />
                </div>
                <p className="text-white/70">
                  In vel pulvinar est, at euismod libero. Quisque ut metus sit amet augue rutrum feugiat.
                </p>
              </div>
              
              {/* Team Member 3 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:opacity-80 transition-opacity z-10"></div>
                  <div className="absolute left-0 bottom-0 z-20 p-8">
                    <h3 className="text-3xl font-bold text-white">Alex Smith</h3>
                    <p className="text-xl text-white/90">Founder & CEO</p>
                  </div>
                  <div className="absolute top-0 right-0 flex gap-2 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                  <img 
                    src="https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male6_wqwcnu.png" 
                    alt="Alex Smith" 
                    className="w-full h-96 object-cover"
                  />
                </div>
                <p className="text-white/70">
                  In vel pulvinar est, at euismod libero. Quisque ut metus sit amet augue rutrum feugiat.
                </p>
              </div>
              
              {/* Team Member 4 */}
              <div className="group">
                <div className="relative overflow-hidden rounded-3xl mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:opacity-80 transition-opacity z-10"></div>
                  <div className="absolute left-0 bottom-0 z-20 p-8">
                    <h3 className="text-3xl font-bold text-white">Michael Brown</h3>
                    <p className="text-xl text-white/90">Founder & CEO</p>
                  </div>
                  <div className="absolute top-0 right-0 flex gap-2 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                  <img 
                    src="https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male5_g1j5oi.png" 
                    alt="Michael Brown" 
                    className="w-full h-96 object-cover"
                  />
                </div>
                <p className="text-white/70">
                  Cras convallis lacus orci, tristique tincidunt magna consequat in.
                </p>
              </div>
            </div>
            
            {/* Team Grid Image */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-16">
              <img 
                src="https://res.cloudinary.com/skyrev/image/upload/v1692613897/bungalion/photos/s12_isbsyr.jpg" 
                alt="Team" 
                className="w-full h-60 object-cover rounded-xl"
              />
              <img 
                src="https://res.cloudinary.com/skyrev/image/upload/v1692613896/bungalion/photos/p32_kzhjdt.jpg" 
                alt="Team" 
                className="w-full h-60 object-cover rounded-xl"
              />
              <div className="relative">
                <img 
                  src="https://res.cloudinary.com/skyrev/image/upload/v1692613885/bungalion/photos/l14_islm3z.jpg" 
                  alt="Team" 
                  className="w-full h-60 object-cover rounded-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link 
                    to="/about/teams" 
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors flex items-center"
                  >
                    Join Now! →
                  </Link>
                </div>
              </div>
              <img 
                src="https://res.cloudinary.com/skyrev/image/upload/v1692613897/bungalion/photos/s13_c5gyjw.jpg" 
                alt="Team" 
                className="w-full h-60 object-cover rounded-xl"
              />
              <img 
                src="https://res.cloudinary.com/skyrev/image/upload/v1692613897/bungalion/photos/s11_uqonla.jpg" 
                alt="Team" 
                className="w-full h-60 object-cover rounded-xl"
              />
            </div>
          </div>
          
          {/* Latest News */}
          <div className="py-20">
            <h2 className="text-4xl font-bold text-white mb-6 text-center">Latest News</h2>
            
            {/* Indicator dot and line */}
            <div className="flex items-center justify-center mb-12">
              <div className="h-2 w-2 rounded-full bg-cyan-400 mr-2"></div>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            </div>
            
            <p className="text-xl text-white/80 text-center mb-16">
              Read more about latest news and our special event
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group">
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <img 
                      src={`https://source.unsplash.com/random/400x300?tech=${item}`}
                      alt="News" 
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 p-4 z-20">
                      <p className="text-sm text-cyan-400 uppercase font-bold mb-2">HEADLINE</p>
                      <h3 className="text-lg font-bold text-white">
                        Sed imperdiet enim ligula, vitae viverra justo porta vel.
                      </h3>
                    </div>
                  </div>
                  <Link 
                    to="/blog" 
                    className="text-cyan-400 hover:text-cyan-300 transition-colors uppercase font-bold text-sm"
                  >
                    READ MORE
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;