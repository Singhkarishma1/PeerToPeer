import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  const [userName, setUserName] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentChats, setRecentChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile(token);
    } else {
      setIsLoggedIn(false);
      setUserProfile("");
      setUserName("");
    }
  }, []);

  // Listen for changes to the token in localStorage
  useEffect(() => {
    function handleStorageChange() {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        fetchUserProfile(token);
      } else {
        setIsLoggedIn(false);
        setUserProfile("");
        setUserName("");
      }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    function handleClickOutside(event) {
      if (!event.target.closest('.user-menu-dropdown')) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (!isNotificationMenuOpen) return;
    function handleClickOutside(event) {
      if (!event.target.closest('.notification-menu-dropdown')) {
        setIsNotificationMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationMenuOpen]);

  useEffect(() => {
    if (!isChatMenuOpen) return;
    function handleClickOutside(event) {
      if (!event.target.closest('.chat-menu-dropdown')) {
        setIsChatMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChatMenuOpen]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserProfile(response.data.personalInfo?.profilePicture || "https://via.placeholder.com/40");
      setUserName(response.data.personalInfo?.fullName || "User");
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      // Set up polling for new notifications every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchRecentChats = async () => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/chats/recent', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecentChats(response.data);
      setUnreadMessages(response.data.filter(chat => chat.unreadCount > 0).length);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecentChats();
      // Set up polling for new messages every 30 seconds
      const interval = setInterval(fetchRecentChats, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserProfile("");
    setUserName("");
    navigate('/signin');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="top-0 py-1 lg:py-2 w-full bg-white dark:bg-gray-800 shadow-md lg:relative z-[100]">
      <nav className="z-[101] sticky top-0 left-0 right-0 max-w-4xl xl:max-w-5xl mx-auto px-5 py-2.5 lg:border-none lg:py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleHomeClick}>
            <div className="flex items-center space-x-2">
              <h2 className="text-black dark:text-white font-bold text-2xl">P2P App</h2>
            </div>
          </button>
          <div className="hidden lg:flex flex-grow justify-center">
            <ul className="flex space-x-10 text-base font-bold text-black/60 dark:text-white">
              <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
              <li><Link to="/services" onClick={closeMobileMenu}>Our services</Link></li>
              <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
              {isLoggedIn && (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      onClick={closeMobileMenu}
                      className="text-[#4A3BFF] hover:text-[#3A2BFF]"
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="hidden lg:flex lg:items-center gap-x-2">
            {!isLoggedIn ? (
              <>
                <button className="text-black dark:text-white px-6 py-2.5 font-semibold" onClick={handleSignIn}>SignIn</button>
                <button className="bg-[#4A3BFF] text-white px-6 py-2.5 font-semibold rounded-md hover:shadow-lg" onClick={handleSignIn}>Login</button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {isLoggedIn && (
                  <>
                    <div className="relative">
                      <button
                        className="flex items-center space-x-2 focus:outline-none relative"
                        onClick={() => setIsChatMenuOpen((open) => !open)}
                        aria-haspopup="true"
                        aria-expanded={isChatMenuOpen}
                      >
                        <svg 
                          className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-[#4A3BFF] dark:hover:text-[#4A3BFF]" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                          />
                        </svg>
                        {unreadMessages > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadMessages}
                          </span>
                        )}
                      </button>
                      {isChatMenuOpen && (
                        <div className="chat-menu-dropdown absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Messages</h3>
                            <Link 
                              to="/chats" 
                              className="text-xs text-[#4A3BFF] hover:text-[#3A2BFF]"
                              onClick={() => setIsChatMenuOpen(false)}
                            >
                              View All
                            </Link>
                          </div>
                          {recentChats.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto">
                              {recentChats.map((chat) => (
                                <Link
                                  key={chat._id}
                                  to={`/chats/${chat.peerId}`}
                                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => setIsChatMenuOpen(false)}
                                >
                                  <div className="flex items-center space-x-3">
                                    <img 
                                      src={chat.peerProfile || "https://via.placeholder.com/40"} 
                                      alt={chat.peerName} 
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {chat.peerName}
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {chat.lastMessage}
                                      </p>
                                    </div>
                                    {chat.unreadCount > 0 && (
                                      <span className="flex-shrink-0 bg-[#4A3BFF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {chat.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              No recent conversations
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        className="flex items-center space-x-2 focus:outline-none relative"
                        onClick={() => setIsNotificationMenuOpen((open) => !open)}
                        aria-haspopup="true"
                        aria-expanded={isNotificationMenuOpen}
                      >
                        <svg 
                          className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-[#4A3BFF] dark:hover:text-[#4A3BFF]" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                          />
                        </svg>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      {isNotificationMenuOpen && (
                        <div className="notification-menu-dropdown absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          </div>
                          {notifications.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto">
                              {notifications.map((notification) => (
                                <div 
                                  key={notification._id}
                                  className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                  }`}
                                >
                                  <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              No notifications
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        className="flex items-center space-x-2 focus:outline-none"
                        onClick={() => setIsUserMenuOpen((open) => !open)}
                        aria-haspopup="true"
                        aria-expanded={isUserMenuOpen}
                      >
                        {userProfile && userProfile !== "https://via.placeholder.com/40" && (
                          <img src={userProfile} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                        )}
                        <span className="text-black dark:text-white">{userName}</span>
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isUserMenuOpen && (
                        <div className="user-menu-dropdown absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                          <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {!isLoggedIn && (
                  <>
                    <button className="text-black dark:text-white px-6 py-2.5 font-semibold" onClick={handleSignIn}>SignIn</button>
                    <button className="bg-[#4A3BFF] text-white px-6 py-2.5 font-semibold rounded-md hover:shadow-lg" onClick={handleSignIn}>Login</button>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="lg:hidden">
            <button 
              className="text-black dark:text-white p-2" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[102]">
          <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Menu</h2>
              <button 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2"
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
              <ul className="p-4 space-y-4">
                <li>
                  <Link 
                    to="/" 
                    className="block text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-2"
                    onClick={closeMobileMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/services" 
                    className="block text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-2"
                    onClick={closeMobileMenu}
                  >
                    Our services
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="block text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-2"
                    onClick={closeMobileMenu}
                  >
                    About
                  </Link>
                </li>
                {isLoggedIn && (
                  <>
                    <li>
                      <Link 
                        to="/dashboard" 
                        className="block text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-2"
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="absolute bottom-0 w-full p-4 border-t bg-white dark:bg-gray-800">
              {!isLoggedIn ? (
                <div className="space-y-2">
                  <button 
                    className="w-full bg-[#4A3BFF] text-white px-4 py-2 rounded-md hover:bg-[#3A2BFF] transition-colors duration-200"
                    onClick={() => { handleSignIn(); closeMobileMenu(); }}
                  >
                    Sign In
                  </button>
                  <button 
                    className="w-full border border-[#4A3BFF] text-[#4A3BFF] px-4 py-2 rounded-md hover:bg-[#4A3BFF] hover:text-white transition-colors duration-200"
                    onClick={() => { handleSignIn(); closeMobileMenu(); }}
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {userProfile && userProfile !== "https://via.placeholder.com/40" && (
                      <img src={userProfile} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    )}
                    <span className="text-gray-800 dark:text-white">{userName}</span>
                  </div>
                  <button 
                    className="text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    onClick={() => { handleLogout(); closeMobileMenu(); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
