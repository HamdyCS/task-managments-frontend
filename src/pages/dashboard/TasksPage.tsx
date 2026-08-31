import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiPlus, FiGrid, FiList } from "react-icons/fi";
import { toast } from "sonner";
import { fadeIn } from "../../animations";
import useUserWorkspaces from "../../hooks/workspace/useUserWorkspaces";
import useWorkspaceRole from "../../hooks/workspace/useWorkspaceRole";
import useWorkspaceUsers from "../../hooks/workspace/useWorkspaceUsers";
import useProjects from "../../hooks/project/useProjects";
import useProjectTasks from "../../hooks/task/useProjectTasks";
import useChangeTaskStatus from "../../hooks/task/useChangeTaskStatus";
import useDeleteTask from "../../hooks/task/useDeleteTask";
import useUnassignTask from "../../hooks/task/useUnassignTask";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setSelectedWorkSpace } from "../../store/dashboard/selectedWorkSpace";
import type TaskDto from "../../dtos/task/TaskDto";
import type { TaskMode } from "../../types/TaskMode";
import type { TaskStatus } from "../../types/TaskStatus";
import type { TaskPriority } from "../../types/TaskPriority";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import TasksSkeleton from "../../components/Dashboard/tasks/TasksSkeleton";
import ProjectSelector from "../../components/Dashboard/tasks/ProjectSelector";
import TasksFilterBar from "../../components/Dashboard/tasks/TasksFilterBar";
import TasksTable from "../../components/Dashboard/tasks/TasksTable";
import TasksKanban from "../../components/Dashboard/tasks/TasksKanban";
import TaskDetailsDrawer from "../../components/Dashboard/tasks/TaskDetailsDrawer";
import TaskCreateModal from "../../components/Dashboard/tasks/TaskCreateModal";
import TaskEditModal from "../../components/Dashboard/tasks/TaskEditModal";
import TaskAssignModal from "../../components/Dashboard/tasks/TaskAssignModal";

const PAGE_SIZE = 10;

const EMPTY_FILTERS = {
  searchTerm: "",
  status: undefined as TaskStatus | undefined,
  priority: undefined as TaskPriority | undefined,
  sortBy: undefined as string | undefined,
  sortOrder: undefined as "asc" | "desc" | undefined,
};

export default function TasksPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const workspaceIdParam = searchParams.get("workspaceId");

  // Workspace
  const { data: workspacesData, isLoading: workspacesLoading } =
    useUserWorkspaces();
  const workspaces = useMemo(
    () => workspacesData?.pages.flatMap((p) => p.data) ?? [],
    [workspacesData],
  );
  const effectiveWorkspaceId = workspaceIdParam
    ? Number(workspaceIdParam)
    : null;

  // Role
  const { data: workspaceRole } = useWorkspaceRole(effectiveWorkspaceId);

  // Workspace users
  const { data: workspaceUsersData } = useWorkspaceUsers(effectiveWorkspaceId);
  const workspaceUsers = useMemo(
    () => workspaceUsersData?.data ?? [],
    [workspaceUsersData],
  );

  // Redux sync
  useEffect(() => {
    if (!effectiveWorkspaceId || !workspaceRole) return;
    const workspace = workspaces.find((w) => w.id === effectiveWorkspaceId);
    if (workspace) {
      dispatch(
        setSelectedWorkSpace({
          workSpaceId: effectiveWorkspaceId,
          workSpace: workspace,
          workSpaceRole: workspaceRole,
        }),
      );
    }
  }, [effectiveWorkspaceId, workspaceRole, workspaces, dispatch]);

  // Redirect to first workspace
  useEffect(() => {
    if (workspaces.length > 0 && !workspaceIdParam) {
      navigate(`/dashboard/tasks?workspaceId=${workspaces[0].id}`, {
        replace: true,
      });
    }
  }, [workspaces, workspaceIdParam, navigate]);

  // Projects
  const { data: projectsData, isLoading: projectsLoading } =
    useProjects(effectiveWorkspaceId);
  const projects = useMemo(() => projectsData?.data ?? [], [projectsData]);

  // Selected project
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const effectiveProjectId = useMemo(() => {
    if (projects.length === 0) return null;
    if (selectedProjectId && projects.find((p) => p.id === selectedProjectId)) {
      return selectedProjectId;
    }
    return projects[0].id;
  }, [projects, selectedProjectId]);

  // Mode & filters
  const [mode, setMode] = useState<TaskMode>("all");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [view, setView] = useState<"table" | "kanban">("table");

  // Reset page via callbacks(donot render component when changed)
  const handleProjectChange = useCallback((projectId: number) => {
    setSelectedProjectId(projectId);
    setPage(1);
  }, []);

  const handleModeChange = useCallback((newMode: TaskMode) => {
    setMode(newMode);
    setPage(1);
  }, []);

  // Tasks
  const { data: tasksData, isLoading: tasksLoading } = useProjectTasks(
    effectiveWorkspaceId,
    effectiveProjectId,
    mode,
    {
      pageNumber: page,
      pageSize: PAGE_SIZE,
      status: filters.status,
      priority: filters.priority,
      searchTerm: filters.searchTerm || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    },
  );

  const tasks = useMemo(() => tasksData?.data ?? [], [tasksData]);
  const pagination = tasksData
    ? {
        pageNumber: tasksData.pageNumber,
        totalPages: tasksData.totalPages,
        hasNextPage: tasksData.hasNextPage,
        hasPreviousPage: tasksData.hasPreviousPage,
      }
    : null;


  // Current user
  const user = useAppSelector((state) => state.auth.user);
  const currentUserId = user?.id ?? "";

  // Modals & drawer
  const [drawerTask, setDrawerTask] = useState<TaskDto | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<TaskDto | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTaskId, setAssignTaskId] = useState<number | null>(null);
  const [assignCurrentUserId, setAssignCurrentUserId] = useState<string>("");

  // Mutations
  const { mutateAsync: changeStatus } = useChangeTaskStatus({
    onSuccess: () => toast.success(t("dashboard.tasks.statusChange.success")),
  });

  const { mutateAsync: deleteTaskMutation, isPending: deleting } =
    useDeleteTask({
      onSuccess: () => {
        toast.success(t("dashboard.tasks.delete.success"));
        setDeleteDialogOpen(false);
        setDeleteTask(null);
      },
    });

  const handleSearchChange = useCallback((value: string) => {
    setFilters((f) => ({ ...f, searchTerm: value }));
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: TaskStatus | undefined) => {
    setFilters((f) => ({ ...f, status: value }));
    setPage(1);
  }, []);

  const handlePriorityChange = useCallback(
    (value: TaskPriority | undefined) => {
      setFilters((f) => ({ ...f, priority: value }));
      setPage(1);
    },
    [],
  );

  const handleSortByChange = useCallback((value: string | undefined) => {
    setFilters((f) => ({
      ...f,
      sortBy: value,
      sortOrder: value ? (f.sortOrder ?? "asc") : undefined,
    }));
    setPage(1);
  }, []);

  const handleSortOrderChange = useCallback(
    (value: "asc" | "desc" | undefined) => {
      setFilters((f) => ({ ...f, sortOrder: value }));
      setPage(1);
    },
    [],
  );

  const handleReset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const hasActiveFilters =
    filters.searchTerm !== "" ||
    filters.status !== undefined ||
    filters.priority !== undefined ||
    filters.sortBy !== undefined;

  const handleTaskClick = useCallback((task: TaskDto) => {
    setDrawerTask(task);
  }, []);

  const handleEdit = useCallback((task: TaskDto) => {
    setEditTask(task);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((task: TaskDto) => {
    setDeleteTask(task);
    setDeleteDialogOpen(true);
  }, []);

  const handleChangeStatus = useCallback(
    async (task: TaskDto, status: string) => {
      if (!effectiveWorkspaceId || !effectiveProjectId) return;
      const isSelf = task.assignments.some(
        (a) => a.assignedToId === currentUserId && a.isActive,
      );
      const isManager =
        workspaceRole === "Owner" || workspaceRole === "ProjectManager";
      await changeStatus({
        workspaceId: effectiveWorkspaceId,
        projectId: effectiveProjectId,
        taskId: task.id,
        status,
        isSelf: !isManager && isSelf,
      });
    },
    [
      effectiveWorkspaceId,
      effectiveProjectId,
      currentUserId,
      workspaceRole,
      changeStatus,
    ],
  );

  const handleAssign = useCallback((task: TaskDto) => {
    setAssignTaskId(task.id);
    const active = task.assignments.find((a) => a.isActive);
    setAssignCurrentUserId(active?.assignedToId ?? "");
    setAssignModalOpen(true);
  }, []);

  const { mutateAsync: unassignTaskMutation } = useUnassignTask({
    onSuccess: () => toast.success(t("dashboard.tasks.unassign.success")),
  });

  const handleUnassign = useCallback(
    async (task: TaskDto, userId: string) => {
      if (!effectiveWorkspaceId || !effectiveProjectId) return;
      await unassignTaskMutation({
        workspaceId: effectiveWorkspaceId,
        projectId: effectiveProjectId,
        taskId: task.id,
        userId,
      });
    },
    [effectiveWorkspaceId, effectiveProjectId, unassignTaskMutation],
  );

  const isManager =
    workspaceRole === "Owner" || workspaceRole === "ProjectManager";

  if (workspacesLoading || projectsLoading) {
    return <TasksSkeleton />;
  }

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">
          {t("dashboard.tasks.empty.noProjects.description")}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">
            {t("dashboard.tasks.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard.tasks.subtitle")}
          </p>
        </div>
        {isManager && effectiveProjectId && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <FiPlus size={16} />
            {t("dashboard.tasks.create.button")}
          </button>
        )}
      </div>

      {/* Project Selector */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="w-64">
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelect={handleProjectChange}
          />
        </div>
      </div>

      {/* Tabs + View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => handleModeChange("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              mode === "all"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground"
            }`}
          >
            {t("dashboard.tasks.tabs.allTasks")}
          </button>
          <button
            onClick={() => handleModeChange("my")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              mode === "my"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground"
            }`}
          >
            {t("dashboard.tasks.tabs.myTasks")}
          </button>
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setView("table")}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              view === "table"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground"
            }`}
          >
            <FiList size={16} />
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              view === "kanban"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground"
            }`}
          >
            <FiGrid size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {effectiveProjectId && (
        <TasksFilterBar
          searchTerm={filters.searchTerm}
          onSearchChange={handleSearchChange}
          status={filters.status}
          onStatusChange={handleStatusChange}
          priority={filters.priority}
          onPriorityChange={handlePriorityChange}
          sortBy={filters.sortBy}
          onSortByChange={handleSortByChange}
          sortOrder={filters.sortOrder}
          onSortOrderChange={handleSortOrderChange}
          onReset={handleReset}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Content */}
      {!effectiveProjectId && !projectsLoading && projects.length > 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">
            {t("dashboard.tasks.empty.noProjects.description")}
          </p>
        </div>
      ) : !effectiveProjectId && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-card-foreground mb-1">
            {t("dashboard.tasks.empty.noProjects.title")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.tasks.empty.noProjects.description")}
          </p>
        </div>
      ) : tasksLoading ? (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-card-foreground mb-1">
            {hasActiveFilters
              ? t("dashboard.tasks.empty.noFilterResults.title")
              : mode === "my"
                ? t("dashboard.tasks.empty.noMyTasks.title")
                : t("dashboard.tasks.empty.noTasks.title")}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters
              ? t("dashboard.tasks.empty.noFilterResults.description")
              : mode === "my"
                ? t("dashboard.tasks.empty.noMyTasks.description")
                : t("dashboard.tasks.empty.noTasks.description")}
          </p>
        </div>
      ) : view === "table" ? (
        <TasksTable
          tasks={tasks}
          currentUserId={currentUserId}
          workspaceRole={workspaceRole ?? "Member"}
          workspaceUsers={workspaceUsers}
          onTaskClick={handleTaskClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeStatus={handleChangeStatus}
          onAssign={handleAssign}
          onUnassign={handleUnassign}
        />
      ) : (
        <TasksKanban tasks={tasks} onTaskClick={handleTaskClick} />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!pagination.hasPreviousPage}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.pageNumber} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Drawer */}
      {drawerTask && effectiveWorkspaceId && effectiveProjectId && (
        <TaskDetailsDrawer
          task={drawerTask}
          workspaceId={effectiveWorkspaceId}
          projectId={effectiveProjectId}
          workspaceRole={workspaceRole ?? "Member"}
          workspaceUsers={workspaceUsers}
          onClose={() => setDrawerTask(null)}
          onChangeStatus={handleChangeStatus}
        />
      )}

      {/* Create Modal */}
      {effectiveWorkspaceId && effectiveProjectId && (
        <TaskCreateModal
          workspaceId={effectiveWorkspaceId}
          projectId={effectiveProjectId}
          workspaceUsers={workspaceUsers}
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => setCreateModalOpen(false)}
        />
      )}

      {/* Edit Modal */}
      {editTask && effectiveWorkspaceId && effectiveProjectId && (
        <TaskEditModal
          task={editTask}
          workspaceId={effectiveWorkspaceId}
          projectId={effectiveProjectId}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditTask(null);
          }}
          onSuccess={() => {
            setEditModalOpen(false);
            setEditTask(null);
          }}
        />
      )}

      {/* Assign Modal */}
      {assignTaskId && effectiveWorkspaceId && effectiveProjectId && (
        <TaskAssignModal
          taskId={assignTaskId}
          workspaceId={effectiveWorkspaceId}
          projectId={effectiveProjectId}
          workspaceUsers={workspaceUsers}
          currentAssigneeId={assignCurrentUserId}
          isOpen={assignModalOpen}
          onClose={() => {
            setAssignModalOpen(false);
            setAssignTaskId(null);
          }}
          onSuccess={() => {
            setAssignModalOpen(false);
            setAssignTaskId(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTask(null);
        }}
        onConfirm={() => {
          if (deleteTask && effectiveWorkspaceId && effectiveProjectId) {
            deleteTaskMutation({
              workspaceId: effectiveWorkspaceId,
              projectId: effectiveProjectId,
              taskId: deleteTask.id,
            });
          }
        }}
        title={t("dashboard.tasks.delete.title")}
        confirmText={t("dashboard.tasks.delete.title")}
        cancelText={t("dashboard.logoutConfirm.cancel")}
        isLoading={deleting}
      />
    </motion.div>
  );
}
