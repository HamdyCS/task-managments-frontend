import { api, authApi } from "../api/Axios";
import type LoginDto from "../dtos/auth/LoginDto";
import type UserDto from "../dtos/auth/UserDto";
import type {
  SendOtpDto,
  ResetPasswordDto,
} from "../dtos/auth/ForgetPasswordDto";
import config from "../config";

export async function login(loginDto: LoginDto) {
  await authApi.post(config.auth.login, loginDto);
}

export async function getCurrentUser(): Promise<UserDto> {
  const { data } = await authApi.get<UserDto>(config.auth.currentUser);
  return data;
}

export async function refreshToken() {
  await api.post(config.auth.refreshToken);
}

export async function sendOtp(dto: SendOtpDto) {
  await authApi.post(config.auth.forgetPassword.sendOtp, dto);
}

export async function resendOtp(dto: SendOtpDto) {
  await authApi.post(config.auth.forgetPassword.resendOtp, dto);
}

export async function resetPassword(dto: ResetPasswordDto) {
  await authApi.post(config.auth.forgetPassword.reset, dto);
}
