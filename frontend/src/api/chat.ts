import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export async function getSuggestions(ticketId: number) {
  try {
    const res = await axios.get(`${API_BASE}/tickets/${ticketId}/suggestions/`);
    return res.data || [];
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return [];
  }
}

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
