import { useState } from "react";
import emailjs from "emailjs-com";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const topics = [
  "General Inquiry",
  "Support",
  "Partnership",
  "Feedback",
  "Other",
];

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    topic: "",
    message: "",
  });

  const [status, setStatus] = useState({ message: "", isError: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await emailjs.send(
        "service_p0odil5",
        "template_4ehp9mj",
        formData,
        "U2V3F5obnmBdI1iFx"
      );
      setStatus({ message: "Message sent successfully!", isError: false });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        topic: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus({
        message: "Failed to send message. Please try again later.",
        isError: true,
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-0 min-h-[70vh]">
        <div className="flex flex-col justify-center px-8 py-12 md:py-0 bg-white text-black">
          <span className="uppercase tracking-widest text-xs text-gray-500 mb-4">
            Contact Us
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            How can we
            <br />
            help you?
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-md">
            Our team is here to help you access capital and grow on your terms.
            Check out the resources below and reach out directly if you have any
            questions.
          </p>
          <button
            className="w-fit px-6 py-2 rounded-full bg-black text-white font-semibold shadow hover:bg-gray-900 transition"
            onClick={() => navigate("/faq")}
          >
            Search FAQ's
          </button>
        </div>

        <div className="relative flex items-center justify-center p-4 md:p-0">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 border border-gray-100"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name*
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name*
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Email*
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic*
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
              >
                <option value="">Please select</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message*
              </label>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 min-h-[100px]"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-black text-white p-3 rounded-full text-lg font-semibold tracking-wide shadow hover:bg-gray-900 transition-colors duration-200"
            >
              Submit
            </motion.button>
            <p className="text-xs text-gray-500 text-center mt-2">
              By pressing submit you agree to the Pipe{" "}
              <span className="underline cursor-pointer">terms of service</span>{" "}
              and{" "}
              <span className="underline cursor-pointer">privacy policy</span>
            </p>
            {status.message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm text-center mt-2 ${
                  status.isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {status.message}
              </motion.p>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
}
