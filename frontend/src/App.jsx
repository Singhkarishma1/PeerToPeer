import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chats/:peerId" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
