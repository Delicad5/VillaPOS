import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const savedUser = localStorage.getItem("user");

    if (loggedIn && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    } else if (location.pathname !== "/login") {
      // Redirect to login if not authenticated and not already on login page
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  const login = (username: string, password: string): boolean => {
    // In a real app, this would validate against an API
    if (username === "admin" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", username);
      setIsAuthenticated(true);
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
