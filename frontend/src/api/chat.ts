import axios from "axios";

const API_BASE = "http://localhost:8000"; // adjust if your backend runs elsewhere

export async function getSuggestions(ticketId: number) {
  try {
    const res = await axios.get(`${API_BASE}/chat/suggestions/${ticketId}/`);
    return res.data.suggestions || [];
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return [];
  }
}

export async function sendMessage(ticketId: number, text: string) {
  try {
    const res = await axios.post(`${API_BASE}/chat/send_message/`, {
      ticket_id: ticketId,
      text,
    });
    return res.data;
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
}
