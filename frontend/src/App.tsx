import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import { createTicket, getTickets } from "./api/chat";

interface Ticket {
  id: number;
  title: string;
}

function App() {
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
      if (data.length > 0 && !ticketId) setTicketId(data[0].id);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleNewChat = async () => {
    try {
      const newTicket = await createTicket("New Chat");
      setTickets((prev) => [newTicket, ...prev]);
      setTicketId(newTicket.id);
    } catch (err) {
      console.error("Failed to create ticket:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#f0edf7",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#ffffff",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <button
          onClick={handleNewChat}
          style={{
            padding: "10px",
            borderRadius: "12px",
            background: "#967afc",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          + New Chat
        </button>

        <h3 style={{ margin: "0 0 0.5rem 0", color: "#3B3A5B" }}>Chats</h3>

        {tickets.map((t) => (
          <div
            key={t.id}
            onClick={() => setTicketId(t.id)}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              background: t.id === ticketId ? "#DAD0FF" : "#f4f4f9",
              cursor: "pointer",
              fontWeight: t.id === ticketId ? 600 : 400,
              color: "#000",
              marginBottom: "4px",
            }}
          >
            {t.title || `Ticket #${t.id}`}
          </div>
        ))}

        {/* Sidebar scrollbar styling */}
        <style>
          {`
            div::-webkit-scrollbar {
              width: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f0edf7;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background-color: #967afc;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background-color: #8C6BFF;
            }
          `}
        </style>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "1rem 1.5rem 1rem 1rem", // extra right padding
          overflow: "hidden",
        }}
      >
        {ticketId !== null ? (
          <ChatWindow ticketId={ticketId} />
        ) : (
          <p style={{ color: "#666", textAlign: "center" }}>Loading ticket...</p>
        )}
      </div>
    </div>
  );
}

export default App;
