import { ServerError } from "../errors/ServerError";
import { HttpResponse } from "../ports/Http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error.message,
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const serverError = (reason: string): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(reason),
});
