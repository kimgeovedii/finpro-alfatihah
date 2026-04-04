import { Response } from "express";

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export function sendSuccess<T>(res: Response, data?: T, message = "Success", statusCode = 200) {
  const response: ApiSuccessResponse<T> = { success: true, message };
  if (data !== undefined) response.data = data;
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, message = "Internal server error", statusCode = 500, errors?: any) {
  const response: ApiErrorResponse = { success: false, message };
  if (errors !== undefined) response.errors = errors;
  return res.status(statusCode).json(response);
}
