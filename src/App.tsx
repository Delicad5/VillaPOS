import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/Login";
import { AuthProvider } from "./components/AuthProvider";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useAuth } from "./components/AuthProvider";
import routes from "tempo-routes";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
