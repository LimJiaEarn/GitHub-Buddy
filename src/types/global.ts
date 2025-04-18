export interface SimpleDataResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
