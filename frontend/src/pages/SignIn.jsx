import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  // State to store email, password, and any errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the backend with email and password
      const response = await axios.post("http://localhost:5000/api/signin", {
        email,
        password,
      });

      // Handle successful response
      if (response.status === 200) {
        console.log("Signed in successfully:", response.data);
        
        localStorage.setItem("token", response.data.token);
        // Redirect the user to the landing page
        window.location.href = "/";
       


        // You can redirect the user after successful sign-in
      }
    } catch (err) {
      // Handle error
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-300">Sign In</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Sign In
          </button>
        </form>

        {/* Continue with Google Button */}
        <button className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
          Continue with Google
        </button>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          New user?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
