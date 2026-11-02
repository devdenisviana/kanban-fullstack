import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import Kanban from "./pages/Kanban";

function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const current = i18n.language.startsWith("pt") ? "pt" : "en";

  return (
    <header className="app-header">
      <strong>Kanban</strong>

      <div className="app-header-actions">
        <span>{t("nav.language")}:</span>
        <button
          type="button"
          disabled={current === "pt"}
          onClick={() => i18n.changeLanguage("pt")}
        >
          PT
        </button>
        <button
          type="button"
          disabled={current === "en"}
          onClick={() => i18n.changeLanguage("en")}
        >
          EN
        </button>

        {user && (
          <>
            <span>{user.name}</span>
            <button type="button" onClick={logout}>
              {t("nav.logout")}
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (loading) return <p className="page">{t("common.loading")}</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <>
      <Header />
            <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/boards"
          element={
            <ProtectedRoute>
              <Boards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards/:id"
          element={
            <ProtectedRoute>
              <Kanban />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/boards" replace />} />
      </Routes>
    </>
  );
}

export default App;