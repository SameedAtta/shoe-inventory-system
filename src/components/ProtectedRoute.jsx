import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or <Loader /> if you have one

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}




// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   console.log("User in ProtectedRoute:", user);
//   return user ? children : <Navigate to="/login" replace />;
// }