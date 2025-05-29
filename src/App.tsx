import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { AuthProvider } from "./components/AuthProvider";
import { LanguageProvider } from "./contexts/LanguageContext";
import routes from "tempo-routes";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
