import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES } from "src/enums/roles.enum";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const role = request.user.role;
    return this.matchRoles(roles, role);
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.some(
      (role) => role === process.env.ROLE_KEY.concat(userRole, ""),
    );
  }
}
