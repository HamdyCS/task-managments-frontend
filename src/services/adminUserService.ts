import { authApi } from "../api/Axios";
import config from "../config";
import type AdminUserDto from "../dtos/admin/AdminUserDto";
import type PaginationResultDto from "../dtos/workspace/PaginationResultDto";
import type RegisterDto from "../dtos/auth/RegisterDto";

export async function getAllUsers(
  page: number,
  pageSize: number,
): Promise<PaginationResultDto<AdminUserDto>> {
  const { data } = await authApi.get<PaginationResultDto<AdminUserDto>>(
    config.admin.users.all(page, pageSize),
  );
  return data;
}

export async function registerAdmin(
  registerDto: RegisterDto,
): Promise<{ id: string }> {
  const { data } = await authApi.post<{ id: string }>(
    config.admin.registerAdmin,
    registerDto,
  );
  return data;
}
