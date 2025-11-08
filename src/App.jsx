import { Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Sellshoe from "./pages/Sellshoe";
import Stock from "./pages/Stock";
import AddCompany from "./pages/AddCompany";
import SaleRecords from "./pages/SaleRecords";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes (Landing, Login, Signup) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes (Dashboard etc.) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="sell" element={<Sellshoe />} />
          <Route path="stock" element={<Stock />} />
          <Route path="sales" element={<SaleRecords />} />
          <Route path="companies" element={<AddCompany />} />
          <Route path="addProduct" element={<AddProduct />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import SellShoe from "./pages/Sellshoe";
// import Stock from "./pages/Stock";
// import AddCompany from "./pages/AddCompany";
// import "./App.css";
// import PrivateRoute from "./components/PrivateRoute";
// import LandingPage from "./pages/LandingPage";
// import PublicLayout from "./layouts/PublicLayout";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Routes>
//         <Route element={<PublicLayout />}>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         </Route>
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/sell"
//           element={
//             <PrivateRoute>
//               <SellShoe />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/stock"
//           element={
//             <PrivateRoute>
//               <Stock />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/company/add"
//           element={
//             <PrivateRoute>
//               <AddCompany />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;
