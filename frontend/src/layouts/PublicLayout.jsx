import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  const location = useLocation();

  // ✅ Only pass props if on LandingPage
  const isLanding = location.pathname === "/";

  return (
    <div className="relative">
      {/* 🧠 Pass autoplay handlers ONLY for LandingPage */}
      <Navbar
        onHoverStart={isLanding ? window.startAutoplay : undefined}
        onHoverEnd={isLanding ? window.stopAutoplay : undefined}
      />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}