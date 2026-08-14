import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeIn } from "../../../animations";

interface TeamMember {
  id: string;
  name: string;
  assignedCount: number;
  inProgressCount: number;
  doneCount: number;
}

interface Props {
  members: TeamMember[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getProgressColor(index: number): string {
  const colors = ["bg-success", "bg-primary", "bg-warning"];
  return colors[index % colors.length];
}

export default function TeamPerformance({ members }: Props) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-card border rounded-xl shadow-sm overflow-hidden p-6"
    >
      <h2 className="font-semibold text-lg text-card-foreground mb-6">
        {t("dashboard.teamPerformance")}
      </h2>
      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No team data available
          </div>
        ) : (
          members.map((member, index) => {
            const progress =
              member.assignedCount > 0
                ? (member.doneCount / member.assignedCount) * 100
                : 0;
            return (
              <div
                key={member.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-card-foreground shrink-0">
                    {getInitials(member.name)}
                  </div>
                  <span className="text-sm font-medium text-card-foreground truncate">
                    {member.name}
                  </span>
                </div>
                <div className="w-1/2 px-4">
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`${getProgressColor(index)} h-1.5 rounded-full transition-all duration-700`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="w-1/6 text-right text-xs text-muted-foreground font-medium">
                  {member.doneCount} of {member.assignedCount} completed
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
