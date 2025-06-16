import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">About Us</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Empowering learners and educators through a revolutionary peer-to-peer learning platform
        </p>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            We are dedicated to creating a platform where knowledge sharing becomes accessible to everyone.
            Our peer-to-peer learning platform connects individuals who want to teach with those who want to learn,
            fostering a community of continuous learning and growth.
          </p>
        </div>

        {/* What We Offer Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-12 text-white">
          <h2 className="text-3xl font-semibold mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-200 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-lg">One-on-one learning sessions</span>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-200 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-lg">Subject-specific tutoring</span>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-200 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-lg">Flexible scheduling</span>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-200 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-lg">Online and in-person options</span>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-200 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-lg">Community-driven learning</span>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-200 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-lg">Expert-led workshops</span>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="text-blue-600 dark:text-blue-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Accessibility</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Making education accessible to everyone, regardless of their location or background.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="text-blue-600 dark:text-blue-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Community</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Building a supportive learning community where everyone can contribute and grow.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="text-blue-600 dark:text-blue-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Quality</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ensuring high-quality learning experiences through our platform's features and community guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 