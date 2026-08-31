import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import type WorkSpaceDto from "../../../dtos/workspace/WorkSpaceDto";

type WorkspaceFormMode = "create" | "edit";

interface Props {
  isOpen: boolean;
  mode: WorkspaceFormMode;
  workspace?: WorkSpaceDto | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

export default function WorkspaceFormDialog({
  isOpen,
  mode,
  workspace,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const prevIsOpen = useRef(false);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      const newName = mode === "edit" && workspace ? workspace.name : "";
      const newDesc =
        mode === "edit" && workspace ? (workspace.description ?? "") : "";
      setName(newName);
      setDescription(newDesc);
      setErrors({});
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, mode, workspace]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = t("dashboard.workspaces.form.name") + " is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <div className="relative z-10 flex items-center justify-center w-full max-w-md mx-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-popover text-popover-foreground border border-border rounded-xl shadow-lg w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {mode === "create"
                    ? t("dashboard.workspaces.create.title")
                    : t("dashboard.workspaces.edit.title")}
                </h2>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1 text-muted-foreground hover:text-card-foreground rounded-lg transition-colors cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1.5">
                    {t("dashboard.workspaces.form.name")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({});
                    }}
                    placeholder={t("dashboard.workspaces.form.namePlaceholder")}
                    className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1.5">
                    {t("dashboard.workspaces.form.description")}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("dashboard.workspaces.form.descriptionPlaceholder")}
                    rows={3}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
                  >
                    {t("dashboard.workspaces.delete.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ...
                      </span>
                    ) : mode === "create" ? (
                      t("dashboard.workspaces.create.button")
                    ) : (
                      t("dashboard.workspaces.edit.title")
                    )}
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
