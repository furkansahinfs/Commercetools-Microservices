import { HttpStatus } from "@nestjs/common";

export type IResponse<T> = {
  status: HttpStatus;
  success: boolean;
  data?: any;
  message?: ResponseMessage;
};

export type ResponseMessage = {
  error: string;
  stack?: object;
};
