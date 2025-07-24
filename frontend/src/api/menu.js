import axios from "../lib/axios";

export const fetchMenus = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get("/api/menu", { headers });
    return res.data;
  } catch (err) {
    console.error("에러원인:", err);
    return [];
  }
};
