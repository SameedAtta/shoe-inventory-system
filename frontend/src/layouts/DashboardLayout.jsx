// src/layout/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <Outlet /> {/* nested routes render here */}
      </div>
    </div>
  );
}






// // src/pages/DashboardLayout.jsx
// import Sidebar from "../components/Sidebar";
// import { Outlet } from "react-router-dom";

// export default function DashboardLayout() {
//   return (
//     <div className="flex">
//       {/* Sidebar only for dashboard */}
//       <Sidebar />

//       {/* Main dashboard content */}
//       <div className="flex-1 p-6 bg-gray-100 min-h-screen">
//         <Outlet />
//       </div>
//     </div>
//   );
// }
