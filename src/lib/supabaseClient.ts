import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Get environment variables with fallbacks for development
let supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project-id.supabase.co";
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

// Use environment variables from window.__env if available (for production builds)
if (typeof window !== "undefined" && window.__env) {
  if (window.__env.VITE_SUPABASE_URL) {
    supabaseUrl = window.__env.VITE_SUPABASE_URL;
  }
  if (window.__env.VITE_SUPABASE_ANON_KEY) {
    supabaseAnonKey = window.__env.VITE_SUPABASE_ANON_KEY;
  }
}

// Check if environment variables are available
if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === "https://your-project-id.supabase.co"
) {
  console.error(
    "Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
  );
}

// Create client only if we have the required values
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
}

// Export the client or a mock client that logs errors when methods are called
export const supabase =
  supabaseClient ||
  ({
    from: () => {
      console.error(
        "Supabase client not initialized. Check your environment variables.",
      );
      return {
        select: () => ({
          eq: () => ({
            single: () => ({
              data: null,
              error: new Error("Supabase client not initialized"),
            }),
          }),
        }),
        insert: () => ({ error: new Error("Supabase client not initialized") }),
        update: () => ({
          eq: () => ({ error: new Error("Supabase client not initialized") }),
        }),
        delete: () => ({
          eq: () => ({ error: new Error("Supabase client not initialized") }),
        }),
      };
    },
    auth: {
      signUp: () => {
        console.error(
          "Supabase client not initialized. Check your environment variables.",
        );
        return Promise.resolve({
          data: null,
          error: new Error("Supabase client not initialized"),
        });
      },
      signIn: () => {
        console.error(
          "Supabase client not initialized. Check your environment variables.",
        );
        return Promise.resolve({
          data: null,
          error: new Error("Supabase client not initialized"),
        });
      },
      signOut: () => {
        console.error(
          "Supabase client not initialized. Check your environment variables.",
        );
        return Promise.resolve({
          error: new Error("Supabase client not initialized"),
        });
      },
    },
    // Add other commonly used methods as needed
  } as unknown as ReturnType<typeof createClient<Database>>);
