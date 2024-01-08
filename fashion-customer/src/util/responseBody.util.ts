import { HttpStatus } from "@nestjs/common";
import { IResponse } from "src/types";

export function ResponseBody() {
  const response: IResponse = {
    status: HttpStatus.OK,
    success: true,
    message: undefined,
    data: undefined,
  };

  return {
    status: function (status: HttpStatus) {
      response.status = status;
      return this;
    },
    message: function (message: any) {
      response.message = message;
      response.success = false;
      return this;
    },
    data: function (data: any) {
      response.data = data;
      return this;
    },
    build: function () {
      return response;
    },
  };
}
