import Footer from "./Components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing";
import UserProfilePage from "./Pages/profiler";
import EditProfilePage from "./Pages/edit";
import ProfileRequestPage from "./Pages/profilerequest";
import ChatApp from "./Pages/chat";

import ContactUs from "./Pages/ContactUs";
import Faq from "./Pages/faq";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import SwapRequests from "./Pages/SwapRequests";
import ChatList from "./Pages/ChatList";
import About from "./Pages/about";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/edit" element={<EditProfilePage />} />
          <Route path="/profilerequest" element={<ProfileRequestPage />} />
          <Route path="/chat" element={<ChatApp />} />

          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/swap-requests" element={<SwapRequests />} />
          <Route path="/chat/:swapRequestId" element={<ChatApp />} />
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
