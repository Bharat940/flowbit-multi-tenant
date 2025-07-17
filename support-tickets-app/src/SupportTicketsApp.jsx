import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const SupportTicketsApp = () => {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/tickets", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Could not load tickets. Please try again later.");
      }
    };

    fetchTickets();

    socket.on("ticketUpdated", (ticket) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === ticket._id ? ticket : t))
      );
    });

    return () => {
      socket.off("ticketUpdated");
    };
  }, []);

  const handleCreateTicket = async () => {
    if (!title || !description) {
      setError("Both title and description are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setTickets((prev) => [...prev, data.ticket]);
        setTitle("");
        setDescription("");
        setError("");
      } else {
        setError(data.message || "Failed to create ticket.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="ticket-app-container">
      <h2 className="ticket-app-heading">🎫 Support Tickets</h2>
      <div className="ticket-app-form">
        <input
          type="text"
          placeholder="Enter ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter ticket description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleCreateTicket}>Create Ticket</button>
        {error && <p className="ticket-app-error">{error}</p>}
      </div>
      <div className="ticket-app-list">
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-app-card">
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <p>
                <strong>Status:</strong> {ticket.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportTicketsApp;
