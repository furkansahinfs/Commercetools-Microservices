import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { ResponseBody } from "src/util";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    console.log(exception);
    const res = host.switchToHttp();
    const response = res.getResponse();

    response
      .status(HttpStatus.BAD_REQUEST)
      .json(
        ResponseBody()
          .status(HttpStatus.BAD_REQUEST)
          .message(exception)
          .build(),
      );
  }
}
