export class ApiResponseDto<T = any> {
  statuscode: number;
  status: boolean;
  message: string;
  data: T;

  constructor(statuscode: number, status: boolean, message: string, data: T) {
    this.statuscode = statuscode;
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message: string = 'Success'): ApiResponseDto<T> {
    return new ApiResponseDto(200, true, message, data);
  }

  static created<T>(data: T, message: string = 'Created'): ApiResponseDto<T> {
    return new ApiResponseDto(201, true, message, data);
  }

  static error(statuscode: number, message: string, data: any = null): ApiResponseDto<any> {
    return new ApiResponseDto(statuscode, false, message, data);
  }
}