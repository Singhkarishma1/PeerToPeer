import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: "en",
    timezone: "UTC",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Fetch user settings from backend
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await fetch("http://localhost:5000/api/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Settings updated successfully!" });
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.message || "Failed to update settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while updating settings" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {message.text && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          {/* Notification Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 dark:text-gray-300">
                  Email Notifications
                </label>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 dark:text-gray-300">
                  Push Notifications
                </label>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 dark:text-gray-300">
                  Dark Mode
                </label>
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Language and Region */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Language & Region</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="MST">Mountain Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings; 