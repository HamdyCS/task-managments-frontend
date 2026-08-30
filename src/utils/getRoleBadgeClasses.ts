export default function getRoleBadgeClasses(role: string): string {
  switch (role) {
    case "Owner":
      return "bg-destructive/10 text-destructive";
    case "ProjectManager":
      return "bg-success/10 text-success";
    case "Member":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
}
