import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import {
  ChevronDown,
  Play,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Users,
  MessageSquare,
  Code,
  Rocket,
  Award,
  Coffee,
  Heart,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const words = ["Innovation", "Creativity"];
  const currentWord = words[currentWordIndex];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= currentWord.length) {
        setTypedText(currentWord.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }, 1000);
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [currentWordIndex, currentWord, words.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "Collaboration",
      description: "Collaboration that leads to Innovation",
      color: "text-black",
      illustration: "✨",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Lightning-fast experiences that captivate",
      color: "text-black",
      illustration: "⚡",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Exceptional protection that you can trust",
      color: "text-black",
      illustration: "🛡",
    },
  ];

  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden relative">
      <div
        className="fixed w-4 h-4 bg-black/10 rounded-full pointer-events-none z-50 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: "scale(1)",
        }}
      ></div>

      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="fixed pointer-events-none z-0"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationName: "float",
            animationDuration: `${element.duration}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${element.id * 0.5}s`,
          }}
        >
          <div
            className="bg-gray-100/30 rounded-full"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationName: "pulse",
              animationDuration: "2s",
              animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
              animationIterationCount: "infinite",
            }}
          ></div>
        </div>
      ))}

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-gray-100/50 to-gray-50/50 animate-pulse"></div>

        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 100 100"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="black"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>

        <div
          className="absolute top-20 left-20 w-32 h-32 border-2 border-gray-200 rounded-lg transform rotate-12 opacity-20"
          style={{
            animationName: "spin",
            animationDuration: "20s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 border-2 border-gray-300 rounded-full opacity-20"
          style={{
            animationName: "bounce",
            animationDuration: "1s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-28 h-28 border-2 border-gray-200 transform rotate-45 opacity-20"
          style={{
            animationName: "pulse",
            animationDuration: "2s",
            animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
            animationIterationCount: "infinite",
          }}
        ></div>
      </div>

      <nav className="relative z-50 p-6 animate-fadeInDown">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 cursor-pointer">
            NEXUS
          </div>
          <div className="hidden md:flex space-x-8">
            {["Home", "About", "FAQ", "Contact"].map((item, index) => (
              <a
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-gray-600 hover:text-black transition-all duration-300 relative group transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-gray-700 group-hover:w-full transition-all duration-300"></div>
                <div className="absolute -inset-2 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </a>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2 rounded-full hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center">
            <div className="relative mb-8">
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent animate-fadeInUp"
                style={{
                  transform: `translateY(${scrollY * 0.3}px)`,
                }}
              >
                NEXUS
              </h1>

              <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-gray-300 rounded-full animate-ping opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gray-400 rounded-full animate-bounce opacity-60"></div>
              <div
                className="absolute top-1/2 -right-8 w-4 h-4 border-2 border-gray-400 transform rotate-45 animate-spin opacity-60"
                style={{ animationDuration: "3s" }}
              ></div>
            </div>

            <div
              className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeInUp"
              style={{
                transform: `translateY(${scrollY * 0.2}px)`,
                animationDelay: "0.3s",
              }}
            >
              Where{" "}
              <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent font-semibold relative">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>{" "}
              meets{" "}
              <span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent font-semibold">
                excellence
              </span>
              . Crafting upskilling technologies that transform possibilities
              into reality.
            </div>

            <div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fadeInUp"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                animationDelay: "0.6s",
              }}
            >
              <button
                onClick={() => navigate("/dashboard")}
                className="group bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-gray-900 hover:to-black transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-2xl relative overflow-hidden"
              >
                <span className="flex items-center space-x-2 relative z-10">
                  <span>Start Your Journey</span>
                  <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>

            <div className="flex justify-center animate-bounce">
              <div className="relative">
                <ChevronDown className="w-8 h-8 text-gray-600 animate-bounce" />
                <div className="absolute inset-0 bg-gray-200 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto px-6 py-20"
          id="features"
          data-animate
        >
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.features
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Why Choose NEXUS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect blend of creativity, technology, and results
              that sets us apart.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm border border-gray-200 hover:border-gray-400 transition-all duration-500 transform hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer overflow-hidden ${
                  currentFeature === index
                    ? "ring-2 ring-gray-400 scale-105"
                    : ""
                }`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 via-gray-200/50 to-gray-100/50 animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                <div className="relative z-10">
                  <div className="relative mb-6">
                    <feature.icon className="w-12 h-12 text-black group-hover:scale-125 transition-all duration-500 group-hover:rotate-12" />
                    <div className="absolute -top-2 -right-2 text-2xl group-hover:animate-bounce">
                      {feature.illustration}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-gray-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>

                  <div className="w-0 h-1 bg-gradient-to-r from-black to-gray-700 group-hover:w-full transition-all duration-700 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20" id="stats" data-animate>
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center transition-all duration-1000 ${
              isVisible.stats
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {[
              { number: "500+", label: "Skills Swapped", icon: Rocket },
              { number: "10M+", label: "Users Reached", icon: Users },
              { number: "99.9%", label: "Uptime Guarantee", icon: Award },
              { number: "24/7", label: "Support Available", icon: Coffee },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <stat.icon className="w-8 h-8 text-black mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 group-hover:text-black transition-colors duration-300">
                    {stat.label}
                  </div>

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-xl transition-all duration-300"></div>

                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto px-6 py-20"
          id="services"
          data-animate
        >
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.services
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions designed to accelerate your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "Collab & Code",
                description:
                  "Collaborate & Code all together on a single platform",
                color: "from-gray-100 to-gray-200",
              },
              {
                icon: Globe,
                title: "Connect",
                description: "Connect & Network with people across globe ",
                color: "from-gray-50 to-gray-150",
              },
              {
                icon: MessageSquare,
                title: "Support",
                description:
                  "24/7 expert assistance to keep you moving forward",
                color: "from-gray-75 to-gray-175",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-400 transition-all duration-500 transform hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <service.icon className="w-12 h-12 text-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-gray-800 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {service.description}
                  </p>

                  <div className="mt-6 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-500"></div>
                </div>

                <div className="absolute top-4 right-4 w-2 h-2 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20" id="cta" data-animate>
          <div
            className={`text-center bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-3xl p-12 backdrop-blur-sm border border-gray-200 shadow-lg relative overflow-hidden transition-all duration-1000 ${
              isVisible.cta
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute top-8 left-8 w-16 h-16 border border-gray-300 rounded-full"
                style={{
                  animationName: "spin",
                  animationDuration: "10s",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                }}
              ></div>
              <div
                className="absolute bottom-8 right-8 w-12 h-12 bg-gray-200 rounded-full"
                style={{
                  animationName: "bounce",
                  animationDuration: "1s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: "1s",
                }}
              ></div>
              <div
                className="absolute top-1/2 left-1/4 w-8 h-8 border border-gray-400 transform rotate-45"
                style={{
                  animationName: "pulse",
                  animationDuration: "2s",
                  animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
                  animationIterationCount: "infinite",
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied users who have transformed their
                skills & expertise with NEXUS.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="group bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Start Your Upskilling Today</span>
                    <Rocket className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
