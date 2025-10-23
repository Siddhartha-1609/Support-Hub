import { useState, useEffect, useRef } from "react";
import { getMessages, getSuggestions, sendMessage } from "../api/chat";

const ChatWindow: React.FC<{ ticketId: number }> = ({ ticketId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: string; timestamp?: string }[]
  >([]);
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
      const messagesWithTime = data.map((m: any) => ({
        ...m,
        timestamp:
          m.timestamp ||
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
      setMessages(messagesWithTime);
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
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      await sendMessage(ticketId, input);
      setMessages((prev) => [...prev, { text: input, sender: "user", timestamp }]);
      setInput("");
      fetchSuggestionsFn();
    } catch (err) {
      console.error("Failed to send message:", err);
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
        width: "auto",
        maxWidth: "100%",
        background: colors.chatBg,
        borderRadius: "16px",
        padding: "1rem",
        overflow: "hidden",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
      }}
    >
      {/* Messages container */}
      <div
        className="messages-container"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          paddingTop: "12px",
          paddingBottom: "12px",
          paddingLeft: "8px",
          paddingRight: "8px",
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
            {m.timestamp && (
              <small
                style={{
                  fontSize: "10px",
                  color: "#777",
                  marginTop: "2px",
                }}
              >
                {m.timestamp}
              </small>
            )}
          </div>
        ))}

        {suggestions.map((s, i) => (
          <div
            key={`sugg-${i}`}
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <span
              onClick={() => setInput(s)}
              style={{
                background: colors.suggestion,
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

      {/* Input bar */}
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
          .messages-container::-webkit-scrollbar {
            width: 8px;
          }
          .messages-container::-webkit-scrollbar-track {
            background: #ECEAFF;
            border-radius: 4px;
          }
          .messages-container::-webkit-scrollbar-thumb {
            background-color: ${colors.scrollbar};
            border-radius: 4px;
          }
          .messages-container::-webkit-scrollbar-thumb:hover {
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
