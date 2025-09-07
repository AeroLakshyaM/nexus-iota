import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Zap,
  Users,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const GeneralIcon = () => <HelpCircle className="w-6 h-6" />;
const AccountIcon = () => <MessageCircle className="w-6 h-6" />;

const categories = [
  { id: "all", name: "All Questions", icon: BookOpen },
  { id: "getting-started", name: "Getting Started", icon: Lightbulb },
  { id: "platform", name: "Platform", icon: Zap },
  { id: "collaboration", name: "Collaboration", icon: Users },
  { id: "security", name: "Security", icon: Shield },
  { id: "billing", name: "Billing", icon: CheckCircle },
  { id: "support", name: "Support", icon: MessageCircle },
];

const faqs = [
  {
    id: 1,
    category: "getting-started",
    question: "How do I get started with NEXUS?",
    answer:
      "Getting started with NEXUS is simple! First, create your account by clicking the 'Get Started' button. Then, complete your profile by adding your skills, interests, and project goals. Our onboarding wizard will guide you through connecting with relevant collaborators and joining your first project.",
  },
  {
    id: 2,
    category: "platform",
    question: "What is skill swapping and how does it work?",
    answer:
      "Skill swapping is our unique feature that allows you to exchange knowledge and expertise with other community members. You can offer skills you're proficient in and request to learn skills from others. Our matching algorithm connects you with compatible partners based on complementary skill sets.",
  },
  {
    id: 3,
    category: "collaboration",
    question: "How do I find and join projects?",
    answer:
      "You can discover projects through several ways: browse our project directory filtered by category, skill requirements, or timeline; get personalized project recommendations based on your profile; join through invitations from other members; or create your own project and invite collaborators.",
  },
  {
    id: 4,
    category: "platform",
    question: "Is the chat application secure and private?",
    answer:
      "Absolutely! Our chat application uses end-to-end encryption for all messages, ensuring only you and your intended recipients can read your conversations. We implement enterprise-grade security protocols and comply with international privacy standards.",
  },
  {
    id: 5,
    category: "getting-started",
    question: "Do I need any specific technical skills to use NEXUS?",
    answer:
      "Not at all! NEXUS is designed to be user-friendly for people of all technical backgrounds. Whether you're a complete beginner or an experienced professional, our intuitive interface and comprehensive help documentation make it easy to navigate.",
  },
  {
    id: 6,
    category: "collaboration",
    question: "How does project collaboration work?",
    answer:
      "Project collaboration on NEXUS includes integrated tools for team communication, file sharing, task management, and progress tracking. Each project has its own workspace with chat channels, document repositories, and milestone tracking.",
  },
  {
    id: 7,
    category: "security",
    question: "How is my personal information protected?",
    answer:
      "We take data protection seriously and implement multiple layers of security. Your personal information is encrypted both in transit and at rest, stored on secure servers with regular backups. We follow GDPR and other international privacy regulations.",
  },
  {
    id: 8,
    category: "billing",
    question: "What are the pricing plans available?",
    answer:
      "NEXUS offers flexible pricing to suit different needs: a Free tier with basic features for individual users, a Professional plan ($15/month) with advanced collaboration tools and priority support, and an Enterprise plan with custom pricing for organizations.",
  },
  {
    id: 9,
    category: "platform",
    question: "Can I use NEXUS on mobile devices?",
    answer:
      "Yes! NEXUS is fully responsive and works seamlessly on all devices including smartphones and tablets. We also offer native mobile apps for iOS and Android with push notifications and optimized mobile interfaces.",
  },
  {
    id: 10,
    category: "support",
    question: "What support options are available?",
    answer:
      "We provide comprehensive support through multiple channels: 24/7 live chat support, detailed help documentation and video tutorials, community forums where users help each other, and regular webinars and training sessions.",
  },
];

export default function FAQ() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredFAQs, setFilteredFAQs] = useState(faqs);

  // Filter FAQs based on search and category
  useEffect(() => {
    let filtered = faqs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFAQs(filtered);
  }, [searchTerm, selectedCategory]);

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setExpandedFAQ(null);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : HelpCircle;
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 cursor-pointer">
            NEXUS
          </div>
          <div className="hidden md:flex space-x-8">
            {["Home", "About", "FAQ", "Contact"].map((item, index) => (
              <a
                key={item}
                href={
                  item === "Home"
                    ? "/"
                    : item === "FAQ"
                    ? "/faq"
                    : `/${item.toLowerCase()}`
                }
                className={`transition-all duration-300 relative group transform hover:scale-105 ${
                  item === "FAQ"
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-gray-700 group-hover:w-full transition-all duration-300"></div>
                <div className="absolute -inset-2 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </a>
            ))}
          </div>
          <button className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-2 rounded-full hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Get Started
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Find answers to common questions about NEXUS platform, features, and
            how to get the most out of your experience.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-black transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm focus:shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`group flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 border-2 ${
                  selectedCategory === category.id
                    ? "bg-black text-white border-black"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-100"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <category.icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">{category.name}</span>
                {selectedCategory === category.id && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No questions found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => {
                const CategoryIcon = getCategoryIcon(faq.category);
                const isExpanded = expandedFAQ === faq.id;

                return (
                  <motion.div
                    key={faq.id}
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-gray-400 transition-all duration-500 hover:shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <CategoryIcon className="w-6 h-6 text-gray-600 group-hover:text-black group-hover:scale-110 transition-all duration-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold text-black group-hover:text-gray-800 transition-colors duration-300">
                            {faq.question}
                          </h3>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-gray-500 capitalize">
                              {categories.find((c) => c.id === faq.category)
                                ?.name || faq.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <motion.div
                          className={`w-8 h-8 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-all duration-500 ${
                            isExpanded ? "rotate-180 bg-black" : ""
                          }`}
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-colors duration-300 ${
                              isExpanded ? "text-white" : "text-gray-600"
                            }`}
                          />
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <div className="border-t border-gray-200 pt-4">
                              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                                  {faq.answer}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                      <span>Helpful</span>
                                    </span>
                                  </div>
                                  <button className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors duration-300 group">
                                    <span className="text-sm font-medium">
                                      Still need help?
                                    </span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      className="h-1 bg-gradient-to-r from-black to-gray-700"
                      initial={{ width: 0 }}
                      animate={{ width: isExpanded ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
