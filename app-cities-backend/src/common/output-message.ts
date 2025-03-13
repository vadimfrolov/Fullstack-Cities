export interface CommonResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function commonResponse<T>(
  success: boolean, 
  message: string, 
  data: T
): CommonResponse<T> {
  return {
    success,
    message,
    data,
  };
}
