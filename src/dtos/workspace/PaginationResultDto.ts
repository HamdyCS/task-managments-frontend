export default interface PaginationResultDto<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}
