import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar.jsx";
import RemoteWrapper from "./components/RemoteWrapper.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";

function App() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchScreens = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/me/screens",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Fetched screens:", data.screens);
        setScreens(data.screens || []);
      } catch (error) {
        console.error("Error fetching screens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  if (
    !token &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="shell-container">
      <Sidebar screens={screens} />
      <div className="shell-main-content">
        <Routes>
          {screens.map((screen) => (
            <Route
              key={screen.path}
              path={screen.path}
              element={
                <RemoteWrapper
                  remoteUrl={screen.remoteEntry}
                  scope={screen.scope}
                  module={screen.module}
                />
              }
            />
          ))}

          <Route path="/admin/audit-logs" element={<AuditLogs />} />

          <Route path="*" element={<Navigate to={screens[0]?.path || "/"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
