import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalMatches: 0,
    activeSessions: 0,
    subjectsTeaching: 0,
    subjectsLearning: 0,
    rating: 0
  });
  const [learningMatches, setLearningMatches] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState({
    teaching: [],
    learning: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserStats(response.data.stats);
        setLearningMatches(response.data.learningMatches || []);
        setUpcomingSessions(response.data.upcomingSessions || []);
        setSubjects(response.data.subjects || { teaching: [], learning: [] });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Your Learning Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Track your learning progress and manage your teaching sessions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Matches</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userStats.totalMatches}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{userStats.activeSessions}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Teaching</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{userStats.subjectsTeaching}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning</h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{userStats.subjectsLearning}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rating</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{userStats.rating}/5</p>
          </div>
        </div>

        {/* Learning Matches */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8 border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Matches</h2>
          </div>
          <div className="p-6">
            {learningMatches.length > 0 ? (
              <div className="space-y-4">
                {learningMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{match.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Teaching: {match.teachingSubject}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Learning: {match.learningSubject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Start Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No learning matches found</p>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8 border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Sessions</h2>
          </div>
          <div className="p-6">
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{session.subject}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">With: {session.partnerName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{session.date} at {session.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No upcoming sessions</p>
            )}
          </div>
        </div>

        {/* Subjects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teaching Subjects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subjects I'm Teaching</h2>
            </div>
            <div className="p-6">
              {subjects.teaching.length > 0 ? (
                <div className="space-y-4">
                  {subjects.teaching.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{subject.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{subject.students} students</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No teaching subjects added</p>
              )}
            </div>
          </div>

          {/* Learning Subjects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subjects I'm Learning</h2>
            </div>
            <div className="p-6">
              {subjects.learning.length > 0 ? (
                <div className="space-y-4">
                  {subjects.learning.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                          <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{subject.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{subject.progress}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No learning subjects added</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;