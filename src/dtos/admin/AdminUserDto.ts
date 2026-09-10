import type { Role } from "../../types/Role";

export default interface AdminUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  role: Role;
}
