import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { get } from "lodash";

import { conf } from "src/config";
import { getJWTUser } from "src/util/jwt.util";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const role =
      request?.user?.role ??
      request.config?.user?.role ??
      this.getRoleFromToken(request);

    return this.matchRoles(roles, role);
  }

  matchRoles(roles: string[], userRole: string): boolean {
    return roles.some((role) => role === conf.ROLE_KEY.concat(userRole, ""));
  }

  getRoleFromToken(request): string | undefined {
    const accessTokenStr = get(request, "headers.authorization");
    const accessToken = accessTokenStr?.replace("Bearer ", "");
    return getJWTUser(accessToken, "ACCESS_TOKEN_PUBLIC_KEY")?.["role"];
  }
}
