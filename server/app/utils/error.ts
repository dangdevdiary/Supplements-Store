/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export interface ErrorInterface {
  statusCode: number;
  error: string;
}

export const BadRequestError = (
  message: string,
  statusCode = 500
): ErrorInterface => {
  return { statusCode, error: message };
};

export const isJwtError = (err: unknown): err is JsonWebTokenError => {
  return err instanceof JsonWebTokenError;
};
export const isJwtExpError = (err: unknown): err is TokenExpiredError => {
  return err instanceof TokenExpiredError;
};

export const isError = (obj: any): obj is ErrorInterface => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.keys(obj).includes("error");
};
