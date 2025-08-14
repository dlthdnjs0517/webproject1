import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

function getinitialAuth() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return { user: null, isLoggedIn: false, role: "guest" };

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("jwtToken");
      return { user: null, isLoggedIn: false, role: "guest" };
    }
    return {
      user: decoded,
      isLoggedIn: true,
      role: decoded.role || "guest",
    };
  } catch {
    localStorage.removeItem("jwtToken");
    return { user: null, isLoggedIn: false, role: "guest" };
  }
}

const initialState = getinitialAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token } = action.payload || {};
      if (token) {
        localStorage.setItem("jwtToken", token);
        try {
          const decoded = jwtDecode(token);
          state.user = decoded;
          state.role = decoded.role;
          state.isLoggedIn = true;
          return;
        } catch {
          localStorage.removeItem("jwtToken");
        }
      }
    },
    logout: (state) => {
      localStorage.removeItem("jwtToken");
      state.user = null;
      state.isLoggedIn = false;
      state.role = "guest";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
//export default 는 이름 마음대로 지을 수 있음
