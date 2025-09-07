import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useNavigate, useLocation } from "react-router";

// Add mock current user skills
const mySkills = [
  "React",
  "UI/UX Design",
  "Figma",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "HTML/CSS",
  "Project Management",
  "Agile/Scrum",
  "Business Analysis",
  "SEO",
  "Copywriting",
  "Data Analysis",
  "Machine Learning",
  "AutoCAD",
  "Adobe Photoshop",
  "Public Speaking",
  "Team Leadership",
  "Vue.js",
  "Django",
  "Flutter",
  "C++",
  "Go",
  "Ruby",
];

function SwapRequestModal({
  open,
  onClose,
  wantedSkills,
  offeredSkills,
  selectedUser,
}) {
  const [formData, setFormData] = useState({
    offeredSkill: "",
    wantedSkill: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.offeredSkill || !formData.wantedSkill) {
      setError("Please select both skills");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) {
        setError("You must be logged in to send swap requests");
        return;
      }

      const response = await fetch("/api/swap-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_user_id: parseInt(currentUserId),
          to_user_id: selectedUser.id,
          offered_skill: formData.offeredSkill,
          wanted_skill: formData.wantedSkill,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send swap request");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ offeredSkill: "", wantedSkill: "", message: "" });
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({ offeredSkill: "", wantedSkill: "", message: "" });
      setError("");
      setSuccess(false);
    }
  };

  if (!open) return null;

  const selectStyle = {
    width: "100%",
    background: "#23272a",
    color: "white",
    border: "2px solid white",
    borderRadius: 8,
    padding: "10px 36px 10px 10px",
    fontSize: 16,
    appearance: "none",
    fontFamily: "inherit",
    outline: "none",
  };

  const optionStyle = {
    background: "#23272a",
    color: "white",
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "#18191a",
          color: "white",
          borderRadius: 16,
          maxWidth: 350,
          margin: "60px auto",
          padding: 24,
          border: "2px solid white",
          fontFamily: "Comic Sans MS, Comic Sans, Chalkboard, cursive",
          boxShadow: "0 4px 32px #000a",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            color: "white",
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ marginBottom: 8 }}>Request Sent!</h3>
            <p>Your swap request has been sent to {selectedUser?.name}</p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 16, textAlign: "center" }}>
              Send Swap Request to {selectedUser?.name}
            </h3>

            {error && (
              <div
                style={{
                  background: "#ff4444",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}

            <label style={{ marginBottom: 2 }}>
              Choose one of your offered skills
            </label>
            <div style={{ position: "relative" }}>
              <select
                style={selectStyle}
                value={formData.offeredSkill}
                onChange={(e) =>
                  setFormData({ ...formData, offeredSkill: e.target.value })
                }
                required
              >
                <option value="">Select a skill you can offer</option>
                {offeredSkills.map((skill) => (
                  <option key={skill} style={optionStyle} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "white",
                  fontSize: 22,
                }}
              >
                &#9660;
              </span>
            </div>

            <label style={{ marginBottom: 2 }}>
              Choose one of their wanted skills
            </label>
            <div style={{ position: "relative" }}>
              <select
                style={selectStyle}
                value={formData.wantedSkill}
                onChange={(e) =>
                  setFormData({ ...formData, wantedSkill: e.target.value })
                }
                required
              >
                <option value="">Select a skill you want to learn</option>
                {wantedSkills.map((skill) => (
                  <option key={skill} style={optionStyle} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "white",
                  fontSize: 22,
                }}
              >
                &#9660;
              </span>
            </div>

            <label style={{ marginBottom: 2 }}>Message (optional)</label>
            <textarea
              style={{
                width: "100%",
                minHeight: 80,
                background: "transparent",
                color: "white",
                border: "2px solid white",
                borderRadius: 16,
                padding: 10,
                fontSize: 16,
                fontFamily: "inherit",
                outline: "none",
                resize: "none",
              }}
              placeholder="Add a personal message..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={loading || undefined}
              style={{
                margin: "0 auto",
                marginTop: 10,
                background: loading ? "#666" : "#234",
                color: "white",
                border: "2px solid white",
                borderRadius: 8,
                padding: "8px 32px",
                fontSize: 18,
                fontFamily: "inherit",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedUser = location.state?.selectedUser;

  const [activeTab, setActiveTab] = useState("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [acceptedSwapRequestId, setAcceptedSwapRequestId] = useState(null);
  const [checkingConnection, setCheckingConnection] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    // Check for accepted swap request between current user and selected user
    const checkConnection = async () => {
      if (!currentUserId || !selectedUser?.id) return;
      setCheckingConnection(true);
      try {
        // Check both sent and received
        const sentRes = await fetch(`/api/swap-requests/sent/${currentUserId}`);
        const receivedRes = await fetch(`/api/swap-requests/received/${currentUserId}`);
        let sent = [],
          received = [];
        if (sentRes.ok) sent = await sentRes.json();
        if (receivedRes.ok) received = await receivedRes.json();
        // Find accepted swap request between the two users
        const accepted = [...sent, ...received].find(
          (r) =>
            r.status === "accepted" &&
            ((r.from_user_id == currentUserId &&
              r.to_user_id == selectedUser.id) ||
              (r.from_user_id == selectedUser.id &&
                r.to_user_id == currentUserId)),
        );
        setAcceptedSwapRequestId(accepted ? accepted.id : null);
      } catch (err) {
        setAcceptedSwapRequestId(null);
      } finally {
        setCheckingConnection(false);
      }
    };
    checkConnection();
  }, [currentUserId, selectedUser]);

  const tabsRef = useRef(null);
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["#000000", "#374151", "#6b7280"],
  );

  const profileData = {
    name: selectedUser?.name || "Alexandra Chen",
    title: "Senior UX/UI Designer & Frontend Developer",
    location: "San Francisco, CA",
    email: "alexandra.chen@email.com",
    phone: "+1 (555) 123-4567",
    joinDate: "March 2022",
    bio: "Passionate designer and developer with 8+ years of experience creating beautiful, user-centered digital experiences. I specialize in bridging the gap between design and development, ensuring pixel-perfect implementations that delight users.",
    avatar: selectedUser?.avatar || "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=300&width=800",
    stats: {
      projects: 47,
      followers: 1234,
      following: 567,
      likes: 8901,
    },
    skills: {
      design: [
        { name: "UI/UX Design", level: 95 },
        { name: "Figma", level: 90 },
        { name: "Adobe Creative Suite", level: 85 },
        { name: "Prototyping", level: 88 },
      ],
      development: [
        { name: "React", level: 92 },
        { name: "TypeScript", level: 88 },
        { name: "Next.js", level: 85 },
        { name: "Tailwind CSS", level: 90 },
      ],
    },
    experience: [
      {
        company: "TechCorp Inc.",
        position: "Senior UX Designer",
        duration: "2022 - Present",
        description:
          "Leading design initiatives for enterprise SaaS products, managing a team of 4 designers.",
      },
      {
        company: "StartupXYZ",
        position: "Product Designer",
        duration: "2020 - 2022",
        description:
          "Designed and developed the complete user experience for a fintech mobile application.",
      },
      {
        company: "Design Studio",
        position: "UI Designer",
        duration: "2018 - 2020",
        description:
          "Created beautiful interfaces for various client projects across different industries.",
      },
    ],
    projects: [
      {
        title: "E-commerce Dashboard",
        description:
          "Complete redesign of admin dashboard with 40% improvement in user efficiency",
        image: "/placeholder.svg?height=200&width=300",
        tags: ["UI/UX", "React", "Analytics"],
      },
      {
        title: "Mobile Banking App",
        description:
          "Fintech mobile app serving 100K+ users with seamless transaction experience",
        image: "/placeholder.svg?height=200&width=300",
        tags: ["Mobile", "Fintech", "UX Research"],
      },
      {
        title: "Design System",
        description:
          "Comprehensive design system adopted across 15+ products in the organization",
        image: "/placeholder.svg?height=200&width=300",
        tags: ["Design System", "Components", "Documentation"],
      },
    ],
    achievements: [
      {
        title: "Design Excellence Award",
        year: "2023",
        organization: "TechCorp",
      },
      {
        title: "Best Mobile App Design",
        year: "2022",
        organization: "Design Awards",
      },
      {
        title: "Innovation in UX",
        year: "2021",
        organization: "UX Conference",
      },
    ],
    socialLinks: {
      github: "https://github.com/alexandra-chen",
      linkedin: "https://linkedin.com/in/alexandra-chen",
      twitter: "https://twitter.com/alexandra_chen",
      website: "https://alexandrachen.design",
    },
  };

  const tabs = ["overview", "projects", "experience", "skills"];

  // Use selected user's wanted skills or fallback to default
  const wantedSkills = selectedUser?.skillsWanted || [
    ...profileData.skills.design.map((s) => s.name),
    ...profileData.skills.development.map((s) => s.name),
    "Project Management",
    "Agile/Scrum",
    "User Research",
    "Prototyping",
    "Design Systems",
    "Version Control",
    "API Integration",
    "Business Analysis",
    "SEO",
    "Copywriting",
    "Data Analysis",
    "Machine Learning",
    "AutoCAD",
    "Adobe Photoshop",
    "Public Speaking",
    "Team Leadership",
    "Vue.js",
    "Django",
    "Flutter",
    "C++",
    "Go",
    "Ruby",
  ];

  // Touch handlers for tab swiping
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    const currentIndex = tabs.indexOf(activeTab);

    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
    if (isRightSwipe && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Project carousel swipe handlers
  const handleProjectSwipe = (direction) => {
    if (
      direction === "left" &&
      currentProjectIndex < profileData.projects.length - 1
    ) {
      setCurrentProjectIndex(currentProjectIndex + 1);
    }
    if (direction === "right" && currentProjectIndex > 0) {
      setCurrentProjectIndex(currentProjectIndex - 1);
    }
  };

  const handlePanEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      handleProjectSwipe("right");
    } else if (info.offset.x < -threshold) {
      handleProjectSwipe("left");
    }
  };

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
    <div className="min-h-screen bg-white text-black">
      <SwapRequestModal
        open={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        wantedSkills={wantedSkills}
        offeredSkills={mySkills}
        selectedUser={selectedUser}
      />
      {/* Mobile Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200 bg-white/80"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-black">
                {selectedUser?.name || "Profile"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSwapModalOpen(true)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Connect
              </button>
              <button
                onClick={() => {
                  if (acceptedSwapRequestId) {
                    navigate(`/chat/${acceptedSwapRequestId}`);
                  } else {
                    alert(
                      "You don't have an active swap request with this user.",
                    );
                  }
                }}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Message
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-6"
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full border-4 border-white"></div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-black">
                  {profileData.name}
                </h1>
                <p className="text-lg mb-4 text-gray-600">
                  {profileData.title}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {profileData.stats.projects}
                    </div>
                    <div className="text-sm text-gray-600">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {profileData.stats.followers}
                    </div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {profileData.stats.likes}
                    </div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="rounded-xl p-1 bg-white border border-gray-200 shadow-lg">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                    activeTab === tab
                      ? "bg-black text-white shadow-lg"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
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
            className="touch-pan-y"
          >
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* About */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-xl p-6 bg-white border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      About
                    </h3>
                    <p className="leading-relaxed text-gray-700">
                      {profileData.bio}
                    </p>
                  </div>

                  {/* Featured Projects */}
                  <div className="rounded-xl p-6 bg-white border border-gray-200 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                        />
                      </svg>
                      Featured Projects
                    </h3>
                    <div className="grid gap-4">
                      {profileData.projects
                        .slice(0, 2)
                        .map((project, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
                          >
                            <div className="flex gap-4">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-black">
                                  {project.title}
                                </h4>
                                <p className="text-sm mt-1 text-gray-600">
                                  {project.description}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  {project.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="rounded-xl p-6 bg-white border border-gray-200 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-black">
                      Contact
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm truncate">
                          {profileData.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-sm">{profileData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm">{profileData.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="rounded-xl p-6 bg-white border border-gray-200 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-black">
                      Social
                    </h3>
                    <div className="flex gap-3">
                      {Object.entries(profileData.socialLinks).map(
                        ([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg transition-all duration-300 hover:scale-110 bg-gray-100 hover:bg-gray-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {platform === "github" && (
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              )}
                              {platform === "linkedin" && (
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              )}
                              {platform === "twitter" && (
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                              )}
                              {platform === "website" && (
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                              )}
                            </svg>
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="rounded-xl p-6 bg-white border border-gray-200 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-black">
                  All Projects
                </h3>
                <div className="grid gap-6">
                  {profileData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-xl border border-gray-200 bg-gray-50 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full md:w-48 h-32 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold mb-2 text-black">
                            {project.title}
                          </h4>
                          <p className="mb-4 text-gray-600">
                            {project.description}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="rounded-xl p-6 bg-white border border-gray-200 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-black flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                  Work Experience
                </h3>
                <div className="space-y-6">
                  {profileData.experience.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative p-6 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white transition-all duration-300 hover:shadow-xl hover:border-gray-300 hover:scale-[1.02]"
                    >
                      {/* Timeline indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-black via-gray-600 to-gray-300 rounded-r-full"></div>

                      {/* Company logo placeholder */}
                      <div className="absolute right-6 top-6 w-12 h-12 bg-black rounded-lg flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>

                      <div className="pl-6 pr-16">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-bold text-black group-hover:text-gray-800 transition-colors">
                            {exp.position}
                          </h4>
                          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {exp.duration}
                          </span>
                        </div>
                        <h5 className="text-lg font-semibold mb-3 text-black flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          {exp.company}
                        </h5>
                        <p className="text-gray-600 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Achievement badges */}
                        <div className="mt-4 flex gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black text-white">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Professional
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Full-time
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="rounded-xl p-6 bg-white border border-gray-200 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-black flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Skills & Expertise
                </h3>

                {/* Skills Overview */}
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="text-lg font-semibold mb-4 text-black">
                    Skills Overview
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-black mb-1">
                        {profileData.skills.design.length}
                      </div>
                      <div className="text-sm text-gray-600">Design Skills</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-black mb-1">
                        {profileData.skills.development.length}
                      </div>
                      <div className="text-sm text-gray-600">Dev Skills</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-black mb-1">
                        8+
                      </div>
                      <div className="text-sm text-gray-600">Years Exp</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-black mb-1">
                        95%
                      </div>
                      <div className="text-sm text-gray-600">Avg Level</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Design Skills */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-black">
                        Design Skills
                      </h4>
                    </div>
                    <div className="space-y-4">
                      {profileData.skills.design.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                              {skill.name}
                            </span>
                            <span className="text-sm font-bold text-black bg-gray-100 px-2 py-1 rounded-full">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="relative">
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-black to-gray-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            </div>
                            {/* Skill level indicator */}
                            <div className="absolute -top-1 right-0 w-2 h-5 bg-black rounded-full transform translate-x-1"></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Development Skills */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-black">
                        Development Skills
                      </h4>
                    </div>
                    <div className="space-y-4">
                      {profileData.skills.development.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                              {skill.name}
                            </span>
                            <span className="text-sm font-bold text-black bg-gray-100 px-2 py-1 rounded-full">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="relative">
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-gray-800 to-gray-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            </div>
                            {/* Skill level indicator */}
                            <div className="absolute -top-1 right-0 w-2 h-5 bg-gray-800 rounded-full transform translate-x-1"></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Skills */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <h4 className="text-lg font-semibold mb-4 text-black">
                    Additional Skills
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Project Management",
                      "Team Leadership",
                      "Agile/Scrum",
                      "User Research",
                      "Prototyping",
                      "Design Systems",
                      "Version Control",
                      "API Integration",
                    ].map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                      >
                        <svg
                          className="w-3 h-3 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
