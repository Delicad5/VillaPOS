import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  tenantId: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  tenantId: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const savedUser = localStorage.getItem("user");
    const savedTenantId = localStorage.getItem("tenantId");

    if (loggedIn && savedUser && savedTenantId) {
      setIsAuthenticated(true);
      setUser(savedUser);
      setTenantId(savedTenantId);
    } else if (location.pathname !== "/login") {
      // Redirect to login if not authenticated and not already on login page
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      // Query the users table to find the user with the given username and password
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, tenant_id, username")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (userError || !userData) {
        console.error("Login error:", userError);
        return false;
      }

      // Get tenant information
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("id, name")
        .eq("id", userData.tenant_id)
        .single();

      if (tenantError || !tenantData) {
        console.error("Tenant fetch error:", tenantError);
        return false;
      }

      // Store authentication state
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", username);
      localStorage.setItem("tenantId", userData.tenant_id);

      setIsAuthenticated(true);
      setUser(username);
      setTenantId(userData.tenant_id);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("tenantId");
    setIsAuthenticated(false);
    setUser(null);
    setTenantId(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, tenantId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
