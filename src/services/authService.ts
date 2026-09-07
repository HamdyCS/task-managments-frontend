import { api, authApi, refreshTokenApi } from "../api/Axios";
import type LoginDto from "../dtos/auth/LoginDto";
import type RegisterDto from "../dtos/auth/RegisterDto";
import type UserDto from "../dtos/auth/UserDto";
import type UpdateProfileDto from "../dtos/auth/UpdateProfileDto";
import type ChangeEmailDto from "../dtos/auth/ChangeEmailDto";
import type ResetPasswordWithTokenDto from "../dtos/auth/ResetPasswordWithTokenDto";
import type {
  SendOtpDto,
  ResetPasswordDto,
} from "../dtos/auth/ForgetPasswordDto";
import config from "../config";

export async function register(
  registerDto: RegisterDto,
): Promise<{ id: string }> {
  const { data } = await authApi.post<{ id: string }>(
    config.auth.register,
    registerDto,
  );
  return data;
}

export async function login(loginDto: LoginDto) {
  await authApi.post(config.auth.login, loginDto);
}

export async function getCurrentUser(): Promise<UserDto> {
  const { data } = await authApi.get<UserDto>(config.auth.currentUser);
  return data;
}

export async function refreshToken() {
  await refreshTokenApi.post(config.auth.refreshToken);
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

export async function logout() {
  await authApi.post(config.auth.logout);
}

export async function confirmEmail(email: string, token: string) {
  await authApi.post(config.auth.confirmEmail, null, {
    params: { email, token },
  });
}

export async function updateProfile(dto: UpdateProfileDto): Promise<UserDto> {
  const { data } = await api.put<UserDto>(config.auth.updateProfile, dto);
  return data;
}

export async function sendChangeEmail(email: string) {
  await api.post(config.auth.changeEmail.sendEmail, null, {
    params: { email },
  });
}

export async function confirmChangeEmail(dto: ChangeEmailDto) {
  await api.post(config.auth.changeEmail.confirm, dto);
}

export async function sendPasswordResetEmail() {
  await api.post(config.auth.resetPassword.sendEmail);
}

export async function deleteAccountSendEmail() {
  await api.post(config.auth.deleteAccount.sendEmail);
}

export async function deleteAccountConfirm(token: string) {
  await api.delete(config.auth.deleteAccount.delete, { data: { token } });
}

export async function resetPasswordWithToken(dto: ResetPasswordWithTokenDto) {
  await api.post(config.auth.resetPassword.reset, dto);
}
