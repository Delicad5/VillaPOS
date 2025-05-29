import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  tenantId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true,
  user: "admin",
  tenantId: "1",
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user] = useState<string | null>("admin");
  const [tenantId] = useState<string | null>("1");

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

    checkTenant();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: true, user, tenantId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
