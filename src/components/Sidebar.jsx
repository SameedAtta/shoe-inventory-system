import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ use the same auth context

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ get logout function from context

  const linkClasses =
    "block px-4 py-2 rounded-lg hover:bg-gray-700 transition";
  const activeClasses = "bg-gray-700 font-bold";

  const handleLogout = () => {
    logout();          // ✅ clear auth state & storage from context
    navigate("/");     // ✅ take user to landing page
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Shoe Store
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/sell"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          Make a Sale
        </NavLink>

        <NavLink
          to="/dashboard/stock"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          Stock
        </NavLink>

        <NavLink
          to="/dashboard/companies"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          Companies
        </NavLink>

        <NavLink
          to="/dashboard/sales"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          Sales Records
        </NavLink>

        <NavLink
          to="/dashboard/addProduct"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          Add Product
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

