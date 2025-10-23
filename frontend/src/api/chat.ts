import axios from "axios";

const API_BASE = "http://localhost:8000/api";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // replace with your storage method
  if (!token) return {};
  return {
    Authorization: `Token ${token}`, // or `Bearer ${token}` if using JWT
  };
};

// Fetch messages for a ticket
export async function getMessages(ticketId: number) {
  try {
    const res = await axios.get(`${API_BASE}/tickets/${ticketId}/messages/`, {
      headers: getAuthHeaders(),
    });
    return res.data || [];
  } catch (err) {
    console.error("Error fetching messages:", err);
    return [];
  }
}

// Fetch AI suggestions for a ticket
export async function getSuggestions(ticketId: number) {
  try {
    const res = await axios.get(`${API_BASE}/tickets/${ticketId}/suggestions/`, {
      headers: getAuthHeaders(),
    });
    return res.data || [];
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return [];
  }
}

// Send a message for a ticket
export async function sendMessage(ticketId: number, text: string) {
  try {
    const res = await axios.post(
      `${API_BASE}/tickets/${ticketId}/messages/`,
      { text },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
}

// Fetch all tickets
export async function getTickets() {
  try {
    const res = await axios.get(`${API_BASE}/tickets/`, {
      headers: getAuthHeaders(),
    });
    return res.data || [];
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return [];
  }
}

// Create a new ticket
export async function createTicket(title: string) {
  try {
    const res = await axios.post(
      `${API_BASE}/tickets/create/`,
      { title },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    console.error("Error creating ticket:", err);
    throw err;
  }
}
