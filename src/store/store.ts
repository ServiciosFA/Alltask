import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { loginSlice } from "./loginSlice";
import notifiSlice from "./notifiSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // 🔹 sessionStorage, no localStorage

// Configuración de persistencia
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login"], // 🔹 Solo persistimos el login
};

const rootReducer = combineReducers({
  login: loginSlice.reducer,
  notify: notifiSlice,
});

// Aplicamos persistencia solo al rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Creamos el store con el reducer persistido
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
// ✅ Exportamos `RootState` para que pueda ser usado en useSelector
export type RootState = ReturnType<typeof rootReducer>;
// ✅ Exportamos `AppDispatch` (opcional, pero recomendado)
export type AppDispatch = typeof store.dispatch;
// Creamos el persistor
export const persistor = persistStore(store);
