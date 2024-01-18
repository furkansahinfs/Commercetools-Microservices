import { Response } from "express";
import { getJWTUserId, ResponseBody, verifyToken } from "src/util";
import { AuthService } from "src/services";
import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { RequestWithUser } from "src/interface";
import { ROLES } from "src/enums";

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  async use(req: RequestWithUser, res: Response, next: () => void) {
    const accessTokenStr = req.headers.authorization;
    const accessToken = accessTokenStr?.replace("Bearer ", "");
    let user;

    if (!accessToken) {
      return this.generateUnauthorizedResponse(res);
    }

    const { decoded, expired } = verifyToken(
      accessToken,
      "ACCESS_TOKEN_PUBLIC_KEY",
    );
    if (decoded || !expired) {
      try {
        await getJWTUserId(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");

        const userResponse = await this.userService.getMe();

        user = userResponse?.data;
      } catch (error) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send(
            ResponseBody()
              .status(HttpStatus.UNAUTHORIZED)
              .message(error)
              .build(),
          );
      }
    } else {
      return this.generateUnauthorizedResponse(res);
    }

    if (user) {
      req.user = user;
    }

    next();
  }

  private generateUnauthorizedResponse(res: Response) {
    return res.status(HttpStatus.UNAUTHORIZED).send(
      ResponseBody()
        .status(HttpStatus.UNAUTHORIZED)
        .message({
          error: this.i18n.translate("auth.status.unauthorized"),
        })
        .build(),
    );
  }
}
