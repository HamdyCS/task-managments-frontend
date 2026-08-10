export interface MutationCallBack<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}
