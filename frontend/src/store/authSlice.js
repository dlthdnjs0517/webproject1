import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  role: "guest",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.role = action.payload.role || "guest";
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = "guest";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
