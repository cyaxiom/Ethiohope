import React from 'react';
 import growthImage from "@images/growthLogo/growth.png"; 
 import logo1 from "@images/growthLogo/claynosaurz.svg"; 
import logo2 from "@images/growthLogo/monkey.svg"; 
import logo3 from "@images/growthLogo/fox.svg"; 
import logo4 from "@images/growthLogo/okay.svg"; 


import { Aperture, Gamepad2, Landmark, Wallet, Layers2 } from 'lucide-react';

export default function Growth() {
  const categories = [
    { name: 'NFTs', icon: <Aperture className="w-4 h-4" /> },
    { name: 'DeFi', icon: <Landmark className="w-4 h-4" /> },
    { name: 'Payments', icon: <Wallet className="w-4 h-4" /> },
    { name: 'Gaming', icon: <Gamepad2 className="w-4 h-4" /> },
    { name: 'DAOs', icon: <Layers2 className="w-4 h-4" /> },
  ];

  
 
  const [activeCategory, setActiveCategory] = React.useState('NFTs');

  return (
    <div className="container mx-auto px-4 py-16 bg-background">
      
      {/* Header & Category Buttons  */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
          Build for growth.
        </h1>
        
        {/* Button Group */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          {categories.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveCategory(item.name)}
              className={`
                flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50
                border
                ${
                  item.name === activeCategory
                 
                    ? 'bg-primary border-primary text-primary-foreground shadow-primary/30 hover:bg-accent'
                    
                    : 'bg-secondary border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>
      </div>

    
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Image */}
        <div className="lg:w-1/2">
          <img
            src={growthImage}
            alt="Anybodies illustration"
            className="w-full h-auto rounded-xl shadow-2xl border border-border 
                       hover:shadow-primary/50 transition-shadow duration-500"
          />
        </div>

       
        <div className="lg:w-1/2 bg-card p-8 rounded-xl border border-border shadow-xl 
                        hover:shadow-primary/30 transition-all duration-500">
          
          <div className="flex items-center mb-4">
         
            <div className="w-10 h-10 bg-primary rounded-full mr-3 flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-extrabold text-xl">A</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">ANYBODIES</h2>
          </div>
          
          <p className="mb-6 text-lg text-muted-foreground">
            It's time to bridge the digital and physical. Anybodies helps
            established brands like Toys'R'Us connect real-life places and
            products with NFTs.
          </p>
          
          <a
            href="#"
            className="inline-flex items-center text-primary font-semibold hover:text-accent-foreground hover:underline underline-offset-4 transition-colors duration-200"
          >
            Learn more about {activeCategory} on Solana
          </a>
        </div>
      </div>

      {/* Footer Card */}



    <div className="w-full bg-background  border border-border shadow-2xl flex justify-between items-center gap-16 py-4 rounded-xl mt-4">
      {/* Logo 1 */}
      <img
        src={logo1}
        alt="CuriousMaze Logo"
        className="h-10 object-contain"
      />

      {/* Logo 2 */}
      <img
        src={logo2}
        alt="Monkey Logo"
        className="h-10 object-contain"
      />

      {/* Logo 3 */}
      <img
        src={logo3}
        alt="Fox Logo"
        className="h-10 object-contain"
      />

      {/* Logo 4 */}
      <img
        src={logo4}
        alt="Okay Logo"
        className="h-10 object-contain"
      />
    </div>
    </div>
  );
}
