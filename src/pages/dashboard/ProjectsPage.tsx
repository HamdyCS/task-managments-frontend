import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { fadeIn } from "../../animations";
import useProjects from "../../hooks/project/useProjects";
import useCreateProject from "../../hooks/project/useCreateProject";
import useUpdateProject from "../../hooks/project/useUpdateProject";
import useDeleteProject from "../../hooks/project/useDeleteProject";
import useWorkspaceRole from "../../hooks/workspace/useWorkspaceRole";
import type ProjectDto from "../../dtos/project/ProjectDto";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import ProjectTableSkeleton from "../../components/Dashboard/projects/ProjectTableSkeleton";
import ProjectEmptyState from "../../components/Dashboard/projects/ProjectEmptyState";
import ProjectsTable from "../../components/Dashboard/projects/ProjectsTable";
import ProjectFormDialog from "../../components/Dashboard/projects/ProjectFormDialog";
import ProjectDetailsDrawer from "../../components/Dashboard/projects/ProjectDetailsDrawer";
import useUserWorkspaces from "../../hooks/workspace/useUserWorkspaces";

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const workspaceIdParam = searchParams.get("workspaceId");
  const effectiveWorkspaceId = workspaceIdParam
    ? Number(workspaceIdParam)
    : null;

  //get all workspaces from redux store
  const { data: workspacesData } = useUserWorkspaces();
  const workspaces = useMemo(
    () => workspacesData?.pages.flatMap((p) => p.data) ?? [],
    [workspacesData],
  );
  const navigate = useNavigate();

  // Role
  const { data: workspaceRole } = useWorkspaceRole(effectiveWorkspaceId);
  const canManage =
    workspaceRole === "Owner" || workspaceRole === "ProjectManager";

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const hasActiveFilters = searchTerm !== "";

  // Dialog/Drawer state
  const [formDialog, setFormDialog] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    project: ProjectDto | null;
  }>({ isOpen: false, mode: "create", project: null });
  const [detailsDrawer, setDetailsDrawer] = useState<{
    isOpen: boolean;
    project: ProjectDto | null;
  }>({ isOpen: false, project: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    project: ProjectDto | null;
  }>({ isOpen: false, project: null });

  // Projects (infinite query)
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } =
    useProjects(effectiveWorkspaceId);

  // Flatten all pages
  const allProjects = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  //if no workspace is selected, redirect to the first workspace
  useEffect(() => {
    if (workspaces.length > 0 && !workspaceIdParam) {
      navigate(`/dashboard/projects?workspaceId=${workspaces[0].id}`, {
        replace: true,
      });
    }
  }, [workspaces, workspaceIdParam, navigate]);
  // Frontend filtering
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return allProjects;
    const term = searchTerm.toLowerCase();
    return allProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)),
    );
  }, [allProjects, searchTerm]);

  // Mutations
  const createProject = useCreateProject({
    onSuccess: () => {
      toast.success(t("dashboard.projects.create.success"));
      setFormDialog({ isOpen: false, mode: "create", project: null });
    },
    onError: () => {
      toast.error(t("dashboard.projects.create.error"));
    },
  });

  const updateProject = useUpdateProject({
    onSuccess: () => {
      toast.success(t("dashboard.projects.edit.success"));
      setFormDialog({ isOpen: false, mode: "edit", project: null });
    },
    onError: () => {
      toast.error(t("dashboard.projects.edit.error"));
    },
  });

  const deleteProject = useDeleteProject({
    onSuccess: () => {
      toast.success(t("dashboard.projects.delete.success"));
      setDeleteConfirm({ isOpen: false, project: null });
    },
    onError: () => {
      toast.error(t("dashboard.projects.delete.error"));
    },
  });

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleView = useCallback((project: ProjectDto) => {
    setDetailsDrawer({ isOpen: true, project });
  }, []);

  const handleEdit = useCallback((project: ProjectDto) => {
    setFormDialog({ isOpen: true, mode: "edit", project });
  }, []);

  const handleDelete = useCallback((project: ProjectDto) => {
    setDeleteConfirm({ isOpen: true, project });
  }, []);

  const handleFormSubmit = useCallback(
    (data: { name: string; description: string }) => {
      if (!effectiveWorkspaceId) return;
      if (formDialog.mode === "create") {
        createProject.mutateAsync({
          workspaceId: effectiveWorkspaceId,
          dto: data,
        });
      } else if (formDialog.project) {
        updateProject.mutateAsync({
          workspaceId: effectiveWorkspaceId,
          projectId: formDialog.project.id,
          dto: data,
        });
      }
    },
    [formDialog, effectiveWorkspaceId, createProject, updateProject],
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteConfirm.project && effectiveWorkspaceId) {
      deleteProject.mutateAsync({
        workspaceId: effectiveWorkspaceId,
        projectId: deleteConfirm.project.id,
      });
    }
  }, [deleteConfirm, effectiveWorkspaceId, deleteProject]);

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
            {t("dashboard.projects.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard.projects.subtitle")}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() =>
              setFormDialog({ isOpen: true, mode: "create", project: null })
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <FiPlus size={16} />
            {t("dashboard.projects.create.button")}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("dashboard.projects.filters.search")}
            className="w-full h-10 pl-9 pr-4 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground cursor-pointer"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <ProjectTableSkeleton />
      ) : filteredProjects.length === 0 ? (
        <ProjectEmptyState
          isFiltered={hasActiveFilters}
          canCreate={canManage}
          onCreateClick={() =>
            setFormDialog({ isOpen: true, mode: "create", project: null })
          }
        />
      ) : (
        <ProjectsTable
          projects={filteredProjects}
          canManage={canManage}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage ?? false}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLoadMore={fetchNextPage}
        />
      )}

      {/* Create/Edit Dialog */}
      <ProjectFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        project={formDialog.project}
        isLoading={createProject.isPending || updateProject.isPending}
        onClose={() =>
          setFormDialog({ isOpen: false, mode: "create", project: null })
        }
        onSubmit={handleFormSubmit}
      />

      {/* Details Drawer */}
      <ProjectDetailsDrawer
        project={detailsDrawer.project}
        isOpen={detailsDrawer.isOpen}
        onClose={() => setDetailsDrawer({ isOpen: false, project: null })}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, project: null })}
        onConfirm={handleConfirmDelete}
        title={t("dashboard.projects.delete.title")}
        confirmText={t("dashboard.projects.delete.confirm")}
        cancelText={t("dashboard.projects.delete.cancel")}
        isLoading={deleteProject.isPending}
      />
    </motion.div>
  );
}
