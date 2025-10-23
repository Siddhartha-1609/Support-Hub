import { useEffect, useState } from "react";
import { getTickets } from "../api/chat";

interface Ticket {
  id: number;
  title: string;
}

const Sidebar: React.FC<{ onSelect: (id: number) => void; activeId: number | null }> = ({ onSelect, activeId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      const data = await getTickets();
      setTickets(data);
    }
    fetchTickets();
  }, []);

  return (
    <div style={{
      width: "220px",
      background: "#F4F4F9",
      padding: "1rem",
      borderRight: "1px solid #ddd",
      height: "100vh",
      boxSizing: "border-box",
      overflowY: "auto"
    }}>
      <h3 style={{ marginBottom: "1rem", color: "#3B3A5B" }}>Chats</h3>
      {tickets.map((t) => (
        <div
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "8px",
            background: activeId === t.id ? "#8C6BFF" : "#fff",
            color: activeId === t.id ? "#fff" : "#000",
            cursor: "pointer",
            fontWeight: 500,
            boxShadow: activeId === t.id ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
          }}
        >
          {t.title || `Ticket #${t.id}`}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
