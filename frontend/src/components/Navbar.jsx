import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ scrollToAbout }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = async () => {
    const email = "karishamasingh10@gmail.com";
    const password = "yourPasswordHere";

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setUserProfile(data.profileImage || "https://example.com/default-profile.jpg");
        setUserName(data.name);
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile("");
    setUserName("");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="top-0 py-1 lg:py-2 w-full bg-transparent lg:relative z-50 dark:bg-gray-900">
      <nav className="z-10 sticky top-0 left-0 right-0 max-w-4xl xl:max-w-5xl mx-auto px-5 py-2.5 lg:border-none lg:py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleHomeClick}>
            <div className="flex items-center space-x-2">
              <h2 className="text-black dark:text-white font-bold text-2xl">Company</h2>
            </div>
          </button>
          <div className="hidden lg:flex flex-grow justify-center">
            <ul className="flex space-x-10 text-base font-bold text-black/60 dark:text-white">
              <li><a href="#" onClick={() => { handleHomeClick(); closeMobileMenu(); }}>Home</a></li>
              <li><a href="#" onClick={closeMobileMenu}>Our services</a></li>
              <li className="cursor-pointer" onClick={() => { scrollToAbout(); closeMobileMenu(); }}>About</li>
              <li><a href="#" onClick={closeMobileMenu}>Contact</a></li>
            </ul>
          </div>
          <div className="hidden lg:flex lg:items-center gap-x-2">
            {!isLoggedIn ? (
              <>
                <button className="text-black dark:text-white px-6 py-2.5 font-semibold" onClick={handleSignIn}>SignIn</button>
                <button className="bg-[#4A3BFF] text-white px-6 py-2.5 font-semibold rounded-md hover:shadow-lg" onClick={handleLogin}>Login</button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <img src={userProfile} alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="text-black dark:text-white">{userName}</span>
                <button className="text-black dark:text-white px-4 py-2" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
          <div className="lg:hidden">
            <button className="text-black dark:text-white" onClick={toggleMobileMenu}>
              <svg className="text-2xl" height="1em" width="1em" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14M3 10h14m-6 5h6" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-900 text-white p-4 z-50">
          <button className="absolute top-4 right-4 text-white" onClick={toggleMobileMenu}>&times;</button>
          <ul className="space-y-4 mt-8">
            <li><a href="#" onClick={() => { handleHomeClick(); closeMobileMenu(); }}>Home</a></li>
            <li><a href="#" onClick={closeMobileMenu}>Our services</a></li>
            <li className="cursor-pointer" onClick={() => { scrollToAbout(); closeMobileMenu(); }}>About</li>
            <li><a href="#" onClick={closeMobileMenu}>Contact</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
