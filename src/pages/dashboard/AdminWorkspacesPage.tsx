import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../../animations";
import { useAdminWorkspaces } from "../../hooks/admin/useAdminWorkspaces";
import AdminWorkspacesFilters from "../../components/Dashboard/admin/workspaces/AdminWorkspacesFilters";
import AdminWorkspacesTable from "../../components/Dashboard/admin/workspaces/AdminWorkspacesTable";
import AdminWorkspacesSkeleton from "../../components/Dashboard/admin/workspaces/AdminWorkspacesSkeleton";
import AdminWorkspaceDetailsDrawer from "../../components/Dashboard/admin/workspaces/AdminWorkspaceDetailsDrawer";
import type WorkSpaceOverviewDto from "../../dtos/admin/WorkSpaceOverviewDto";

type DrawerSection = "overview" | "members" | "projects";

export default function AdminWorkspacesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const workspaceName = searchParams.get("workSpaceName") || "";
  const ownerName = searchParams.get("ownerName") || "";

  const hasActiveFilters = workspaceName !== "" || ownerName !== "";

  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    workspaceId: number | null;
    initialSection: DrawerSection;
  }>({ isOpen: false, workspaceId: null, initialSection: "overview" });

  const {
    data,
    isLoading,
    isError,
  } = useAdminWorkspaces();

  const workspaces = data?.data ?? [];

  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.delete("pageNumber");
        return next;
      });
    },
    [setSearchParams],
  );

  const handleWorkspaceNameChange = useCallback(
    (value: string) => {
      updateSearchParams("workSpaceName", value);
    },
    [updateSearchParams],
  );

  const handleOwnerNameChange = useCallback(
    (value: string) => {
      updateSearchParams("ownerName", value);
    },
    [updateSearchParams],
  );

  const handleReset = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const handleViewWorkspace = useCallback((workspace: WorkSpaceOverviewDto) => {
    setDrawerState({
      isOpen: true,
      workspaceId: workspace.id,
      initialSection: "overview",
    });
  }, []);

  const handleViewMembers = useCallback((workspace: WorkSpaceOverviewDto) => {
    setDrawerState({
      isOpen: true,
      workspaceId: workspace.id,
      initialSection: "members",
    });
  }, []);

  const handleViewProjects = useCallback((workspace: WorkSpaceOverviewDto) => {
    setDrawerState({
      isOpen: true,
      workspaceId: workspace.id,
      initialSection: "projects",
    });
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerState({ isOpen: false, workspaceId: null, initialSection: "overview" });
  }, []);

  if (isLoading) {
    return <AdminWorkspacesSkeleton />;
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("dashboard.admin.workspaces.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.admin.workspaces.subtitle")}
        </p>
      </div>

      <AdminWorkspacesFilters
        workspaceName={workspaceName}
        ownerName={ownerName}
        onWorkspaceNameChange={handleWorkspaceNameChange}
        onOwnerNameChange={handleOwnerNameChange}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      {isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-card-foreground mb-1">
            {t("dashboard.admin.error.title")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.admin.error.description")}
          </p>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-card-foreground mb-1">
            {hasActiveFilters
              ? t("dashboard.admin.workspaces.empty.filtered")
              : t("dashboard.admin.workspaces.empty.title")}
          </p>
        </div>
      ) : (
        <AdminWorkspacesTable
          workspaces={workspaces}
          onViewWorkspace={handleViewWorkspace}
          onViewMembers={handleViewMembers}
          onViewProjects={handleViewProjects}
        />
      )}

      <AdminWorkspaceDetailsDrawer
        workspaceId={drawerState.workspaceId}
        isOpen={drawerState.isOpen}
        initialSection={drawerState.initialSection}
        onClose={handleCloseDrawer}
      />
    </motion.div>
  );
}
