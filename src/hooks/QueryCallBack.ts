export interface QueryCallBack<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}
