// ...existing code...
import ChatWindow from "./components/ChatWindow";
import { useEffect, useState } from "react";

function App() {
  const [ticketId, setTicketId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the latest ticket ID from backend
    fetch("/api/tickets/latest")
      .then((res) => res.json())
      .then((data) => setTicketId(data.id))
      .catch(() => setTicketId(null));
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>SupportHub Chat</h1>
      {ticketId !== null ? (
        <ChatWindow ticketId={ticketId} />
      ) : (
        <p>Loading ticket...</p>
      )}
    </div>
  );
}

export default App;
