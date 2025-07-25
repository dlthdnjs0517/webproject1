import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return "guest";

  try {
    const decoded = jwtDecode(token);
    return decoded.role || "guest";
  } catch {
    return "guest";
  }
};

export const isLoggedIn = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};
