import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
      profilePicture: null
    },
    education: {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationYear: ''
    },
    subjects: {
      teaching: [],
      learning: []
    },
    availability: {
      preferredDays: [],
      preferredTimes: [],
      timezone: ''
    },
    preferences: {
      preferredTeachingMethod: '',
      preferredLearningMethod: '',
      maxStudentsPerSession: 1,
      sessionDuration: 60
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubjectAdd = (type, subject) => {
    setProfile(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [type]: [...prev.subjects[type], subject]
      }
    }));
  };

  const handleSubjectRemove = (type, index) => {
    setProfile(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [type]: prev.subjects[type].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put('http://localhost:5000/api/profile', profile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    value={profile.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input
                    type="tel"
                    value={profile.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <input
                    type="text"
                    value={profile.personalInfo.location}
                    onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                  value={profile.personalInfo.bio}
                  onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
                  <input
                    type="text"
                    value={profile.education.institution}
                    onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                  <input
                    type="text"
                    value={profile.education.degree}
                    onChange={(e) => handleInputChange('education', 'degree', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
                  <input
                    type="text"
                    value={profile.education.fieldOfStudy}
                    onChange={(e) => handleInputChange('education', 'fieldOfStudy', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Year</label>
                  <input
                    type="number"
                    value={profile.education.graduationYear}
                    onChange={(e) => handleInputChange('education', 'graduationYear', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subjects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teaching Subjects */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Teaching</h3>
                  <div className="space-y-2">
                    {profile.subjects.teaching.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => {
                            const newSubjects = [...profile.subjects.teaching];
                            newSubjects[index] = e.target.value;
                            setProfile(prev => ({
                              ...prev,
                              subjects: {
                                ...prev.subjects,
                                teaching: newSubjects
                              }
                            }));
                          }}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleSubjectRemove('teaching', index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleSubjectAdd('teaching', '')}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      + Add Subject
                    </button>
                  </div>
                </div>

                {/* Learning Subjects */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Learning</h3>
                  <div className="space-y-2">
                    {profile.subjects.learning.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => {
                            const newSubjects = [...profile.subjects.learning];
                            newSubjects[index] = e.target.value;
                            setProfile(prev => ({
                              ...prev,
                              subjects: {
                                ...prev.subjects,
                                learning: newSubjects
                              }
                            }));
                          }}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleSubjectRemove('learning', index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleSubjectAdd('learning', '')}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      + Add Subject
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Days</label>
                  <select
                    multiple
                    value={profile.availability.preferredDays}
                    onChange={(e) => handleInputChange('availability', 'preferredDays', Array.from(e.target.selectedOptions, option => option.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Times</label>
                  <select
                    multiple
                    value={profile.availability.preferredTimes}
                    onChange={(e) => handleInputChange('availability', 'preferredTimes', Array.from(e.target.selectedOptions, option => option.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 9PM)</option>
                    <option value="night">Night (9PM - 12AM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                  <input
                    type="text"
                    value={profile.availability.timezone}
                    onChange={(e) => handleInputChange('availability', 'timezone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Teaching Method</label>
                  <select
                    value={profile.preferences.preferredTeachingMethod}
                    onChange={(e) => handleInputChange('preferences', 'preferredTeachingMethod', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select a method</option>
                    <option value="one-on-one">One-on-One</option>
                    <option value="group">Group Sessions</option>
                    <option value="hybrid">Hybrid (Both)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Learning Method</label>
                  <select
                    value={profile.preferences.preferredLearningMethod}
                    onChange={(e) => handleInputChange('preferences', 'preferredLearningMethod', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select a method</option>
                    <option value="one-on-one">One-on-One</option>
                    <option value="group">Group Sessions</option>
                    <option value="hybrid">Hybrid (Both)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Students per Session</label>
                  <input
                    type="number"
                    min="1"
                    value={profile.preferences.maxStudentsPerSession}
                    onChange={(e) => handleInputChange('preferences', 'maxStudentsPerSession', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Session Duration (minutes)</label>
                  <input
                    type="number"
                    min="30"
                    step="30"
                    value={profile.preferences.sessionDuration}
                    onChange={(e) => handleInputChange('preferences', 'sessionDuration', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;