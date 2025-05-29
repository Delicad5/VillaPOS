import React, { createContext, useContext, useState, useEffect } from "react";
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

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      setUser(storedUser);
      setTenantId("1"); // Default tenant ID
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Check if tenant exists in Supabase, if not create it
    const checkTenant = async () => {
      try {
        const { data, error } = await supabase
          .from("tenants")
          .select("*")
          .eq("id", "1")
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking tenant:", error);
        }

        if (!data) {
          // Create default tenant if it doesn't exist
          const { error: insertError } = await supabase
            .from("tenants")
            .insert({ id: "1", name: "Villa Paradise" });

          if (insertError) {
            console.error("Error creating default tenant:", insertError);
          } else {
            console.log("Default tenant created successfully");
          }
        }
      } catch (error) {
        console.error("Error in tenant check:", error);
      }
    };

    if (isAuthenticated) {
      checkTenant();
    }
  }, [isAuthenticated]);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // For demo purposes - in production, use Supabase auth
    if (username === "admin" && password === "password") {
      setUser(username);
      setTenantId("1");
      setIsAuthenticated(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setTenantId(null);
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
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
