import { useState, useEffect } from "react";
import { getSuggestions, sendMessage } from "../api/chat";

const ChatWindow: React.FC<{ ticketId: number }> = ({ ticketId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchMessages();
    fetchSuggestionsFn();
    const interval = setInterval(fetchSuggestionsFn, 8000);
    return () => clearInterval(interval);
  }, [ticketId]);

  const fetchMessages = async () => {
    const res = await fetch(`/api/tickets/${ticketId}/messages/`);
    const data = await res.json();
    setMessages(data);
  };

  const fetchSuggestionsFn = async () => {
    const data = await getSuggestions(ticketId);
    setSuggestions(data);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(ticketId, input);
    setInput("");
    fetchMessages();
    fetchSuggestionsFn();
  };

  return (
    <div
      className="chat-window"
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "1rem",
      }}
    >
      <div className="messages" style={{ minHeight: "200px", marginBottom: "1rem" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{ textAlign: m.sender === "user" ? "right" : "left", margin: "5px 0" }}
          >
            <span
              style={{
                background: "#eef",
                borderRadius: "8px",
                padding: "5px 10px",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions" style={{ marginBottom: "1rem" }}>
          <p><strong>💡 AI Suggestions</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                style={{
                  border: "none",
                  background: "#f0f0ff",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="input-area" style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: "#4a90e2",
            color: "white",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
