const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const raw = await res.text();
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!res.ok) {
    const message =
      (typeof data === "string" && data) ||
      data?.error ||
      "Request failed";

    if (res.status === 401) {
      localStorage.removeItem("token");
    }

    throw new Error(message);
  }

  return data;
}

export const createMeeting = async (data) =>
  request("/api/meetings", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMeeting = async (id) => request(`/api/meetings/${id}`);

export const getVotes = async (meetingId) =>
  request(`/api/votes/meeting/${meetingId}`);

export const castVote = async ({ meeting_id, proposed_slot_id }) =>
  request("/api/votes", {
    method: "POST",
    body: JSON.stringify({ meeting_id, proposed_slot_id }),
  });

export const login = async ({ email, password }) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = async ({ name, email, password, timezone }) =>
  request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, timezone }),
  });

export const confirmMeeting = async (meetingId, slotId) =>
  request(`/api/meetings/${meetingId}/confirm`, {
    method: "POST",
    body: JSON.stringify({ slot_id: slotId }),
  });

// --- AVAILABILITY API (Fixed to use your custom request wrapper!) ---

export const getMySlots = async () => request("/api/availability");

export const addSlot = async (slotData) =>
  request("/api/availability", {
    method: "POST",
    body: JSON.stringify(slotData),
  });

export const deleteSlot = async (id) =>
  request(`/api/availability/${id}`, {
    method: "DELETE",
  });