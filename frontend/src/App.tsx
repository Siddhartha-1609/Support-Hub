import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";

function App() {
  const API_BASE = "http://localhost:8000/api";

  const [ticketId, setTicketId] = useState<number | null>(null);

  useEffect(() => {
  fetch(`${API_BASE}/tickets/latest/`)
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setTicketId(data.id);
    })
    .catch((err) => {
      console.error("Error fetching ticket:", err);
      setTicketId(null);
    });
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
