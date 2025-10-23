import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface MessageType {
  text: string;
  sender: "user" | "ai";
  timestamp?: string;
}

const API_BASE = "http://localhost:8000/api/chat";

const ChatWindow: React.FC<{ ticketId: number }> = ({ ticketId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages + suggestions on mount or ticket change
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${ticketId}/messages/`);
        setMessages(
          res.data.messages.map((m: any) => ({
            text: m.content,
            sender: m.is_agent ? "ai" : "user",
            timestamp: m.timestamp
              ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : undefined,
          }))
        );
        setSuggestions(res.data.suggestions);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchAll();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, suggestions]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { text: userText, sender: "user", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);

    try {
      const res = await axios.post(`${API_BASE}/${ticketId}/send/`, { text: userText });
      const aiText = res.data.ai_reply;
      const newSuggestions = res.data.suggestions || [];

      setMessages((prev) => [
        ...prev,
        { text: aiText, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);

      setSuggestions(newSuggestions);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const colors = {
    userMsg: "#967afc",
    aiMsg: "#F4F4F9",
    suggestion: "#DAD0FF",
    sendBtn: "#8C6BFF",
    chatBg: "#FAF9FF",
    scrollbar: "#967afc",
    inputText: "#fff",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        padding: "1rem",
        background: colors.chatBg,
        borderRadius: "16px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Messages */}
      <div
        className="chat-window messages"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "1rem",
          paddingRight: "8px",
          paddingTop: "4px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: m.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <span
              style={{
                background: m.sender === "user" ? colors.userMsg : colors.aiMsg,
                color: m.sender === "user" ? colors.inputText : "#000",
                borderRadius: "12px",
                padding: "8px 14px",
                maxWidth: "70%",
                fontSize: "14px",
                lineHeight: "1.4",
                textAlign: "left",
              }}
            >
              {m.text}
            </span>
            {m.timestamp && <small style={{ fontSize: "10px", color: "#777", marginTop: "2px" }}>{m.timestamp}</small>}
          </div>
        ))}

        {/* Suggestions */}
        {suggestions.map((s, i) => (
          <div key={`sugg-${i}`} style={{ marginBottom: "4px" }}>
            <span
              style={{
                background: colors.suggestion,
                color: "#000",
                borderRadius: "12px",
                padding: "6px 12px",
                fontSize: "14px",
                lineHeight: "1.4",
                maxWidth: "70%",
                display: "inline-block",
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
            border: `1px solid ${colors.userMsg}`,
            background: colors.userMsg,
            color: colors.inputText,
            textAlign: "center",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 18px",
            borderRadius: "12px",
            background: colors.sendBtn,
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
          .chat-window.messages::-webkit-scrollbar {
            width: 8px;
          }
          .chat-window.messages::-webkit-scrollbar-track {
            background: #ECEAFF;
            border-radius: 4px;
          }
          .chat-window.messages::-webkit-scrollbar-thumb {
            background-color: ${colors.scrollbar};
            border-radius: 4px;
          }
          .chat-window.messages::-webkit-scrollbar-thumb:hover {
            background-color: #8C6BFF;
          }
          ::placeholder {
            color: rgba(255,255,255,0.7);
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

export default ChatWindow;
