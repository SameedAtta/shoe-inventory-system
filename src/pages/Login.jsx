import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.jpg";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use login from AuthContext

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3006/api/user/login", {
        email,
        password,
      });
      // ✅ Save token if needed
      const { token, user } = res.data;
      // Save both token and user
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      login(user,token); // ✅ Update context
      navigate("/dashboard")
    } catch (err) {
      console.log("Error",err.response?.data?.message)
      setError(err.response?.data?.message || "Login failed");
      console.log("Error from Login",error)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <img
        src={logo}
        alt="Logo"
        className="h-28 w-28 rounded-full mb-4 shadow-md transition-transform duration-300 hover:scale-105"
      />

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && (
          <div className="text-red-600 text-sm font-medium mb-4">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition duration-300"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Dont have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import logo from "../assets/logo.jpg";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError("Email and password are required");
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:3006/user/login", {
//         email,
//         password,
//       });

//       // save token if using JWT
//       localStorage.setItem("token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <img
//         src={logo}
//         alt="Logo"
//         className="h-30 w-30 rounded-full mb-4 shadow-lg"
//       />
//       <motion.div
//         initial={{ opacity: 0, y: 100 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
//       >
//         <div className="bg-white p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//           {error && <div className="text-red-500 mb-4">{error}</div>}

//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full mb-4 p-2 border rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full mb-4 p-2 border rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             onClick={handleLogin}
//             className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//           >
//             Login
//           </button>

//           <p className="text-center text-sm mt-4">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-blue-500 underline">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
