import React, { useEffect, useState } from "react";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/audit-logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          setError("You are not authorized to view audit logs.");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch logs.");
        }

        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const decodeToken = () => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch {
        setRole(null);
        setError("Invalid token");
        setLoading(false);
      }
    };

    if (token) {
      decodeToken();
      fetchLogs();
    } else {
      setError("No token found");
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="shell-audit-log-container">
      <h2>Audit Logs</h2>
      {error && <p className="shell-error">{error}</p>}
      {loading ? (
        <p className="shell-loading">Loading...</p>
      ) : (
        <ul className="shell-audit-log-list">
          {logs.map((log) => (
            <li key={log._id}>
              <strong>{log.action}</strong> | User: {log.userId} | Customer:{" "}
              {log.customerId} | Time:{" "}
              {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuditLogs;
