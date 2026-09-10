import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiUsers,
  FiFolder,
  FiCheckCircle,
  FiBarChart2,
} from "react-icons/fi";
import { useAdminWorkspaceDetails } from "../../../../hooks/admin/useAdminWorkspaceDetails";

interface Props {
  workspaceId: number | null;
  isOpen: boolean;
  initialSection?: "overview" | "members" | "projects";
  onClose: () => void;
}

export default function AdminWorkspaceDetailsDrawer({
  workspaceId,
  isOpen,
  initialSection = "overview",
  onClose,
}: Props) {
  const { t } = useTranslation();
  const { data: details, isLoading } = useAdminWorkspaceDetails(
    isOpen ? workspaceId : null,
  );

  const membersRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!details || isLoading) return;

    const timer = setTimeout(() => {
      if (initialSection === "members" && membersRef.current) {
        membersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (initialSection === "projects" && projectsRef.current) {
        projectsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [details, isLoading, initialSection]);

  const overview = details?.workSpaceOverview;
  const firstOwner = overview?.ownersNames[0] || "—";

  console.log(details);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-full bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-card-foreground">
                {t("dashboard.admin.workspaces.details.title")}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : details && overview ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">
                          {overview.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-card-foreground">
                          {overview.name}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5 text-sm">
                        <FiUser size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t("dashboard.admin.workspaces.details.owner")}:
                        </span>
                        <span className="text-card-foreground font-medium">{firstOwner}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-sm">
                        <FiUsers size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t("dashboard.admin.workspaces.details.membersCount")}:
                        </span>
                        <span className="text-card-foreground font-medium">{overview.membersCount}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-sm">
                        <FiFolder size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t("dashboard.admin.workspaces.details.projectsCount")}:
                        </span>
                        <span className="text-card-foreground font-medium">{overview.projectsCount}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-sm">
                        <FiBarChart2 size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t("dashboard.admin.workspaces.details.tasksCount")}:
                        </span>
                        <span className="text-card-foreground font-medium">{overview.tasksCount}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-sm col-span-2">
                        <FiCheckCircle size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t("dashboard.admin.workspaces.details.completion")}:
                        </span>
                        <span className="text-card-foreground font-medium">{details.completionPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-5" ref={membersRef}>
                    <h4 className="text-sm font-semibold text-card-foreground mb-3">
                      {t("dashboard.admin.workspaces.details.membersSection")}
                    </h4>
                    {details.members.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.admin.workspaces.details.noMembers")}
                      </p>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {details.members.map((member) => {
                          const initials = member.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2);

                          const colors = [
                            "bg-primary/10 text-primary",
                            "bg-success/10 text-success",
                            "bg-warning/10 text-warning",
                            "bg-destructive/10 text-destructive",
                          ];
                          let hash = 0;
                          for (let i = 0; i < member.fullName.length; i++) {
                            hash = member.fullName.charCodeAt(i) + ((hash << 5) - hash);
                          }
                          const avatarColor = colors[Math.abs(hash) % colors.length];

                          return (
                            <div key={member.id} className="flex items-center gap-3 py-2.5">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${avatarColor}`}
                              >
                                {initials}
                              </div>
                              <span className="text-sm font-medium text-card-foreground">
                                {member.fullName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-5" ref={projectsRef}>
                    <h4 className="text-sm font-semibold text-card-foreground mb-3">
                      {t("dashboard.admin.workspaces.details.projectsSection")}
                    </h4>
                    {details.projectNames.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.admin.workspaces.details.noProjects")}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {details.projectNames.map((projectName) => (
                          <div
                            key={projectName}
                            className="flex items-center gap-2.5 py-2"
                          >
                            <FiFolder size={14} className="text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-card-foreground">{projectName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
