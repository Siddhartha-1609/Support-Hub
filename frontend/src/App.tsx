import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";

function App() {
  const API_BASE = "http://localhost:8000/api";
  const [ticketId, setTicketId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/tickets/latest/`)
      .then((res) => res.json())
      .then((data) => setTicketId(data.id))
      .catch(() => setTicketId(null));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#FAF9FF", // matches chat background
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1rem", color: "#2c183dff" }}>
        SupportHub Chat
      </h1>
      {ticketId !== null ? (
        <ChatWindow ticketId={ticketId} />
      ) : (
        <p>Loading ticket...</p>
      )}
    </div>
  );
}

export default App;
