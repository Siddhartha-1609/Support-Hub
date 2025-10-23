import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";

function App() {
  const API_BASE = "http://localhost:8000/api";
  const [ticketId, setTicketId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/tickets/latest/`)
      .then((res) => res.json())
      .then((data) => setTicketId(data.id))
      .catch((err) => {
        console.error("Error fetching ticket:", err);
        setTicketId(null);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",  // horizontal center
        alignItems: "center",      // vertical center
        minHeight: "100vh",        // full viewport height
        background: "#f2f4f7",     // subtle light background
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",        // chat width
          background: "#ffffff",    // card-like background for chat
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#333",          // subtle dark gray for header
            fontFamily: "Arial, sans-serif",
          }}
        >
          SupportHub Chat
        </h1>

        {ticketId !== null ? (
          <ChatWindow ticketId={ticketId} />
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>Loading ticket...</p>
        )}
      </div>
    </div>
  );
}

export default App;
