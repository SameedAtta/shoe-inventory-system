import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // run once on mount: prefer sessionStorage, but also remove any localStorage leftovers
    try {
      const sessionUser = sessionStorage.getItem("user");
      const sessionToken = sessionStorage.getItem("token");

      if (sessionUser && sessionUser !== "undefined") {
        setUser(JSON.parse(sessionUser));
      } else {
        // If there's anything in localStorage from older code, remove it so it doesn't keep users logged in
        if (localStorage.getItem("user") || localStorage.getItem("token")) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
        setUser(null);
      }
    } catch (err) {
      console.error("AuthProvider: Failed to read sessionStorage", err);
      // clean any corrupted values
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    if (!userData) return;
    try {
      sessionStorage.setItem("user", JSON.stringify(userData));
      if (token) sessionStorage.setItem("token", token);

      // remove any stale localStorage items
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setUser(userData);
    } catch (err) {
      console.error("AuthProvider login error:", err);
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (err) {
      console.error("AuthProvider logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}






// import { createContext, useContext, useState, useEffect } from "react";

// // Create Auth Context
// const AuthContext = createContext();

// // Provide Auth Context to App
// export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null); // will hold user object like { firstName }
// const [user, setUser] = useState(() => {
//   try {
//     const storedUser = localStorage.getItem("user");

//     // Only parse if it's not undefined or "undefined"
//     if (storedUser && storedUser !== "undefined") {
//       return JSON.parse(storedUser);
//     } else {
//       return null;
//     }
//   } catch (err) {
//     console.error("Error parsing user from localStorage:", err);
//     return null;
//   }
// });

//   // Restore login from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (userData) => {
//     console.log("Saving user to context:", userData);
//   setUser(userData);
//   localStorage.setItem("user", JSON.stringify(userData));
// };

// const logout = () => {
//   setUser(null);
//   localStorage.removeItem("user");
//   localStorage.removeItem("token");
// };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth
// export const useAuth = () => useContext(AuthContext);
