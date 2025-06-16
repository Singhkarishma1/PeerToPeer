import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      profilePicture: null
    },
    education: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      graduationYear: "",
      currentYear: ""
    },
    subjects: {
      teaching: [],
      learning: []
    },
    availability: {
      preferredDays: [],
      preferredTimes: [],
      timezone: ""
    },
    preferences: {
      teachingMethod: "online",
      learningMethod: "online",
      maxStudentsPerSession: 1,
      preferredSessionDuration: 60
    }
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Available options for dropdowns
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const times = ["Morning (8-12)", "Afternoon (12-5)", "Evening (5-10)"];
  const teachingMethods = ["Online", "In-person", "Hybrid"];
  const sessionDurations = [30, 60, 90, 120];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        // Merge the response data with the default state to ensure all fields exist
        setProfile(prevProfile => ({
          ...prevProfile,
          ...response.data,
          personalInfo: {
            ...prevProfile.personalInfo,
            ...response.data.personalInfo
          },
          education: {
            ...prevProfile.education,
            ...response.data.education
          },
          subjects: {
            ...prevProfile.subjects,
            ...response.data.subjects
          },
          availability: {
            ...prevProfile.availability,
            ...response.data.availability
          },
          preferences: {
            ...prevProfile.preferences,
            ...response.data.preferences
          }
        }));
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      } else {
        setError(err.response?.data?.message || "Failed to load profile. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubjectChange = (type, value) => {
    setProfile(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [type]: value.split(",").map(subject => subject.trim())
      }
    }));
  };

  const handleAvailabilityChange = (type, value) => {
    setProfile(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [type]: Array.isArray(value) ? value : [value]
      }
    }));
  };

  const handleEditClick = () => setIsEditMode(true);
  const handleCancelEdit = () => setIsEditMode(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      const response = await axios.put(
        "http://localhost:5000/api/profile",
        profile,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess("Profile updated successfully!");
      setIsEditMode(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/upload-profile-picture',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        const imageUrl = response.data.imageUrl;
        setPreviewImage(imageUrl);
        setProfile(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            profilePicture: imageUrl
          }
        }));
      } catch (err) {
        alert('Failed to upload image.');
      } finally {
        setUploading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-6 py-4 rounded-xl shadow-lg" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW MODE ---
  if (!isEditMode) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center mb-8">
              {profile.personalInfo.profilePicture && (
                <img
                  src={profile.personalInfo.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow mb-4"
                />
              )}
              <div className="flex items-center justify-between w-full">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
                <button
                  onClick={handleEditClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Edit Profile
                </button>
              </div>
            </div>
            {success && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100 px-6 py-4 rounded-xl shadow-lg mb-8" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline ml-2">{success}</span>
              </div>
            )}
            {/* Personal Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Full Name:</span> <span className="text-gray-900 dark:text-white">{profile.personalInfo.fullName}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Email:</span> <span className="text-gray-900 dark:text-white">{profile.personalInfo.email}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span> <span className="text-gray-900 dark:text-white">{profile.personalInfo.phone}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> <span className="text-gray-900 dark:text-white">{profile.personalInfo.location}</span></div>
                <div className="md:col-span-2"><span className="font-medium text-gray-700 dark:text-gray-300">Bio:</span> <span className="text-gray-900 dark:text-white">{profile.personalInfo.bio}</span></div>
              </div>
            </div>
            {/* Education Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white mb-8">
              <h2 className="text-2xl font-semibold mb-4">Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><span className="font-medium">Institution:</span> {profile.education.institution}</div>
                <div><span className="font-medium">Degree:</span> {profile.education.degree}</div>
                <div><span className="font-medium">Field of Study:</span> {profile.education.fieldOfStudy}</div>
                <div><span className="font-medium">Graduation Year:</span> {profile.education.graduationYear}</div>
              </div>
            </div>
            {/* Subjects Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Subjects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Teaching:</span> <span className="text-gray-900 dark:text-white">{profile.subjects.teaching.join(", ")}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Learning:</span> <span className="text-gray-900 dark:text-white">{profile.subjects.learning.join(", ")}</span></div>
              </div>
            </div>
            {/* Availability & Preferences Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Availability & Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Preferred Days:</span> <span className="text-gray-900 dark:text-white">{profile.availability.preferredDays.join(", ")}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Preferred Times:</span> <span className="text-gray-900 dark:text-white">{profile.availability.preferredTimes.join(", ")}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Timezone:</span> <span className="text-gray-900 dark:text-white">{profile.availability.timezone}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Teaching Method:</span> <span className="text-gray-900 dark:text-white">{profile.preferences.teachingMethod}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Preferred Session Duration:</span> <span className="text-gray-900 dark:text-white">{profile.preferences.preferredSessionDuration} minutes</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- EDIT MODE ---
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {(previewImage || profile.personalInfo.profilePicture) && (
                <img
                  src={previewImage || profile.personalInfo.profilePicture}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow mb-2"
                />
              )}
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                  disabled={uploading}
                />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7l-1.5-1.5" />
                </svg>
              </label>
              {uploading && <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 rounded-full"><span className="text-blue-600 font-semibold">Uploading...</span></div>}
            </div>
            <div className="flex items-center justify-between w-full mt-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
          {success && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100 px-6 py-4 rounded-xl shadow-lg mb-8" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{success}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-blue-600 dark:text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.personalInfo.fullName}
                    onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.personalInfo.phone}
                    onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.personalInfo.location}
                    onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your location"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.personalInfo.bio}
                    onChange={(e) => handleInputChange("personalInfo", "bio", e.target.value)}
                    rows="4"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                </svg>
                <h2 className="text-2xl font-semibold">Education</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Institution</label>
                  <input
                    type="text"
                    value={profile.education.institution}
                    onChange={(e) => handleInputChange("education", "institution", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Your institution"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Degree</label>
                  <input
                    type="text"
                    value={profile.education.degree}
                    onChange={(e) => handleInputChange("education", "degree", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Your degree"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Field of Study</label>
                  <input
                    type="text"
                    value={profile.education.fieldOfStudy}
                    onChange={(e) => handleInputChange("education", "fieldOfStudy", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Your field of study"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Graduation Year</label>
                  <input
                    type="text"
                    value={profile.education.graduationYear}
                    onChange={(e) => handleInputChange("education", "graduationYear", e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white/10 border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Expected graduation year"
                  />
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-blue-600 dark:text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Subjects</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subjects You Want to Teach
                  </label>
                  <input
                    type="text"
                    value={profile.subjects.teaching.join(", ")}
                    onChange={(e) => handleSubjectChange("teaching", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Separate subjects with commas</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subjects You Want to Learn
                  </label>
                  <input
                    type="text"
                    value={profile.subjects.learning.join(", ")}
                    onChange={(e) => handleSubjectChange("learning", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Programming, Music, Languages"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Separate subjects with commas</p>
                </div>
              </div>
            </div>

            {/* Availability and Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-blue-600 dark:text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Availability & Preferences</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Days
                  </label>
                  <select
                    multiple
                    value={profile.availability.preferredDays}
                    onChange={(e) => handleAvailabilityChange("preferredDays", Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple days</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Times
                  </label>
                  <select
                    multiple
                    value={profile.availability.preferredTimes}
                    onChange={(e) => handleAvailabilityChange("preferredTimes", Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {times.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple times</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.availability.timezone}
                    onChange={e => handleInputChange("availability", "timezone", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., UTC, America/New_York, Asia/Kolkata"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter your timezone (e.g., UTC, America/New_York, Asia/Kolkata)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teaching Method
                  </label>
                  <select
                    value={profile.preferences.teachingMethod}
                    onChange={(e) => handleInputChange("preferences", "teachingMethod", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {teachingMethods.map(method => (
                      <option key={method} value={method.toLowerCase()}>{method}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Session Duration (minutes)
                  </label>
                  <select
                    value={profile.preferences.preferredSessionDuration}
                    onChange={(e) => handleInputChange("preferences", "preferredSessionDuration", parseInt(e.target.value))}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {sessionDurations.map(duration => (
                      <option key={duration} value={duration}>{duration} minutes</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-lg shadow-lg"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 