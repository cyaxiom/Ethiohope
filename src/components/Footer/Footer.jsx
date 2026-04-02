import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Home', path: '/' },
      { name: 'How it Works', path: '/how-it-works' },
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/about/teams' },
      { name: 'Services', path: '/services' },
    ],
    support: [
      { name: 'Contact Us', path: '/about/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Community', path: '/community' },
      { name: 'Help Center', path: '/help' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-[#1877F2]' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-[#1DA1F2]' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-[#E4405F]' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-[#FF0000]' },
  ];

  return (
    <footer className="relative bg-white pt-20 pb-10 overflow-hidden border-t border-gray-100">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-30"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 transition-transform hover:rotate-0 cursor-pointer">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900">
                Ethio<span className="text-primary">hope</span>
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base max-w-xs">
              Empowering the next generation of Ethiopian innovators through accessible coding education and community support.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3 }}
                  className={`p-2 rounded-lg bg-gray-50 text-gray-400 transition-colors ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-6">Platform</h3>
              <ul className="space-y-4">
                {footerLinks.platform.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-gray-500 hover:text-primary transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-4">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-gray-500 hover:text-primary transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-6">Connect With Us</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-sm text-gray-500">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <span>Addis Ababa, Ethiopia<br />Bole, Around Edna Mall</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Phone size={18} className="text-primary shrink-0" />
                  <span>+251 911 000 000</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Mail size={18} className="text-primary shrink-0" />
                  <span>hello@ethiohope.com</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h4 className="text-gray-900 font-bold text-sm mb-3">Subscribe to our News</h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button 
                  className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all shadow-sm active:scale-95"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Ethiohope. All rights reserved. Built with ❤️ for Ethiopia.
          </p>
          <div className="flex space-x-6">
            {footerLinks.legal.map((link, index) => (
              <Link 
                key={index} 
                to={link.path} 
                className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
