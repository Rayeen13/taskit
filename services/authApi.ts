const BASE_URL = "http://10.123.84.142:3000/api"; // Node.js backend
// const BASE_URL = "http://10.123.84.198:8000/api"; // Laravel backend

export const registerRequest = async (data: any) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginRequest = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};
