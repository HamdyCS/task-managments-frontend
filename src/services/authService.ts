import { Axios } from "../api/Axios";
import type LoginDto from "../dtos/auth/LoginDto";
import config from "../config";

export async function login(loginDto: LoginDto) {
  await Axios.post(config.auth.login, loginDto);
}
