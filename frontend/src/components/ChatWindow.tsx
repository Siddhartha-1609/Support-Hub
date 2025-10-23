import { useState, useEffect, useRef } from "react";
import { getMessages, getSuggestions, sendMessage } from "../api/chat";

const ChatWindow: React.FC<{ ticketId: number }> = ({ ticketId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    fetchSuggestionsFn();
    const interval = setInterval(fetchSuggestionsFn, 8000);
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, suggestions]);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(ticketId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const fetchSuggestionsFn = async () => {
    try {
      const data = await getSuggestions(ticketId);
      setSuggestions(data);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage(ticketId, input);
      setInput("");
      fetchMessages();
      fetchSuggestionsFn();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // Modern muted color palette
  const userBlue = "#6c8edb";       // soft muted blue
  const aiGray = "#e0e0e0";         // soft gray for AI messages
  const sendBlue = "#5b7ac9";       // slightly darker for send button

  return (
    <div
      className="chat-window"
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        border: `1px solid #ccc`,
        borderRadius: "16px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        height: "550px",
        background: "#fafafa",
        fontFamily: "Arial, sans-serif",
        color: "#000",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Messages */}
      <div
        className="messages"
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "1rem",
          padding: "0 10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
              margin: "6px 0",
            }}
          >
            <span
              style={{
                background: m.sender === "user" ? userBlue : aiGray,
                borderRadius: "14px",
                padding: "10px 16px",
                maxWidth: "70%",
                color: m.sender === "user" ? "#fff" : "#000",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="suggestions" style={{ marginBottom: "1rem" }}>
          <p style={{ fontWeight: "600", marginBottom: "8px", fontSize: "14px" }}>💡 Suggestions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                style={{
                  alignSelf: "flex-start",
                  border: "none",
                  background: aiGray,
                  borderRadius: "12px",
                  padding: "6px 14px",
                  cursor: "pointer",
                  color: "#000",
                  fontSize: "14px",
                  textAlign: "left",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="input-area" style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            border: `1px solid ${userBlue}`,
            background: userBlue,
            color: "#fff",
            textAlign: "center",
            fontSize: "14px",
          }}
          className="chat-input"
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 18px",
            borderRadius: "12px",
            background: sendBlue,
            color: "#fff",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Send
        </button>
      </div>

      {/* Scrollbar and placeholder styling */}
      <style>
        {`
          .chat-window .messages::-webkit-scrollbar {
            width: 8px;
          }
          .chat-window .messages::-webkit-scrollbar-track {
            background: #f5f5f5;
            border-radius: 4px;
          }
          .chat-window .messages::-webkit-scrollbar-thumb {
            background-color: ${userBlue};
            border-radius: 4px;
          }
          .chat-input::placeholder {
            color: #d0d0d0;
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

export default ChatWindow;
