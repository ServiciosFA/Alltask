import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginSlice";
import notifyReducer from "./notifiSlice";

export const store = configureStore({
  reducer: { login: loginReducer, notify: notifyReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
