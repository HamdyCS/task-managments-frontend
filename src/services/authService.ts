import { Axios } from "../api/Axios";
import type LoginDto from "../dtos/auth/LoginDto";
import type UserDto from "../dtos/auth/UserDto";
import config from "../config";

export async function login(loginDto: LoginDto) {
  await Axios.post(config.auth.login, loginDto);
}

export async function getCurrentUser(): Promise<UserDto> {
  const { data } = await Axios.get<UserDto>(config.auth.currentUser);
  return data;
}

export async function refreshToken() {
  await Axios.post(config.auth.refreshToken);
}
