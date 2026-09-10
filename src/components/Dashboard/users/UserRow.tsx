import { useTranslation } from "react-i18next";
import getRoleBadgeClasses from "../../../utils/getRoleBadgeClasses";
import type AdminUserDto from "../../../dtos/admin/AdminUserDto";

interface Props {
  user: AdminUserDto;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-primary/10 text-primary",
    "bg-success/10 text-success",
    "bg-warning/10 text-warning",
    "bg-destructive/10 text-destructive",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function UserRow({ user }: Props) {
  const { t } = useTranslation();
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarColor(fullName)}`}
          >
            {getInitials(user.firstName, user.lastName)}
          </div>
          <span className="font-medium text-card-foreground">{fullName}</span>
        </div>
      </td>
      <td className="p-4 text-muted-foreground">{user.email}</td>
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "Admin" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}
        >
          {t(`dashboard.admin.users.role.${user.role}`)}
        </span>
      </td>
      <td className="p-4 text-muted-foreground text-sm text-nowrap">
        {user.dateOfBirth}
      </td>
    </tr>
  );
}
