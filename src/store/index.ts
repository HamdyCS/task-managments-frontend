import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import themeReducer from "./theme/theme";
import selectedWorkSpaceReducer from "./dashboard/selectedWorkSpace";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    selectedWorkSpace: selectedWorkSpaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
