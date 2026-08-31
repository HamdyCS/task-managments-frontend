import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";
import useSendInvite from "../../../hooks/team/useSendInvite";
import type { WorkSpaceRole } from "../../../types/WorkSpaceRole";

interface Props {
  workspaceId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteMemberModal({
  workspaceId,
  isOpen,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkSpaceRole>("Member");

  const { mutateAsync: sendInviteMutation, isPending } = useSendInvite({
    onSuccess: () => {
      toast.success(t("dashboard.team.inviteModal.success"));
      resetForm();
      onClose();
    },
    onError: () => {
      toast.error(t("dashboard.team.inviteModal.error"));
    },
  });

  const resetForm = () => {
    setEmail("");
    setRole("Member");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    await sendInviteMutation({
      workSpaceId: workspaceId,
      inviteToEmail: email.trim(),
      workSpaceRole: role,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <div className="relative z-10 flex items-center justify-center w-100">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-popover text-popover-foreground border border-border rounded-xl shadow-lg w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {t("dashboard.team.inviteModal.title")}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {t("dashboard.team.inviteModal.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("dashboard.team.inviteModal.emailPlaceholder")}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {t("dashboard.team.inviteModal.role")}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "Member" | "ProjectManager")}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    <option value="Member">{t("dashboard.team.inviteModal.roles.member")}</option>
                    <option value="ProjectManager">{t("dashboard.team.inviteModal.roles.projectManager")}</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
                  >
                    {t("dashboard.team.inviteModal.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={!email.trim() || isPending}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isPending ? "..." : t("dashboard.team.inviteModal.send")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
