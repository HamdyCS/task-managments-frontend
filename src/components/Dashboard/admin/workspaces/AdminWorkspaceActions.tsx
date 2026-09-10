import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiMoreVertical, FiEye, FiUsers, FiFolder } from "react-icons/fi";
import type WorkSpaceOverviewDto from "../../../../dtos/admin/WorkSpaceOverviewDto";
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
  workspace: WorkSpaceOverviewDto;
  onViewWorkspace: (workspace: WorkSpaceOverviewDto) => void;
  onViewMembers: (workspace: WorkSpaceOverviewDto) => void;
  onViewProjects: (workspace: WorkSpaceOverviewDto) => void;
}

export default function AdminWorkspaceActions({
  workspace,
  onViewWorkspace,
  onViewMembers,
  onViewProjects,
}: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,

    middleware: [
      offset(4),
      flip(),
      shift({
        padding: 10,
      }),
    ],
  });

  const clickOutSide = useDismiss(context);

  const actions = [
    {
      icon: <FiEye size={14} />,
      label: t("dashboard.admin.workspaces.actions.viewWorkspace"),
      onClick: () => {
        onViewWorkspace(workspace);
        setIsOpen(false);
      },
    },
    {
      icon: <FiUsers size={14} />,
      label: t("dashboard.admin.workspaces.actions.viewMembers"),
      onClick: () => {
        onViewMembers(workspace);
        setIsOpen(false);
      },
    },
    {
      icon: <FiFolder size={14} />,
      label: t("dashboard.admin.workspaces.actions.viewProjects"),
      onClick: () => {
        onViewProjects(workspace);
        setIsOpen(false);
      },
    },
  ];

  return (
    <div>
      <button
        ref={refs.setReference}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
      >
        <FiMoreVertical size={16} />
      </button>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              className=" w-52 bg-card border rounded-xl shadow-lg z-20 py-1"
              ref={refs.setFloating}
              style={floatingStyles}
            >
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-card-foreground hover:bg-muted transition-colors cursor-pointer text-start"
                >
                  <span className="text-muted-foreground">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
