import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthErrorCode } from "../../modules/auth/common/auth.constant";
import { UserDocument } from "../../modules/user/entities/user.entity";
import { ErrorData } from "../exception/error-data";

@Injectable()
export class IdentifiedDeviceGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const user = context.switchToHttp().getRequest<Request>().user as UserDocument;
        if (user.clientDeviceId && user.clientDeviceId === user.identifiedDeviceInfo?.deviceId) {
            return true;
        } else {
            throw ErrorData.init(
                HttpStatus.UNAUTHORIZED,
                AuthErrorCode.UNAUTHORIZED_WRONG_IDENTIFY_DEVICE,
            );
        }
    }
}