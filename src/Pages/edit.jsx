import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  X,
  Plus,
  Trash2,
  ArrowLeft,
  Briefcase,
  Award,
  Link as LinkIcon,
  Code,
  Palette,
  Edit3,
  Target,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Star,
} from "lucide-react";

const InputField = ({ label, icon: IconComponent, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconComponent
            className={`h-5 w-5 transition-colors duration-300 ${
              isFocused
                ? "text-blue-500"
                : error
                  ? "text-red-400"
                  : "text-gray-400"
            }`}
          />
        </div>
        <motion.input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-300
            focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500
            ${
              error
                ? "border-red-300 focus:border-red-500 bg-red-50"
                : isFocused
                  ? "border-blue-500 bg-white shadow-lg shadow-blue-100"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }
          `}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

const TextAreaField = ({ label, icon: IconComponent, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute top-3 left-3 pointer-events-none">
          <IconComponent
            className={`h-5 w-5 transition-colors duration-300 ${
              isFocused
                ? "text-blue-500"
                : error
                  ? "text-red-400"
                  : "text-gray-400"
            }`}
          />
        </div>
        <motion.textarea
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-300
            focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500 resize-none
            ${
              error
                ? "border-red-300 focus:border-red-500 bg-red-50"
                : isFocused
                  ? "border-blue-500 bg-white shadow-lg shadow-blue-100"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }
          `}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

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
    skills: {
      design: [],
      development: [],
    },
    experience: [],
    projects: [],
    achievements: [],
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
  });

  // Form states for adding new items
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 50,
    category: "design",
  });
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    duration: "",
    description: "",
  });
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    image: "",
    tags: [],
  });
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    year: "",
    organization: "",
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      navigate("/login");
      return;
    }

    // Fetch current user's data
    fetch(`http://localhost:4000/api/users/${currentUserId}`)
      .then((res) => res.json())
      .then((userData) => {
        if (userData) {
          setProfileData((prevDefault) => ({
            ...prevDefault,
            name: userData.name || "",
            email: userData.email || "",
          }));

          // Fetch detailed profile data
          return fetch(
            `http://localhost:4000/api/users/${currentUserId}/profile`,
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
      });
  }, [navigate]);

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setProfileData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [newSkill.category]: [
            ...prev.skills[newSkill.category],
            {
              name: newSkill.name.trim(),
              level: newSkill.level,
            },
          ],
        },
      }));
      setNewSkill({ name: "", level: 50, category: "design" });
    }
  };

  const removeSkill = (category, index) => {
    setProfileData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }));
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setProfileData((prev) => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience }],
      }));
      setNewExperience({
        company: "",
        position: "",
        duration: "",
        description: "",
      });
    }
  };

  const removeExperience = (index) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProfileData((prev) => ({
        ...prev,
        projects: [
          ...prev.projects,
          { ...newProject, tags: [...newProject.tags] },
        ],
      }));
      setNewProject({ title: "", description: "", image: "", tags: [] });
    }
  };

  const removeProject = (index) => {
    setProfileData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addProjectTag = () => {
    if (newTag.trim()) {
      setNewProject((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeProjectTag = (index) => {
    setNewProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.year) {
      setProfileData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, { ...newAchievement }],
      }));
      setNewAchievement({ title: "", year: "", organization: "" });
    }
  };

  const removeAchievement = (index) => {
    setProfileData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      alert("Please log in to save your profile!");
      navigate("/login");
      return;
    }

    setIsSaving(true);

    try {
      // Update user's basic info in users table
      const basicResponse = await fetch(
        `http://localhost:4000/api/users/${currentUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
          }),
        },
      );

      if (!basicResponse.ok) {
        const errorData = await basicResponse.json();
        throw new Error(
          `Basic info update failed: ${errorData.error || basicResponse.statusText}`,
        );
      }

      // Update user's detailed profile info
      const profileResponse = await fetch(
        `http://localhost:4000/api/users/${currentUserId}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: profileData.title,
            location: profileData.location,
            phone: profileData.phone,
            joinDate: profileData.joinDate,
            bio: profileData.bio,
            avatar: profileData.avatar,
            coverImage: profileData.coverImage,
            stats: profileData.stats,
            skills: profileData.skills,
            experience: profileData.experience,
            projects: profileData.projects,
            achievements: profileData.achievements,
            socialLinks: profileData.socialLinks,
          }),
        },
      );

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(
          `Profile update failed: ${errorData.error || profileResponse.statusText}`,
        );
      }

      // Success animation and navigation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      sessionStorage.setItem("returningFromEdit", "true");
      navigate("/profile");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert(`Failed to save profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    sessionStorage.setItem("returningFromEdit", "true");
    navigate("/profile");
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadToCloudinary(file);
        setProfileData((prev) => ({ ...prev, avatar: url }));
      } catch (err) {
        alert("Image upload failed!");
      }
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Target },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "social", label: "Social Links", icon: LinkIcon },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
                onClick={handleDiscard}
                className="p-2 rounded-xl bg-white/80 hover:bg-white shadow-md transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Edit Profile
                </h1>
                <p className="text-sm text-gray-500">
                  Update your professional information
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDiscard}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <X className="w-4 h-4 mr-2 inline" />
                Discard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isSaving || undefined}
                className={`px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 shadow-lg"
                } text-white`}
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.aside
            className="lg:w-80 space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Edit Sections
              </h3>
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-black text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            className="flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
              >
                {activeSection === "basic" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Basic Information
                        </h2>
                        <p className="text-gray-600">
                          Your personal and professional details
                        </p>
                      </div>
                    </div>

                    {/* Profile Photo */}
                    <div className="flex flex-col items-center space-y-4 mb-8">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-32 h-32 rounded-full border-4 border-gray-200 p-1 bg-gradient-to-r from-blue-500 to-purple-600">
                          <img
                            src={
                              profileData.avatar ||
                              "/placeholder.svg?height=200&width=200"
                            }
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleImageUpload}
                          className="absolute bottom-0 right-0 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white"
                        >
                          <Camera className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <p className="text-sm text-gray-500">
                        Click to change profile photo
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField
                        label="Full Name"
                        icon={User}
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your full name"
                      />
                      <InputField
                        label="Professional Title"
                        icon={Briefcase}
                        type="text"
                        value={profileData.title}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g., Senior Developer"
                      />
                      <InputField
                        label="Email"
                        icon={Mail}
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        placeholder="your.email@example.com"
                      />
                      <InputField
                        label="Phone"
                        icon={Phone}
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                      <InputField
                        label="Location"
                        icon={MapPin}
                        type="text"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            location: e.target.value,
                          })
                        }
                        placeholder="City, State/Country"
                      />
                      <InputField
                        label="Join Date"
                        icon={Calendar}
                        type="text"
                        value={profileData.joinDate}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            joinDate: e.target.value,
                          })
                        }
                        placeholder="e.g., March 2022"
                      />
                    </div>

                    <TextAreaField
                      label="Bio"
                      icon={Edit3}
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={4}
                      placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                    />
                  </div>
                )}

                {activeSection === "skills" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <Code className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Skills & Expertise
                        </h2>
                        <p className="text-gray-600">
                          Add your technical and creative skills
                        </p>
                      </div>
                    </div>

                    {/* Add New Skill */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Add New Skill
                      </h3>
                      <div className="grid md:grid-cols-4 gap-4">
                        <input
                          type="text"
                          placeholder="Skill name"
                          value={newSkill.name}
                          onChange={(e) =>
                            setNewSkill({ ...newSkill, name: e.target.value })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                        />
                        <select
                          value={newSkill.category}
                          onChange={(e) =>
                            setNewSkill({
                              ...newSkill,
                              category: e.target.value,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                        >
                          <option value="design">Design</option>
                          <option value="development">Development</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={newSkill.level}
                            onChange={(e) =>
                              setNewSkill({
                                ...newSkill,
                                level: parseInt(e.target.value),
                              })
                            }
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12">
                            {newSkill.level}%
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addSkill}
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Design Skills */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <Palette className="w-5 h-5 text-pink-500" />
                          <h3 className="text-xl font-bold text-gray-900">
                            Design Skills
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {profileData.skills.design.map((skill, index) => (
                            <motion.div
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg"
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                  {skill.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                                    {skill.level}%
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeSkill("design", index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Development Skills */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <Code className="w-5 h-5 text-blue-500" />
                          <h3 className="text-xl font-bold text-gray-900">
                            Development Skills
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {profileData.skills.development.map(
                            (skill, index) => (
                              <motion.div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg"
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">
                                    {skill.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                      {skill.level}%
                                    </span>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() =>
                                        removeSkill("development", index)
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${skill.level}%` }}
                                  />
                                </div>
                              </motion.div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "experience" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Work Experience
                        </h2>
                        <p className="text-gray-600">
                          Add your professional experience
                        </p>
                      </div>
                    </div>

                    {/* Current Experience */}
                    <div className="space-y-4">
                      {profileData.experience.map((exp, index) => (
                        <motion.div
                          key={index}
                          className="p-6 bg-gray-50 rounded-xl"
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {exp.position}
                              </h4>
                              <p className="text-gray-600">{exp.company}</p>
                              <p className="text-sm text-gray-500">
                                {exp.duration}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeExperience(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <p className="text-gray-700">{exp.description}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Add New Experience */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Add New Experience
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Company"
                          value={newExperience.company}
                          onChange={(e) =>
                            setNewExperience({
                              ...newExperience,
                              company: e.target.value,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={newExperience.position}
                          onChange={(e) =>
                            setNewExperience({
                              ...newExperience,
                              position: e.target.value,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 2022 - Present)"
                          value={newExperience.duration}
                          onChange={(e) =>
                            setNewExperience({
                              ...newExperience,
                              duration: e.target.value,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addExperience}
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Experience
                        </motion.button>
                      </div>
                      <textarea
                        placeholder="Description"
                        value={newExperience.description}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeSection === "projects" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Projects
                        </h2>
                        <p className="text-gray-600">Showcase your best work</p>
                      </div>
                    </div>

                    {/* Current Projects */}
                    <div className="space-y-6">
                      {profileData.projects.map((project, index) => (
                        <motion.div
                          key={index}
                          className="p-6 bg-gray-50 rounded-xl"
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {project.title}
                              </h4>
                              <p className="text-gray-600 mb-2">
                                {project.description}
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {project.tags?.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeProject(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Add New Project */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Add New Project
                      </h3>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={newProject.title}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                        />
                        <textarea
                          placeholder="Project Description"
                          value={newProject.description}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none resize-none"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && addProjectTag()
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addProjectTag}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Add Tag
                          </motion.button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {newProject.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full flex items-center gap-1"
                            >
                              {tag}
                              <button
                                onClick={() => removeProjectTag(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addProject}
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Project
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "achievements" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Achievements
                        </h2>
                        <p className="text-gray-600">
                          Highlight your accomplishments
                        </p>
                      </div>
                    </div>

                    {/* Current Achievements */}
                    <div className="space-y-4">
                      {profileData.achievements.map((achievement, index) => (
                        <motion.div
                          key={index}
                          className="p-6 bg-gray-50 rounded-xl"
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {achievement.title}
                              </h4>
                              <p className="text-gray-600">
                                {achievement.year} - {achievement.organization}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeAchievement(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Add New Achievement */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Add New Achievement
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Achievement Title"
                          value={newAchievement.title}
                          onChange={(e) =>
                            setNewAchievement({
                              ...newAchievement,
                              title: e.target.value,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          value={newAchievement.year}
                          onChange={(e) =>
                            setNewAchievement({
                              ...newAchievement,
                              year: e.target.value,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Organization"
                            value={newAchievement.organization}
                            onChange={(e) =>
                              setNewAchievement({
                                ...newAchievement,
                                organization: e.target.value,
                              })
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addAchievement}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "social" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <LinkIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Social Links
                        </h2>
                        <p className="text-gray-600">
                          Connect your social profiles
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField
                        label="GitHub"
                        icon={Github}
                        type="url"
                        value={profileData.socialLinks.github}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: {
                              ...profileData.socialLinks,
                              github: e.target.value,
                            },
                          })
                        }
                        placeholder="https://github.com/username"
                      />
                      <InputField
                        label="LinkedIn"
                        icon={Linkedin}
                        type="url"
                        value={profileData.socialLinks.linkedin}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: {
                              ...profileData.socialLinks,
                              linkedin: e.target.value,
                            },
                          })
                        }
                        placeholder="https://linkedin.com/in/username"
                      />
                      <InputField
                        label="Twitter"
                        icon={Twitter}
                        type="url"
                        value={profileData.socialLinks.twitter}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: {
                              ...profileData.socialLinks,
                              twitter: e.target.value,
                            },
                          })
                        }
                        placeholder="https://twitter.com/username"
                      />
                      <InputField
                        label="Website"
                        icon={Globe}
                        type="url"
                        value={profileData.socialLinks.website}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            socialLinks: {
                              ...profileData.socialLinks,
                              website: e.target.value,
                            },
                          })
                        }
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
