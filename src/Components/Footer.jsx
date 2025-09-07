import { useState } from "react";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const navigationLinks = [
    { name: "Home", href: "/", isActive: true },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" }
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      color: "hover:text-white",
      bgColor:
        "group-hover:bg-gradient-to-r group-hover:from-gray-700 group-hover:to-gray-600",
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
      color: "hover:text-white",
      bgColor: "group-hover:bg-gray-600",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
      color: "hover:text-white",
      bgColor: "group-hover:bg-gray-700",
    },
  ];

  const contactInfo = [
    { icon: Mail, text: "lakshyamishra099@gmail.com" },
    { icon: Phone, text: "+91- 8770222006" },
    { icon: MapPin, text: "Indore, Madhya Pradesh" },
  ];

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
          <div className="lg:col-span-1">
            <div className="group cursor-pointer">
              <h1 className="text-white md:text-5xl lg:text-6xl font-bold bg-black gap-8">
                NEXUS
              </h1>
              <div className="h-1 w-0 bg-gradient-to-r from-white to-gray-300 transition-all duration-500 group-hover:w-full mt-2"></div>
            </div>
            <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-md">
              Crafting digital experiences that inspire, engage, and transform
              your vision into reality.
            </p>
            <div className="mt-8 space-y-4">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group cursor-pointer"
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 lg:text-center">
            <nav className="space-y-4">
              {navigationLinks.map((link, index) => (
                <div key={index} className="relative group">
                  <a
                    href={link.href}
                    className={`block text-lg transition-all duration-300 ease-out transform hover:translate-x-2 hover:text-white relative overflow-hidden ${
                      link.isActive ? "text-white" : "text-gray-300"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <span className="relative z-10">{link.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></div>
                  </a>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Side - Social Media */}
          <div className="lg:col-span-1 lg:text-right">
            <h3 className="text-2xl font-semibold mb-8 text-white">
              Follow Us
            </h3>
            <div className="flex lg:justify-end justify-center space-x-4 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <div
                    className={`w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 ease-out transform group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden ${social.bgColor}`}
                  >
                    <social.icon
                      className={`w-6 h-6 text-gray-300 transition-all duration-300 group-hover:text-white group-hover:scale-110 ${social.color}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                  <div
                    className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      hoveredSocial === index
                        ? "translate-y-0"
                        : "translate-y-2"
                    }`}
                  >
                    {social.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="lg:text-right"></div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 NEXUS. All rights reserved. Crafted with ❤
            </div>
            <div className="flex space-x-6 text-sm"></div>
          </div>
        </div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-gray-900/5 to-black/5 animate-pulse"></div>
    </footer>
  );
};

export default Footer;
