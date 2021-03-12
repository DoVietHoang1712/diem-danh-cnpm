import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import { AuthErrorCode } from "../../modules/auth/common/auth.constant";
import { SettingKey } from "../../modules/setting/common/setting.constant";
import { SettingService } from "../../modules/setting/service/setting.service";
import { ErrorData } from "../exception/error-data";

@Injectable()
export class WorkspaceIpAddressGuard implements CanActivate {
    constructor(
        private readonly settingService: SettingService,
    ) { }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const clientIpAddress = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress);
        const workspaceIpAddress = await this.settingService.getSettingValue<string>(SettingKey.WORKSPACE_IP_ADDRESS);
        console.log(clientIpAddress, workspaceIpAddress, clientIpAddress.endsWith(workspaceIpAddress));
        if (clientIpAddress.endsWith(workspaceIpAddress)) {
            return true;
        } else {
            throw ErrorData.init(
                HttpStatus.UNAUTHORIZED,
                AuthErrorCode.UNAUTHORIZED_WRONG_WORKSPACE_IP_ADDRESS,
            );
        }
    }
}