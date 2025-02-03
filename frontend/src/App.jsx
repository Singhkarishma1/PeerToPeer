import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage"; // Ensure this file exists
import About from "./components/About";
import SignIn from "./pages/SignIn"; // Ensure this file exists
import Register from "./pages/Register"; // Ensure this file exists
import Dashboard from "./pages/DashboardPage";
function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* Navbar is always visible */}
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Default home page */}
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      
        <Footer /> {/* Footer is always visible */}
      </div>
    </Router>
  );
}

export default App;
