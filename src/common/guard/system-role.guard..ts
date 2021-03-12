import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { SystemRole } from "../../modules/user/common/user.constant";
import { User } from "../../modules/user/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const systemRoles =
            this.reflector.get<SystemRole[]>("system-roles", context.getHandler()) ||
            this.reflector.get<SystemRole[]>("system-roles", context.getClass());
        if (systemRoles === undefined) {
            return true;
        }
        const user = context.switchToHttp().getRequest<Request>().user as User;
        const intersection = systemRoles.filter(role => user.systemRoles.includes(role));
        return intersection.length > 0;
    }
}
