// const BASE_URL = "http://10.123.84.142:3000/api"; // Node.js backend
const BASE_URL = "http://10.123.84.198:8000/api"; // Laravel backend

/* 🔥 COMMON FETCH HANDLER */
const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, options);

    // server responded but error status
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.log("API ERROR:", url, err);

    // throw so sync system catches it
    throw err;
  }
};

/* =========================
   GET NOTES
========================= */
export const getNotes = async (user_id: number) => {
  return safeFetch(`${BASE_URL}/notes?user_id=${user_id}`);
};

/* =========================
   CREATE
========================= */
export const createNote = async (data: any) => {
  return safeFetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

/* =========================
   UPDATE
========================= */
export const updateNoteApi = async (id: string, user_id: number, data: any) => {
  return safeFetch(`${BASE_URL}/notes/${id}?user_id=${user_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

/* =========================
   DELETE
========================= */
export const deleteNoteApi = async (id: string, user_id: number) => {
  return safeFetch(`${BASE_URL}/notes/${id}?user_id=${user_id}`, {
    method: "DELETE",
  });
};
