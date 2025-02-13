import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login(state) {
      state.isLogin = true;
    },
    deslogin(state) {
      state.isLogin = false;
    },
  },
});

export const { login, deslogin } = loginSlice.actions;

export default loginSlice.reducer;
