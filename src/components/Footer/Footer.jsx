import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Send,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Home', path: '/' },
      { name: 'How it Works', path: '/how-it-works' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact Us', path: '/about/contact' },
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1DVqEK2ZWV/?mibextid=wwXIfr', label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    { icon: Youtube, href: 'https://www.youtube.com/@EthioHope-z4r', label: 'YouTube', color: 'hover:bg-[#FF0000]' },
    { icon: MessageCircle, href: 'https://chat.whatsapp.com/FPdx6wKCWjGFag52lo5PGi', label: 'WhatsApp', color: 'hover:bg-[#25D366]' },
  ];

  return (
    <footer className="relative bg-[#FAFBFF] pt-24 pb-12 overflow-hidden border-t border-blue-50/50">
      {/* Premium Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/20 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-100/10 rounded-full blur-[100px]"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          
          {/* Brand Section - Left */}
          <div className="space-y-8 flex flex-col items-start text-left">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                <span className="text-white font-black text-xl">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-gray-900 leading-none">
                  Ethiohope
                </span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[2px] mt-1">Academy</span>
              </div>
            </div>
            
            <p className="text-gray-500 leading-relaxed text-base max-w-[280px]">
              Empowering the next generation of innovators through premium coding education and a supportive global community.
            </p>

            <div className="flex items-center space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-white border border-gray-100 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links - Center */}
          <div className="flex flex-col items-center">
            <div className="text-left md:text-center">
              <h3 className="text-gray-900 font-extrabold text-lg mb-8 relative inline-block">
                Platform
                <span className="absolute -bottom-2 left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-full"></span>
              </h3>
              <ul className="space-y-5">
                {footerLinks.platform.map((link, index) => (
                  <li key={index} className="flex md:justify-center">
                    <Link 
                      to={link.path} 
                      className="text-gray-500 hover:text-blue-600 transition-all duration-300 text-[15px] font-medium flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-600" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Newsletter - Right */}
          <div className="space-y-10 flex flex-col items-start md:items-end">
            <div className="text-left md:text-right w-full">
              <h3 className="text-gray-900 font-extrabold text-lg mb-8 relative inline-block">
                Connect With Us
                <span className="absolute -bottom-2 left-0 md:right-0 w-8 h-[3px] bg-blue-600 rounded-full"></span>
              </h3>
              <div className="space-y-5">
                <div className="flex items-center md:justify-end space-x-3 text-[15px] text-gray-500 group cursor-pointer hover:text-blue-600 transition-colors">
                  <span className="font-medium order-2 md:order-1">USA</span>
                  <MapPin size={18} className="text-blue-500 shrink-0 order-1 md:order-2" />
                </div>
                <div className="flex items-center md:justify-end space-x-3 text-[15px] text-gray-500 group cursor-pointer hover:text-blue-600 transition-colors">
                  <span className="font-medium order-2 md:order-1">+1 (945) 385-0556</span>
                  <Phone size={18} className="text-blue-500 shrink-0 order-1 md:order-2" />
                </div>
                <div className="flex items-center md:justify-end space-x-3 text-[15px] text-gray-500 group cursor-pointer hover:text-blue-600 transition-colors">
                  <span className="font-medium order-2 md:order-1">contact@ethiohope.com</span>
                  <Mail size={18} className="text-blue-500 shrink-0 order-1 md:order-2" />
                </div>
              </div>
            </div>
            

          </div>
        </div>

        {/* Refined Bottom Bar */}
        <div className="pt-10 border-t border-gray-100/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-1 text-gray-400 text-[13px] font-medium">
            <span>© {currentYear}</span>
            <span className="font-bold text-gray-900">Ethiohope</span>
            <span className="mx-2">•</span>
            <span>Built with</span>
            <span className="text-red-500 animate-pulse mx-1">❤️</span>
            <span>for the next generation of global innovators</span>
          </div>
          
          <div className="flex items-center space-x-8">
            <span className="text-[13px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 cursor-pointer hover:opacity-80 transition-opacity">
              Empowering Minds, Shaping Futures
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
