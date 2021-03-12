import { applyDecorators, HttpStatus, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthErrorCode } from "../../modules/auth/common/auth.constant";
import { JwtAuthGuard } from "../../modules/auth/guard/jwt-auth.guard";
import { SystemRole } from "../../modules/user/common/user.constant";
import { IdentifiedDeviceGuard } from "../guard/identified-device.guard";
import { RolesGuard } from "../guard/system-role.guard.";
import { WorkspaceIpAddressGuard } from "../guard/workspace-ip-address.guard";
import { ApiErrorResponse } from "./api.decorator";

export const SystemRoles = (...systemRoles: SystemRole[]) => SetMetadata("system-roles", systemRoles);

export const Authorization = () => applyDecorators(
    UseGuards(
        JwtAuthGuard,
        RolesGuard,
    ),
    ApiBearerAuth(),
);

export const WorkspaceAuthorization = () => applyDecorators(
    UseGuards(
        JwtAuthGuard,
        RolesGuard,
        IdentifiedDeviceGuard,
        WorkspaceIpAddressGuard,
    ),
    ApiBearerAuth(),
    ApiErrorResponse(
        HttpStatus.UNAUTHORIZED,
        [
            { errorCode: AuthErrorCode.UNAUTHORIZED_WRONG_IDENTIFY_DEVICE, errorDescription: "Thiết bị đang sử dụng không phải thiết bị đã xác thực" },
            { errorCode: AuthErrorCode.UNAUTHORIZED_WRONG_WORKSPACE_IP_ADDRESS, errorDescription: "Không sử dụng địa chỉ mạng của nơi làm việc" },
        ]
    )
);