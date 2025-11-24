import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

//1. 초기 상태 만들기 함수, 새로고침해도 로그인 유지하는 역할
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

//2. 초기 상태 설정
const initialState = getinitialAuth();

//3. Slice 생성
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
