import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import logo from "../assets/logo.jpg";


export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { firstName, lastName, email, password } = formData;
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3006/api/user/signup",
        formData
      );
      localStorage.setItem("token", res.data.token); // Store JWT token
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Signup successful!",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Signup failed!",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <img
        src={logo}
        alt="Logo"
        className="h-30 w-30 rounded-full mb-4 shadow-lg"
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="bg-white p-8 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-full mb-4 p-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="w-full mb-4 p-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            onChange={handleChange}
          />

          <button
            onClick={handleSignup} 
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Sign Up
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
