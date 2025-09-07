import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Users,
  ArrowRight,
  Menu,
  X,
  Filter,
  RefreshCw,
  TrendingUp,
  Zap,
  Award,
  Calendar,
  Bell,
  User,
  MapPin,
  Clock,
  Target,
  Briefcase,
  ChevronDown,
  Plus,
  MessageSquare,
  Share2,
  BookOpen,
  Sparkles,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const availabilityOptions = ["All", "Available", "Busy", "Offline"];
const skillCategories = [
  "All",
  "Development",
  "Design",
  "Marketing",
  "Business",
  "Creative",
];

// Notification Badge Component
function SwapRequestBadge() {
  const [pendingCount, setPendingCount] = useState(0);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (currentUserId) {
      fetchPendingCount();
    }
  }, [currentUserId]);

  const fetchPendingCount = async () => {
    try {
      const response = await fetch(
        `/api/swap-requests/received/${currentUserId}`,
      );
      if (response.ok) {
        const requests = await response.json();
        const pending = requests.filter((r) => r.status === "pending").length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error("Error fetching pending count:", err);
    }
  };

  if (pendingCount === 0) return null;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
    >
      {pendingCount > 9 ? "9+" : pendingCount}
    </motion.span>
  );
}

// Chat Badge Component
function ChatBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (currentUserId) {
      fetchUnreadCount();
    }
  }, [currentUserId]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `/api/chat/user/${currentUserId}`,
      );
      if (response.ok) {
        const chats = await response.json();
        const totalUnread = chats.reduce(
          (sum, chat) => sum + (chat.unread_count || 0),
          0,
        );
        setUnreadCount(totalUnread);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  if (unreadCount === 0) return null;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
    >
      {unreadCount > 9 ? "9+" : unreadCount}
    </motion.span>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, trend, color = "blue" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </motion.div>
  );
}

// Quick Action Button Component
function QuickAction({
  title,
  description,
  icon: Icon,
  onClick,
  color = "black",
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-left"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 bg-${color} rounded-xl flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}

// Featured User Card Component
function FeaturedUserCard({ user, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.avatar}
          </div>
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">@{user.username}</p>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(user.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">{user.rating}/5</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {user.skillsOffered.slice(0, 2).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {user.skillsOffered.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{user.skillsOffered.length - 2}
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Connect
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSkills: 0,
    successfulSwaps: 0,
    newThisWeek: 0,
  });

  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Mouse tracking for interactive elements
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (showFilters && !event.target.closest(".filters-dropdown")) {
      setShowFilters(false);
    }
    if (showProfileDropdown && !event.target.closest(".profile-dropdown")) {
      setShowProfileDropdown(false);
    }
  };

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard/users");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();
      setUsers(data);

      // Set featured users (top rated users)
      const featured = data
        .filter((user) => user.rating >= 4)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      setFeaturedUsers(featured);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFilters, showProfileDropdown]);

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const currentUserId = localStorage.getItem("userId");

  // Filter users
  const filteredUsers = users.filter((user) => {
    // Exclude current user
    if (user.id?.toString() === currentUserId) {
      return false;
    }

    // Apply search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      user.skillsWanted.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    // Apply skill category filter
    const matchesSkillFilter =
      skillFilter === "All" ||
      user.skillsOffered.some((skill) =>
        skill.toLowerCase().includes(skillFilter.toLowerCase()),
      );

    return matchesSearch && matchesSkillFilter;
  });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  NEXUS
                </h1>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 hover:text-black transition-colors duration-200 flex items-center gap-2"
                onClick={() => navigate("/landing")}
              >
                <BookOpen className="w-4 h-4" />
                Home
              </motion.button>

              {/* Swap Requests Button */}
              {localStorage.getItem("token") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-600 hover:text-black transition-colors duration-200 flex items-center gap-2 relative"
                  onClick={() => navigate("/swap-requests")}
                >
                  <Target className="w-4 h-4" />
                  Requests
                  <SwapRequestBadge />
                </motion.button>
              )}

              {/* Chat Button */}
              {localStorage.getItem("token") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-600 hover:text-black transition-colors duration-200 flex items-center gap-2 relative"
                  onClick={() => navigate("/chat-list")}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chats
                  <ChatBadge />
                </motion.button>
              )}

              {/* Profile Dropdown */}
              {localStorage.getItem("token") ? (
                <div className="relative profile-dropdown">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-200"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <User className="w-5 h-5" />
                  </motion.button>

                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-20"
                      >
                        <motion.button
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="w-full text-left px-4 py-3 transition-colors duration-150 first:rounded-t-xl flex items-center gap-3"
                          onClick={() => {
                            navigate("/profile");
                            setShowProfileDropdown(false);
                          }}
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </motion.button>
                        <motion.button
                          whileHover={{ backgroundColor: "#fef2f2" }}
                          className="w-full text-left px-4 py-3 transition-colors duration-150 last:rounded-b-xl text-red-600 flex items-center gap-3"
                          onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("userId");
                            setShowProfileDropdown(false);
                            navigate("/login");
                          }}
                        >
                          <X className="w-4 h-4" />
                          Logout
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all duration-200"
                  onClick={() => navigate("/login")}
                >
                  Login
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="sm:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="sm:hidden overflow-hidden"
              >
                <div className="py-4 space-y-3 border-t border-gray-100">
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="block w-full text-left text-gray-600 hover:text-black transition-colors duration-200"
                    onClick={() => navigate("/landing")}
                  >
                    Home
                  </motion.button>

                  {localStorage.getItem("token") ? (
                    <>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="block w-full text-left text-gray-600 hover:text-black transition-colors duration-200"
                        onClick={() => navigate("/profile")}
                      >
                        My Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="block w-full text-left text-red-600 hover:text-red-700 transition-colors duration-200"
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("userId");
                          navigate("/login");
                        }}
                      >
                        Logout
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all duration-200"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent">
              Exchange Skills,{" "}
              <motion.span
                className="text-gray-900"
                animate={{
                  color: ["#111827", "#374151", "#6b7280", "#111827"],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Build Connections
              </motion.span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Connect with talented individuals and trade your expertise for new
              skills. Join thousands of professionals growing together.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <StatsCard
              title="Active Users"
              value={stats.totalUsers || "150+"}
              icon={Users}
              trend={12}
              color="blue"
            />
            <StatsCard
              title="Skills Available"
              value={stats.activeSkills || "500+"}
              icon={Zap}
              trend={8}
              color="green"
            />
            <StatsCard
              title="Successful Swaps"
              value={stats.successfulSwaps || "1.2k"}
              icon={Award}
              trend={15}
              color="purple"
            />
            <StatsCard
              title="New This Week"
              value={stats.newThisWeek || "24"}
              icon={TrendingUp}
              trend={25}
              color="orange"
            />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        {localStorage.getItem("token") && (
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <QuickAction
                title="Create Profile"
                description="Set up your professional profile"
                icon={User}
                onClick={() => navigate("/profile")}
                color="black"
              />
              <QuickAction
                title="Browse Skills"
                description="Find skills you want to learn"
                icon={Search}
                onClick={() => searchRef.current?.focus()}
                color="blue"
              />
              <QuickAction
                title="My Requests"
                description="Manage your swap requests"
                icon={Target}
                onClick={() => navigate("/swap-requests")}
                color="green"
              />
            </div>
          </motion.div>
        )}

        {/* Featured Users */}
        {featuredUsers.length > 0 && (
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Featured Professionals</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                onClick={() => setSearchTerm("")}
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredUsers.map((user, idx) => (
                <FeaturedUserCard
                  key={idx}
                  user={user}
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      navigate("/login");
                    } else {
                      navigate("/profilerequest", {
                        state: { selectedUser: user },
                      });
                    }
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for skills, names, or expertise..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative filters-dropdown">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-4 border-2 border-gray-200 rounded-2xl flex items-center gap-3 hover:border-gray-300 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">{skillFilter}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-10"
                    >
                      {skillCategories.map((category) => (
                        <motion.button
                          key={category}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="w-full text-left px-4 py-3 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                          onClick={() => {
                            setSkillFilter(category);
                            setShowFilters(false);
                          }}
                        >
                          {category}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, rotate: 180 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchUsers}
                disabled={loading || undefined}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </motion.button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mt-4">
            <div>
              {loading ? (
                <p className="text-gray-600">Loading professionals...</p>
              ) : error ? (
                <p className="text-red-600">Error: {error}</p>
              ) : (
                <p className="text-gray-600">
                  Found{" "}
                  <span className="font-bold text-black">
                    {filteredUsers.length}
                  </span>{" "}
                  talented professionals
                  {searchTerm && (
                    <span>
                      {" "}
                      matching "
                      <span className="font-medium">{searchTerm}</span>"
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <Activity className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* User Cards */}
        <motion.div variants={itemVariants} className="space-y-6 mb-12">
          <AnimatePresence mode="wait">
            {loading ? (
              // Enhanced Loading Skeleton
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-8 animate-pulse"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-18"></div>
                          </div>
                        </div>
                      </div>
                      <div className="w-32 h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Failed to load professionals
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchUsers}
                  className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : filteredUsers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No professionals found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? `No results for "${searchTerm}". Try a different search term.`
                    : "No professionals match your current filters."}
                </p>
                {searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm("")}
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Clear Search
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {filteredUsers.map((user, idx) => (
                  <motion.div
                    key={`${user.id}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="group bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        navigate("/login");
                      } else {
                        navigate("/profilerequest", {
                          state: { selectedUser: user },
                        });
                      }
                    }}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                      {/* Enhanced Avatar */}
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-20 h-20 sm:w-24 sm:h-24 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                        >
                          {user.avatar}
                        </motion.div>
                        {user.isOnline && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"
                          />
                        )}
                      </div>

                      {/* Enhanced User Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
                            {user.name}
                          </h3>
                          <p className="text-gray-500 text-lg">
                            @{user.username}
                          </p>
                        </div>

                        {/* Enhanced Skills Display */}
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-semibold text-green-700">
                                Offers:
                              </span>
                            </div>
                            {user.skillsOffered.map((skill, skillIdx) => (
                              <motion.span
                                key={skillIdx}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200 hover:bg-green-100 transition-colors"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-semibold text-blue-700">
                                Wants:
                              </span>
                            </div>
                            {user.skillsWanted.map((skill, skillIdx) => (
                              <motion.span
                                key={skillIdx}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Enhanced Rating */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.1 }}
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    i < Math.floor(user.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              </motion.div>
                            ))}
                          </div>
                          <span className="text-sm font-bold text-gray-700">
                            {user.rating}/5
                          </span>
                          <span className="text-xs text-gray-500">
                            ({Math.floor(Math.random() * 50) + 10} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Action Button */}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const token = localStorage.getItem("token");
                          if (!token) {
                            navigate("/login");
                          } else {
                            navigate("/profilerequest", {
                              state: { selectedUser: user },
                            });
                          }
                        }}
                        className="bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl font-semibold"
                      >
                        <span>Request Swap</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        {!localStorage.getItem("token") && (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-gray-100"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Plus className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to start swapping skills?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of professionals and start exchanging knowledge
              today. Create your profile and connect with amazing talents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold"
              >
                Join NEXUS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/about")}
                className="border-2 border-black text-black px-8 py-4 rounded-xl hover:bg-black hover:text-white transition-all duration-200 font-semibold"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
