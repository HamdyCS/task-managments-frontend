export function formatTimeAgo(dateString: string): string {
  // to avoid the -3 hours difference between the browser and the server (create date is utc)
  const date = !dateString.endsWith("Z")
    ? new Date(dateString.trim() + "Z")
    : new Date(dateString);

  //get browser time
  const now = new Date();

  //get difference in milliseconds
  const diffMs = now.getTime() - date.getTime();

  //convert to minutes, hours, days
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  //if more than a week ago, return the date with the format: mm/dd/yyyy
  return date.toLocaleDateString();
}
