import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeIn } from "../../../animations";

interface ActivityItem {
  id: number;
  dotColor: string;
  text: string;
  timestamp: string;
}

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    dotColor: "bg-primary",
    text: 'Alex moved <span class="font-medium text-primary">Homepage Redesign</span> to In Progress',
    timestamp: "10 mins ago",
  },
  {
    id: 2,
    dotColor: "bg-success",
    text: 'Maria completed <span class="font-medium text-primary">API Documentation</span>',
    timestamp: "1 hour ago",
  },
  {
    id: 3,
    dotColor: "bg-muted-foreground",
    text: 'You commented on <span class="font-medium text-primary">Auth Module</span>',
    timestamp: "2 hours ago",
  },
  {
    id: 4,
    dotColor: "bg-destructive",
    text: 'System marked <span class="font-medium text-primary">DB Migration</span> as overdue',
    timestamp: "Yesterday",
  },
];

export default function RecentActivity() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl p-6 shadow-sm flex flex-col"
    >
      <h2 className="font-semibold text-lg text-card-foreground mb-6">
        {t("dashboard.recentActivity")}
      </h2>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {FALLBACK_ACTIVITIES.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div
              className={`w-2 h-2 rounded-full ${item.dotColor} mt-2 shrink-0`}
            />
            <div>
              <div
                className="text-sm text-card-foreground"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
              <div className="text-xs text-muted-foreground mt-0.5">
                {item.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
