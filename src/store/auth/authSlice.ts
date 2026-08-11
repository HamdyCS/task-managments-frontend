import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type UserDto from "../../dtos/auth/UserDto";

interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  forgotPasswordNewPassword: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  forgotPasswordNewPassword: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setForgotPasswordNewPassword: (state, action: PayloadAction<string>) => {
      state.forgotPasswordNewPassword = action.payload;
    },
    clearForgotPasswordNewPassword: (state) => {
      state.forgotPasswordNewPassword = "";
    },
  },
});

export const { setUser, clearUser, setForgotPasswordNewPassword, clearForgotPasswordNewPassword } = authSlice.actions;

export default authSlice.reducer;