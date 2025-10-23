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

  // Option 3 – Lavender & Soft Gray
  const userMsg = "#A18AFF";       // lavender
  const aiMsg = "#F4F4F9";         // very light gray
  const suggestion = "#DAD0FF";    // pastel lavender
  const sendBtn = "#8C6BFF";       // muted lavender
  const chatBg = "#FAF9FF";        // off-white
  const scrollbar = "#A18AFF";     // matches user messages

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "450px",
        background: chatBg,
        borderRadius: "14px",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      {/* Messages + AI Suggestions */}
      <div
        className="messages"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "1rem",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <span
              style={{
                background: m.sender === "user" ? userMsg : aiMsg,
                color: m.sender === "user" ? "#fff" : "#000",
                borderRadius: "12px",
                padding: "8px 14px",
                maxWidth: "70%",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}

        {/* Suggestions as bubbles */}
        {suggestions.map((s, i) => (
          <div
            key={`sugg-${i}`}
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <span
              onClick={() => setInput(s)}
              style={{
                background: suggestion,
                color: "#000",
                borderRadius: "12px",
                padding: "6px 12px",
                fontSize: "14px",
                lineHeight: "1.4",
                cursor: "pointer",
                maxWidth: "70%",
              }}
            >
              {s}
            </span>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            border: `1px solid ${userMsg}`,
            background: userMsg,
            color: "#fff",
            textAlign: "center",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 18px",
            borderRadius: "12px",
            background: sendBtn,
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      {/* Scrollbar styling */}
      <style>
        {`
          .chat-window .messages::-webkit-scrollbar {
            width: 8px;
          }
          .chat-window .messages::-webkit-scrollbar-track {
            background: #ECEAFF;
            border-radius: 4px;
          }
          .chat-window .messages::-webkit-scrollbar-thumb {
            background-color: ${scrollbar};
            border-radius: 4px;
          }
          .chat-input::placeholder {
            color: #D9D6FF;
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

export default ChatWindow;
