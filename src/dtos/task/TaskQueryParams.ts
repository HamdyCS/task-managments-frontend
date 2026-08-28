import type { TaskStatus } from "../../types/TaskStatus";
import type { TaskPriority } from "../../types/TaskPriority";

export default interface TaskQueryParams {
  pageNumber: number;
  pageSize: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
