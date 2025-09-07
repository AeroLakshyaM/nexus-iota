import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  MessageCircle,
  Briefcase,
  Zap,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Star,
  Trophy,
  Heart,
  Code,
  Palette,
  Server,
  Smartphone,
  Coffee,
  Terminal,
} from "lucide-react";

export default function About() {
  const [hoveredMember, setHoveredMember] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Skill Swapping",
      description:
        "Exchange your expertise with others in our community. Learn something new while teaching what you know best.",
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
      borderColor: "border-gray-200 hover:border-gray-400",
    },
    {
      icon: MessageCircle,
      title: "Chat Application",
      description:
        "Connect instantly with team members and collaborators through our integrated real-time messaging platform.",
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
      borderColor: "border-gray-200 hover:border-gray-400",
    },
    {
      icon: Briefcase,
      title: "Project Collaboration",
      description:
        "Work together on exciting projects with like-minded individuals from around the globe.",
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
      borderColor: "border-gray-200 hover:border-gray-400",
    },
    {
      icon: Zap,
      title: "Innovation Hub",
      description:
        "Turn your ideas into reality with our comprehensive suite of collaboration tools and resources.",
      color: "text-black",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
      borderColor: "border-gray-200 hover:border-gray-400",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Lasika Rathore",
      role: "Developer",
      bio: "Visionary and tech enthusiast aspiring towards innovation and team building.",
      skills: ["Leadership", "Strategy", "Front-End"],
      avatar: "",
      social: {
        github: "https://github.com/Lasika7",
        linkedin:
          "https://www.linkedin.com/in/lasika-rathore-85bab124b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        email: "lasika07082004@gmail.com",
      },
      achievements: [""],
    },
    {
      id: 2,
      name: "Lakshya Mishra",
      role: "Developer",
      bio: "Creative mastermind specializing in user experience and visual storytelling along with mastery over Front-End Design.",
      skills: ["Design Excellence", "Front-End", "Team Mentor"],
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      social: {
        github: "https://github.com/AeroLakshyaM",
        linkedin: "https://linkedin.com/in/lakshya-mishra-65275924b",
        email: "lakshyamishra099@gmail.com",
      },
      achievements: [""],
    },
    {
      id: 3,
      name: "Anugrah Sharma",
      role: "Developer",
      bio: "Backend as well as Front-End architecture expert passionate about scalable solutions and clean code.",
      skills: ["Backend", "FrontEnd", "Scalable Solutions"],
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      social: {
        github: "https://github.com/AnugrahAsh",
        linkedin: "https://www.linkedin.com/in/anu-g-rah/",
        email: "anuash130c@gmail.com",
      },
      achievements: [""],
    },
    {
      id: 4,
      name: "M. Raja Rao Reddy",
      role: "Developer",
      bio: "Strategic thinker who bridges the gap between vision and execution with precision.",
      skills: ["FrontEnd", "Team building", "Ideation"],

      social: {
        github: "https://github.com/cuzitsvicky",
        linkedin: "https://www.linkedin.com/in/m-raja-rao-reddy-91b49621b/",
        email: "vickyreddybro2004@gmail.com",
      },
      achievements: [""],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            NEXUS
          </div>
          <div className="hidden md:flex space-x-8">
            {["Home", "About", "FAQ", "Contact"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`transition-colors duration-300 relative group ${
                  item === "About"
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {item}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-gray-700 group-hover:w-full transition-all duration-300"></div>
              </a>
            ))}
          </div>
          <button className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2 rounded-full hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
            About NEXUS
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            We're building the future of collaboration where talents meet, ideas
            flourish, and innovation thrives. Welcome to a platform that
            transforms how people work together.
          </p>
        </div>

        <div className="mb-20">
          <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-3xl p-12 backdrop-blur-sm border border-gray-200 shadow-lg text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              To create a world where knowledge flows freely, skills are shared
              generously, and every person has the opportunity to learn, grow,
              and contribute to meaningful projects that make a difference.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform designed to connect, collaborate, and
              create together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl ${feature.bgColor} backdrop-blur-sm border ${feature.borderColor} transition-all duration-500 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 via-gray-200/50 to-gray-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <feature.icon
                    className={`w-12 h-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  />
                  <h3 className="text-2xl font-bold mb-4 text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind NEXUS, dedicated to building the
              future of collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:border-gray-400 transition-all duration-500 transform hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 via-gray-200/50 to-gray-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="relative mb-6">
                    <div
                      className={` ${
                        hoveredMember === member.id
                          ? "scale-110 bg-green-500"
                          : ""
                      }`}
                    ></div>
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {member.bio}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full group-hover:bg-gray-300 transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-center space-x-1">
                      {member.achievements.map((achievement, achIndex) => (
                        <div
                          key={achIndex}
                          className="group-hover:scale-110 transition-transform duration-300"
                          title={achievement}
                        >
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <a
                      href={member.social.github}
                      className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300 group-hover:scale-110 transform"
                    >
                      <Github className="w-4 h-4 text-white" />
                    </a>
                    <a
                      href={member.social.linkedin}
                      className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-300 group-hover:scale-110 transform"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                    <a
                      href={`mailto:${member.social.email}`}
                      className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 group-hover:scale-110 transform"
                    >
                      <Mail className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 ${
                    hoveredMember === member.id
                      ? "border-gray-400 shadow-lg"
                      : ""
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Our Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technologies to ensure scalability,
              performance, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { icon: Code, name: "Frontend", tech: "React & JavaScript" },
              {
                icon: Server,
                name: "Backend",
                tech: "Node.js & Express & MongoDB",
              },
              { icon: Palette, name: "Design", tech: "Tailwind CSS" },
              {
                icon: Terminal,
                name: "Code",
                tech: "Efficient & Better",
              },
              { icon: Coffee, name: "Performance", tech: "Optimized & Fast" },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 group-hover:border-gray-400 transition-all duration-300 group-hover:scale-110">
                  <item.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-semibold text-black mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.tech}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-3xl p-12 backdrop-blur-sm border border-gray-200 shadow-lg">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Ready to Join Us?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be part of a community that's reshaping how people collaborate,
              learn, and grow together.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
