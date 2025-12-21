import { Facebook, Instagram, Linkedin, Minus, Plus, Star, Twitter } from 'lucide-react';
import React from 'react';
import Container from '@/components/ui/Container';

function TeamSection() {
  const teamMembers = [
    {
      name: "Yevhen Oleksiy",
      position: "Blockchain Architect",
      image: "https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male8_iodxvm.png",
      socials: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      name: "Pavlo Fedor",
      position: "Founder & CEO",
      image: "https://res.cloudinary.com/skyrev/image/upload/v1692613791/bungalion/avatars/female7_lrelgs.png",
      socials: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      name: "Serhii Anatolii",
      position: "Marketing Manger",
      image: "https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male6_wqwcnu.png",
      socials: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      name: "Ivan Petrov",
      position: "Blockchain Engineer",
      image: "https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male5_g1j5oi.png",
      socials: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        instagram: "#"
      }
    }
  ];

  return (
    <div className="py-20 bg-background">
      <Container>
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Meet Our Dynamic Team
        </h2>
        <div className="flex items-center justify-center my-4">
          <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-primary/20"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="group relative">
              <div className="absolute top-0 left-0 w-20 h-20 bg-primary z-10" style={{
                clipPath: "polygon(0 0, 0% 100%, 100% 0)"
              }}></div>
              
              <div className="bg-card border border-border relative" style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 86%, 86% 100%, 0% 100%, 0% 0%)",
                  borderRadius: "24px"
                }}>
                <div className="absolute top-4 right-4 flex items-center text-foreground z-20">
                  <Star className="w-5 h-5 text-primary fill-primary mr-1" />
                  <span className="text-lg">5.0</span>
                </div>
                
                <div className="p-6 pb-0">
                  <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4 border-4 border-border">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-lg text-muted-foreground mb-4">{member.position}</p>
                  
                  <div className="group/social mb-4">
                    <div className="flex justify-center items-center gap-2 opacity-0 scale-95 group-hover/social:opacity-100 group-hover/social:scale-100 transition-all duration-300 ease-in-out mb-2 h-10">
                      <a href={member.socials.twitter} className="w-10 h-10 rounded-full flex items-center justify-center text-foreground border border-border transform transition-all duration-200 hover:scale-110 hover:bg-primary hover:border-primary hover:text-white">
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a href={member.socials.facebook} className="w-10 h-10 rounded-full flex items-center justify-center text-foreground border border-border transform transition-all duration-200 hover:scale-110 hover:bg-primary hover:border-primary hover:text-white">
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a href={member.socials.instagram} className="w-10 h-10 rounded-full flex items-center justify-center text-foreground border border-border transform transition-all duration-200 hover:scale-110 hover:bg-primary hover:border-primary hover:text-white">
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a href={member.socials.linkedin} className="w-10 h-10 rounded-full flex items-center justify-center text-foreground border border-border transform transition-all duration-200 hover:scale-110 hover:bg-primary hover:border-primary hover:text-white">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-foreground border border-border group-hover/social:bg-primary group-hover/social:text-white cursor-pointer transition-all duration-300">
                        <Plus className="w-5 h-5 block group-hover/social:hidden transition-opacity duration-200" />
                        <Minus className="w-5 h-5 hidden group-hover/social:block transition-opacity duration-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default TeamSection;


