import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import {
  User,
  Edit3,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Star,
  Award,
  Code,
  Palette,
  ArrowLeft,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Briefcase,
  TrendingUp,
} from "lucide-react";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    joinDate: "",
    bio: "",
    avatar: "",
    coverImage: "",
    stats: {
      projects: 0,
      followers: 0,
      following: 0,
      likes: 0,
    },
    skills: { design: [], development: [] },
    experience: [],
    projects: [],
    achievements: [],
    socialLinks: {},
  });

  // Mouse tracking for interactive elements
  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const fetchUserData = () => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      navigate("/login");
      return;
    }

    setIsLoading(true);

    // Fetch current user's basic data
    fetch(`/api/users/${currentUserId}`)
      .then((res) => res.json())
      .then((userData) => {
        if (userData) {
          setProfileData((prevDefault) => ({
            ...prevDefault,
            name: userData.name || "Your Name",
            email: userData.email || "your@email.com",
          }));

          // Fetch detailed profile data
          return fetch(
            `/api/users/${currentUserId}/profile`,
          );
        }
      })
      .then((res) => {
        if (res) {
          return res.json();
        }
      })
      .then((profileData) => {
        if (profileData) {
          setProfileData((prevDefault) => {
            const updatedData = {
              ...prevDefault,
              ...profileData,
              stats: { ...prevDefault.stats, ...(profileData.stats || {}) },
              skills: { ...prevDefault.skills, ...(profileData.skills || {}) },
              experience: Array.isArray(profileData.experience)
                ? profileData.experience
                : prevDefault.experience,
              projects: Array.isArray(profileData.projects)
                ? profileData.projects
                : prevDefault.projects,
              achievements: Array.isArray(profileData.achievements)
                ? profileData.achievements
                : prevDefault.achievements,
              socialLinks: {
                ...prevDefault.socialLinks,
                ...(profileData.socialLinks || {}),
              },
            };
            return updatedData;
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        navigate("/login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate, location.pathname, refreshKey]);

  useEffect(() => {
    const handleFocus = () => {
      fetchUserData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    const isReturningFromEdit = sessionStorage.getItem("returningFromEdit");
    if (isReturningFromEdit) {
      setRefreshKey((prev) => prev + 1);
      sessionStorage.removeItem("returningFromEdit");
    }
  }, []);

  const tabs = ["overview", "projects", "experience", "skills"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-16 h-16 border-4 border-black border-t-transparent rounded-full mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium text-gray-600"
          >
            Loading your profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      onMouseMove={handleMouseMove}
    >
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/20 bg-white/70"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-xl bg-white/80 hover:bg-white shadow-md transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-500">
                  Manage your professional presence
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/edit")}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8 max-w-6xl"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="relative mb-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-900 p-8 md:p-12">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Profile Avatar */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 p-1 bg-gradient-to-r from-blue-500 to-purple-600">
                  <img
                    src={
                      profileData.avatar ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={profileData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Profile Info */}
              <div className="text-center md:text-left flex-1">
                <motion.h1
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {profileData.name}
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-300 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {profileData.title || "Professional"}
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-400 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {profileData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.joinDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profileData.joinDate}</span>
                    </div>
                  )}
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="flex flex-wrap gap-6 justify-center md:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {[
                    {
                      label: "Projects",
                      value: profileData.stats.projects,
                      icon: Briefcase,
                    },
                    {
                      label: "Followers",
                      value: profileData.stats.followers,
                      icon: User,
                    },
                    {
                      label: "Likes",
                      value: profileData.stats.likes,
                      icon: Star,
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <stat.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex relative">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 rounded-xl relative ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-black rounded-xl shadow-lg"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 capitalize">{tab}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* About & Bio */}
                <div className="lg:col-span-2 space-y-8">
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        About Me
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {profileData.bio ||
                        "No bio available yet. Click 'Edit Profile' to add your story."}
                    </p>
                  </motion.div>

                  {/* Featured Projects */}
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Featured Projects
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {profileData.bio ||
                          "No Featured projects yet. Click 'Edit Profile' to add your milestones."}
                      </p>
                    </div>
                    <div className="grid gap-6">
                      {profileData.projects
                        .slice(0, 2)
                        .map((project, index) => (
                          <motion.div
                            key={index}
                            className="group p-6 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.02, y: -5 }}
                          >
                            <div className="flex gap-6">
                              <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                <Code className="w-8 h-8 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                  {project.title}
                                </h4>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                  {project.description}
                                </p>
                                <div className="flex gap-2">
                                  {project.tags?.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 font-medium"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Contact Info */}
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Contact Info
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: Mail,
                          label: "Email",
                          value: profileData.email,
                        },
                        {
                          icon: Phone,
                          label: "Phone",
                          value: profileData.phone,
                        },
                        {
                          icon: MapPin,
                          label: "Location",
                          value: profileData.location,
                        },
                      ]
                        .filter((item) => item.value)
                        .map((item, index) => (
                          <motion.div
                            key={item.label}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">
                                {item.label}
                              </div>
                              <div className="font-medium text-gray-900">
                                {item.value}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>

                  {/* Social Links */}
                  {Object.keys(profileData.socialLinks).length > 0 && (
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Social Links
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(profileData.socialLinks).map(
                          ([platform, url]) => {
                            const icons = {
                              github: Github,
                              linkedin: Linkedin,
                              twitter: Twitter,
                              website: Globe,
                            };
                            const Icon = icons[platform] || ExternalLink;

                            return (
                              <motion.a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Icon className="w-5 h-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {platform}
                                </span>
                              </motion.a>
                            );
                          },
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    All Projects
                  </h3>
                </div>
                <div className="grid gap-8">
                  {profileData.projects.length > 0 ? (
                    profileData.projects.map((project, index) => (
                      <motion.div
                        key={index}
                        className="group p-8 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <div className="flex flex-col lg:flex-row gap-8">
                          <div className="w-full lg:w-64 h-48 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <Code className="w-16 h-16 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                              {project.title}
                            </h4>
                            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                              {project.description}
                            </p>
                            <div className="flex gap-3 flex-wrap">
                              {project.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">
                        No projects added yet.
                      </p>
                      <p className="text-gray-400">
                        Add your first project by editing your profile!
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "experience" && (
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Work Experience
                  </h3>
                </div>
                <div className="space-y-8">
                  {profileData.experience.length > 0 ? (
                    profileData.experience.map((exp, index) => (
                      <motion.div
                        key={index}
                        className="relative pl-8 pb-8 last:pb-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Timeline */}
                        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                        <div className="absolute left-[-8px] top-2 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg" />

                        <motion.div
                          className="group p-6 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:shadow-xl transition-all duration-300"
                          whileHover={{ scale: 1.02, x: 10 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {exp.position}
                              </h4>
                              <p className="text-lg font-semibold text-gray-700 mt-1">
                                {exp.company}
                              </p>
                            </div>
                            <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                              {exp.duration}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {exp.description}
                          </p>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">
                        No experience added yet.
                      </p>
                      <p className="text-gray-400">
                        Add your work experience by editing your profile!
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Skills & Expertise
                  </h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Design Skills */}
                  {profileData.skills.design.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Palette className="w-6 h-6 text-pink-500" />
                        <h4 className="text-2xl font-bold text-gray-900">
                          Design Skills
                        </h4>
                      </div>
                      <div className="space-y-6">
                        {profileData.skills.design.map((skill, index) => (
                          <motion.div
                            key={index}
                            className="space-y-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-700">
                                {skill.name}
                              </span>
                              <span className="text-sm font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                                {skill.level}%
                              </span>
                            </div>
                            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Development Skills */}
                  {profileData.skills.development.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Code className="w-6 h-6 text-blue-500" />
                        <h4 className="text-2xl font-bold text-gray-900">
                          Development Skills
                        </h4>
                      </div>
                      <div className="space-y-6">
                        {profileData.skills.development.map((skill, index) => (
                          <motion.div
                            key={index}
                            className="space-y-3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-700">
                                {skill.name}
                              </span>
                              <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                {skill.level}%
                              </span>
                            </div>
                            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {profileData.skills.design.length === 0 &&
                  profileData.skills.development.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">
                        No skills added yet.
                      </p>
                      <p className="text-gray-400">
                        Add your skills by editing your profile!
                      </p>
                    </div>
                  )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
