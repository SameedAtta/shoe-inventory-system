import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { Home, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onHoverStart, onHoverEnd }) {
  const { user, logout } = useAuth();

  return (
    <nav
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-4 bg-black bg-opacity-30 text-white"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2 group">
        <img
          src={logo}
          alt="Logo"
          className="h-12 w-auto md:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1 rounded-lg shadow"
        />
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6 text-sm md:text-base font-medium">
        {/* Home Icon */}
        <Link to="/" className="hover:text-red-400 flex items-center">
          <Home className="w-5 h-5" />
        </Link>

        {/* Conditionally Rendered Links */}
        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-400">
              Login
            </Link>
            <Link to="/signup" className="hover:text-green-400">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/stock" className="hover:text-yellow-400">
              Stock
            </Link>
            <Link to="/sell" className="hover:text-purple-400">
              Sell
            </Link>
            <Link to="/dashboard" className="hover:text-pink-400">
              Dashboard
            </Link>
          </>
        )}
      </div>

      {/* User Info (Right Side) */}
      {/* {user && (
        <div className="flex items-center space-x-2 text-sm md:text-base font-medium">
          <User className="w-5 h-5" />
          <span>{user.firstName}</span>
          <button
            onClick={logout}
            className="text-red-400 hover:underline text-xs md:text-sm ml-2"
          >
            Logout
          </button>
        </div>
      )} */}
    </nav>
  );
}

