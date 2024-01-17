import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.getArgs()[0];
    const role = request?.user?.role ?? request.config?.user?.role;
    return this.matchRoles(roles, role);
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.some(
      (role) => role === process.env.ROLE_KEY.concat(userRole, ""),
    );
  }
}
