import React, { useState } from 'react';

const Dashboard = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-indigo-50 min-h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden p-4 fixed top-4 left-4 bg-indigo-800 text-white rounded-full shadow-lg z-50"
      >
        ☰
      </button>

      <div className="pt-16 max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static w-[240px] bg-indigo-50 h-full lg:h-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-40 overflow-y-auto p-4 lg:translate-x-0`}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-indigo-800 mb-4">Dashboard Menu</h2>
            <nav className="space-y-4">
              <a href="#" className="flex items-center text-gray-600 hover:text-indigo-800">
                <span className="material-icons-outlined mr-2">dashboard</span>
                Dashboard
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-indigo-800">
                <span className="material-icons-outlined mr-2">group</span>
                Peer Groups
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-indigo-800">
                <span className="material-icons-outlined mr-2">chat</span>
                Messages
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-indigo-800">
                <span className="material-icons-outlined mr-2">person</span>
                Profile
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-indigo-800">
                <span className="material-icons-outlined mr-2">settings</span>
                Settings
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-red-600">
                <span className="material-icons-outlined mr-2">exit_to_app</span>
                Log out
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className={`flex-1 p-4 transition-all duration-300 ${isMobileMenuOpen ? 'ml-[240px]' : 'ml-0'}`}>
          {/* Overview Section */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl p-6 animate-fade-in">
              <h2 className="text-4xl md:text-5xl text-blue-900">
                Welcome to the <br />
                <strong>Peer-to-Peer Platform</strong>
              </h2>
              <span className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-indigo-800">
                Current Session: 01:51
              </span>
            </div>
          </div>

          {/* Skill Tracking & Progress */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <h3 className="text-2xl font-bold text-indigo-800">Skill Progress</h3>
            <p className="text-gray-600">Your current learning streak: <strong>7 days</strong></p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
              <div className="bg-indigo-600 h-4 rounded-full w-3/5"></div>
            </div>
            <p className="text-gray-500 mt-2">60% completed in JavaScript</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
