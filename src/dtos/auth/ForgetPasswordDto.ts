export interface SendOtpDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  newPassword: string;
  otp: string;
}
