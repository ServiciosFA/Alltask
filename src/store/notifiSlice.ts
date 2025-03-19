import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationState } from "../types/dashboard";

const initialState: NotificationState = {
  type: null,
  message: null,
};

const notifiSlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "info";
      }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearNotification: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});
export const { showNotification, clearNotification } = notifiSlice.actions;

export default notifiSlice.reducer;
