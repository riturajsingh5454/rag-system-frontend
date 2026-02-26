import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "motion/react";

// --- Components ---
import { UserLayout } from "./components/user/UserLayout";
import { AdminLayout } from "./components/admin/AdminLayout";

// --- User Pages ---
import UserChat from "./pages/user/Chat";

import UserHistory from "./pages/user/History";
import UserSettings from "./pages/user/Settings";

// --- Admin Pages ---
import DashboardView from "./pages/admin/Dashboard";
import DocumentsView from "./pages/admin/Documents";
import UserUpload from "./pages/admin/upload";

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const login = async () => {
      if (localStorage.getItem("token")) return;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "admin",
            password: "admin123",
          }),
        });

        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
      } catch (err) {
        console.error("Auto-login failed", err);
      }
    };

    login();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ================= USER ROUTES ================= */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<UserChat />} />
          <Route path="/upload" element={<UserUpload />} />
          <Route path="/history" element={<UserHistory />} />
          <Route path="/settings" element={<UserSettings />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* default redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* admin pages */}
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="documents" element={<DocumentsView />} />
            <Route path="upload" element={<UserUpload />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}