// const BASE_URL = "http://10.123.84.28:8000/adminpanel";
const BASE_URL = "http://islamicishtehar.com/adminpanel/api";

/* ================= POSTS ================= */
export const getPosts = async () => {
  const res = await fetch(`${BASE_URL}/post`);
  const json = await res.json();
  return json;
};

/* ================= HADEES ================= */
export const getHadees = async () => {
  const res = await fetch(`${BASE_URL}/hadees_content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({}), // some Laravel APIs require even empty body
  });

  return res.json();
};

/* ================= NAMAZ ================= */
export const getNamazTimes = async () => {
  const res = await fetch(`${BASE_URL}/namaz-times`);
  const json = await res.json();
  return json;
};
