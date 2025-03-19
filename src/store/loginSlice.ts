import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  id: null,
  nickname: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login(state, action) {
      state.isLogin = true;
      state.id = action.payload.id;
      state.nickname = action.payload.nickname;
    },
    deslogin(state) {
      state.isLogin = false;
      state.id = null;
      state.nickname = "";
    },
  },
});

export const { login, deslogin } = loginSlice.actions;

export default loginSlice.reducer;
