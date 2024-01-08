import { HttpStatus } from "@nestjs/common";

export type IResponse = {
  status: HttpStatus;
  success: boolean;
  message?: any;
  data?: any;
};
