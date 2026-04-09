import { Response } from "express";

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

interface ApiErrorResponse {
  success: false;
  message: any;
  errors?: any;
}

export function sendSuccess<T>(res: Response, data?: T, message = "Success", statusCode = 200) {
  const response: ApiSuccessResponse<T> = { success: true, message };
  if (data !== undefined) response.data = data;
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, message: any, statusCode = 500, errors?: any) {
  if (message === null) message = "Internal server error"

  const response: ApiErrorResponse = { success: false, message };
  if (errors !== undefined) response.errors = errors;
  return res.status(statusCode).json(response);
}
