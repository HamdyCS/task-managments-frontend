import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import { fadeIn } from "../../animations";
import useUserWorkspaces from "../../hooks/workspace/useUserWorkspaces";
import useCreateWorkspace from "../../hooks/workspace/useCreateWorkspace";
import useUpdateWorkspace from "../../hooks/workspace/useUpdateWorkspace";
import useDeleteWorkspace from "../../hooks/workspace/useDeleteWorkspace";
import { useAppSelector } from "../../store/hooks";
import type WorkSpaceDto from "../../dtos/workspace/WorkSpaceDto";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import WorkspaceFilters from "../../components/Dashboard/workspaces/WorkspaceFilters";
import WorkspaceTableSkeleton from "../../components/Dashboard/workspaces/WorkspaceTableSkeleton";
import WorkspaceEmptyState from "../../components/Dashboard/workspaces/WorkspaceEmptyState";
import WorkspacesTable from "../../components/Dashboard/workspaces/WorkspacesTable";
import WorkspaceFormDialog from "../../components/Dashboard/workspaces/WorkspaceFormDialog";
import WorkspaceDetailsDrawer from "../../components/Dashboard/workspaces/WorkspaceDetailsDrawer";

type WorkspaceRoleFilter = "all" | "owned" | "member";

interface Filters {
  searchTerm: string;
  roleFilter: WorkspaceRoleFilter;
}

const EMPTY_FILTERS: Filters = {
  searchTerm: "",
  roleFilter: "all",
};

export default function WorkspacesPage() {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const currentUserId = user?.id ?? "";

  // Filters
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const hasActiveFilters =
    filters.searchTerm !== "" || filters.roleFilter !== "all";

  // Dialog/Drawer state
  const [formDialog, setFormDialog] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    workspace: WorkSpaceDto | null;
  }>({ isOpen: false, mode: "create", workspace: null });
  const [detailsDrawer, setDetailsDrawer] = useState<{
    isOpen: boolean;
    workspace: WorkSpaceDto | null;
  }>({ isOpen: false, workspace: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    workspace: WorkSpaceDto | null;
  }>({ isOpen: false, workspace: null });

  // User workspaces (infinite query)
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } =
    useUserWorkspaces();

  // Flatten all pages
  const allWorkspaces = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  // Frontend filtering
  const filteredWorkspaces = useMemo(() => {
    let result = allWorkspaces;

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(term) ||
          (w.description && w.description.toLowerCase().includes(term)),
      );
    }

    if (filters.roleFilter === "owned") {
      result = result.filter((w) => w.createdById === currentUserId);
    }
    if (filters.roleFilter === "member") {
      result = result.filter((w) => w.createdById !== currentUserId);
    }

    return result;
  }, [allWorkspaces, filters, currentUserId]);

  // Mutations
  const createWorkspace = useCreateWorkspace({
    onSuccess: () => {
      toast.success(t("dashboard.workspaces.create.success"));
      setFormDialog({ isOpen: false, mode: "create", workspace: null });
    },
    onError: () => {
      toast.error(t("dashboard.workspaces.create.error"));
    },
  });

  const updateWorkspace = useUpdateWorkspace({
    onSuccess: () => {
      toast.success(t("dashboard.workspaces.edit.success"));
      setFormDialog({ isOpen: false, mode: "edit", workspace: null });
    },
    onError: () => {
      toast.error(t("dashboard.workspaces.edit.error"));
    },
  });

  const deleteWorkspace = useDeleteWorkspace({
    onSuccess: () => {
      toast.success(t("dashboard.workspaces.delete.success"));
      setDeleteConfirm({ isOpen: false, workspace: null });
    },
    onError: () => {
      toast.error(t("dashboard.workspaces.delete.error"));
    },
  });

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  }, []);

  const handleRoleFilterChange = useCallback((value: WorkspaceRoleFilter) => {
    setFilters((prev) => ({ ...prev, roleFilter: value }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const handleView = useCallback((workspace: WorkSpaceDto) => {
    setDetailsDrawer({ isOpen: true, workspace });
  }, []);

  const handleEdit = useCallback((workspace: WorkSpaceDto) => {
    setFormDialog({ isOpen: true, mode: "edit", workspace });
  }, []);

  const handleDelete = useCallback((workspace: WorkSpaceDto) => {
    setDeleteConfirm({ isOpen: true, workspace });
  }, []);

  const handleFormSubmit = useCallback(
    (data: { name: string; description: string }) => {
      if (formDialog.mode === "create") {
        createWorkspace.mutateAsync(data);
      } else if (formDialog.workspace) {
        updateWorkspace.mutateAsync({ id: formDialog.workspace.id, dto: data });
      }
    },
    [formDialog, createWorkspace, updateWorkspace],
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteConfirm.workspace) {
      deleteWorkspace.mutateAsync(deleteConfirm.workspace.id);
    }
  }, [deleteConfirm, deleteWorkspace]);

  const isLoadingMore = isFetching && !isLoading;

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("dashboard.workspaces.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard.workspaces.subtitle")}
          </p>
        </div>
        <button
          onClick={() =>
            setFormDialog({ isOpen: true, mode: "create", workspace: null })
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <FiPlus size={16} />
          {t("dashboard.workspaces.create.button")}
        </button>
      </div>

      {/* Filters */}
      <WorkspaceFilters
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
        roleFilter={filters.roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content */}
      {isLoading ? (
        <WorkspaceTableSkeleton />
      ) : filteredWorkspaces.length === 0 ? (
        <WorkspaceEmptyState
          isFiltered={hasActiveFilters}
          onCreateClick={() =>
            setFormDialog({ isOpen: true, mode: "create", workspace: null })
          }
        />
      ) : (
        <WorkspacesTable
          workspaces={filteredWorkspaces}
          currentUserId={currentUserId}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage ?? false}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLoadMore={fetchNextPage}
        />
      )}

      {/* Create/Edit Dialog */}
      <WorkspaceFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        workspace={formDialog.workspace}
        isLoading={createWorkspace.isPending || updateWorkspace.isPending}
        onClose={() =>
          setFormDialog({ isOpen: false, mode: "create", workspace: null })
        }
        onSubmit={handleFormSubmit}
      />

      {/* Details Drawer */}
      <WorkspaceDetailsDrawer
        workspace={detailsDrawer.workspace}
        isOpen={detailsDrawer.isOpen}
        onClose={() => setDetailsDrawer({ isOpen: false, workspace: null })}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, workspace: null })}
        onConfirm={handleConfirmDelete}
        title={t("dashboard.workspaces.delete.title")}
        confirmText={t("dashboard.workspaces.delete.confirm")}
        cancelText={t("dashboard.workspaces.delete.cancel")}
        isLoading={deleteWorkspace.isPending}
      />
    </motion.div>
  );
}
