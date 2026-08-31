import { useTranslation } from "react-i18next";
import { FiMoreHorizontal, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import type WorkSpaceDto from "../../../dtos/workspace/WorkSpaceDto";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
} from "@floating-ui/react";

interface Props {
  workspace: WorkSpaceDto;
  currentUserId: string;
  onView: (workspace: WorkSpaceDto) => void;
  onEdit: (workspace: WorkSpaceDto) => void;
  onDelete: (workspace: WorkSpaceDto) => void;
}

export default function WorkspaceActionsMenu({
  workspace,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const isOwner = workspace.createdById === currentUserId;

  const { refs, floatingStyles, context } = useFloating({
    open,
    placement: "bottom-end",
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift({ padding: 10 })],
  });

  // close the menu on click outside and escape key
  const clickOutSide = useDismiss(context);

  return (
    <>
      {/* close the menu on click outside */}
      {/* {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )} */}
      <button
        ref={refs.setReference}
        onClick={() => setOpen(!open)}
        className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer "
      >
        <FiMoreHorizontal size={16} />
      </button>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className="w-44 bg-popover border border-border rounded-xl shadow-lg py-1 z-50"
              ref={refs.setFloating}
              style={floatingStyles}
            >
              <button
                onClick={() => {
                  onView(workspace);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <FiEye size={14} />
                {t("dashboard.workspaces.actions.view")}
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      onEdit(workspace);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
                  >
                    <FiEdit2 size={14} />
                    {t("dashboard.workspaces.actions.edit")}
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={() => {
                      onDelete(workspace);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors cursor-pointer"
                  >
                    <FiTrash2 size={14} />
                    {t("dashboard.workspaces.actions.delete")}
                  </button>
                </>
              )}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
