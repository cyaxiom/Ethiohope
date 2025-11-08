import React from 'react';
// Assuming your image imports are correct based on your file structure
import image7 from '@images/partner/image7.png';
import image2 from '@images/partner/image2.png';
import image3 from '@images/partner/image3.png';
import image4 from '@images/partner/image4.png';
import image5 from '@images/partner/image5.png';
import image6 from '@images/partner/image6.png';
import image8 from '@images/partner/image8.png';

// Map company names to imported images
const companyLogos = {
  Brave: image2,
  Circle: image3,
  Discord: image4,
  Google: image5,
  Jump: image6,
  Llama: image7,
  'Magic Eden': image8,
};

export default function Partner() {
  const companies = ['Brave', 'Circle', 'Discord', 'Google', 'Jump', 'Llama', 'Magic Eden'];

  return (
    <div className=" py-8 h-20%  bg-background "> {/* Use theme colors for background and border */}
      <div className="text-center max-w-7xl mx-auto px-4">
       
        <p className="text-sm uppercase font-medium text-muted-foreground tracking-widest mb-8">
          POWERING TOOLS AND INTEGRATIONS FROM COMPANIES ALL AROUND THE WORLD
        </p>
        <div className="flex flex-nowrap justify-center items-center gap-x-12 gap-y-8 mt-4">
          {companies.map((company) => (
           
            <div
              key={company}
              className="
                flex items-center justify-center
                cursor-pointer transition duration-300 ease-in-out
                transform hover:scale-105 dark:hover:opacity-100
                opacity-70 group
              "
              title={`Partner: ${company}`} 
            >
              <img
                src={companyLogos[company]}
                alt={`${company} logo`}
              
                className="
                  h-8 sm:h-10 w-auto object-contain
                  filter grayscale transition duration-300 ease-in-out
                  group-hover:grayscale-50
                  dark:brightness-75 dark:group-hover:brightness-50
                "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}