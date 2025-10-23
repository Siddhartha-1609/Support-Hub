import axios from "axios";

const API_BASE = "http://localhost:8000/api";

// Fetch AI suggestions for a ticket
export async function getSuggestions(ticketId: number) {
  try {
    const res = await axios.get(`${API_BASE}/tickets/${ticketId}/suggestions/`);
    return res.data || [];
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return [];
  }
}

// Fetch all messages for a ticket
export async function getMessages(ticketId: number) {
  try {
    const res = await axios.get(`${API_BASE}/tickets/${ticketId}/messages/`);
    return res.data || [];
  } catch (err) {
    console.error("Error fetching messages:", err);
    return [];
  }
}

// Send a new message for a ticket
export async function sendMessage(ticketId: number, text: string) {
  try {
    const res = await axios.post(`${API_BASE}/tickets/${ticketId}/messages/`, {
      text,
    });
    return res.data;
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
}
