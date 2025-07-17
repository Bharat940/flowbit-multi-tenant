import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ screens }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role = null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    role = payload.role;
  } catch {
    role = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="shell-sidebar">
      <h3>Flowbit</h3>
      <ul>
        {screens.map((screen) => (
          <li key={screen.path}>
            <NavLink
              to={screen.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {screen.name}
            </NavLink>
          </li>
        ))}
        {role === "admin" && (
          <li>
            <NavLink
              to="/admin/audit-logs"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Audit Logs
            </NavLink>
          </li>
        )}
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
