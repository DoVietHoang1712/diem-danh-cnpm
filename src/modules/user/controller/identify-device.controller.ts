import { SystemRoles } from './../../../common/decorator/auth.decorator';
import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiErrorResponse } from "../../../common/decorator/api.decorator";
import { Authorization } from "../../../common/decorator/auth.decorator";
import { ReqUser } from "../../../common/decorator/user.decorator";
import { CommonResultResponseDto } from "../../../common/dto/response/common-result-response.dto";
import { ResponseDto } from "../../../common/dto/response/response.dto";
import { SystemRole, UserErrorCode } from "../common/user.constant";
import { IdentifyDeviceDto } from "../dto/identify-device.dto";
import { UserDocument } from "../entities/user.entity";
import { UserService } from "../service/user.service";

@Controller("user/identify-device")
@ApiTags("user")
@Authorization()
export class IdentifyDeviceController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get("/request-change")
    @SystemRoles(SystemRole.ADMIN)
    async getRequestChange(): Promise<any> {
        const data = await this.userService.getRequestChangeIdentity();
        return ResponseDto.response(data);
    }

    @Post("/request-change")
    @SystemRoles(SystemRole.SINH_VIEN)
    async createRequestChange(@ReqUser() user: UserDocument): Promise<any> {
        const data = await this.userService.sendRequestChangeIdentity(user);
        return ResponseDto.response(data);
    }

    @Post("/request-change/:id")
    @SystemRoles(SystemRole.ADMIN)
    async process(@ReqUser() user: UserDocument, @Param("id") id: string): Promise<any> {
        const data = await this.userService.process(id);
        return ResponseDto.response(data);
    }

    @Post()
    @ApiErrorResponse(
        HttpStatus.BAD_REQUEST,
        [
            {
                errorCode: UserErrorCode.BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID,
                errorDescription: "Không có thông tin client device id khi đăng nhập (Có thể do đăng nhập tử Web)",
            },
            {
                errorCode: UserErrorCode.BAD_REQUEST_DEVICE_IDENDIFIED,
                errorDescription: "Người dùng đã được xác nhận thiết bị",
            },
            {
                errorCode: UserErrorCode.BAD_REQUEST_CLIENT_DEVICE_ID_EXIST,
                errorDescription: "Thiết bị đã được đăng ký cho một người dùng khác",
            },
            {
                errorCode: UserErrorCode.BAD_REQUEST_WRONG_PASSWORD,
                errorDescription: "Mật khẩu không chính xác",
            },
        ]
    )
    async verifyDevice(
        @ReqUser() user: UserDocument,
        @Body() identifyInfo: IdentifyDeviceDto,
    ): Promise<CommonResultResponseDto> {
        const data = await this.userService.identifyDevice(user, identifyInfo);
        return ResponseDto.response(data);
    }

    @Put("test/remove-identified-device")
    async testRemoveIdentifiedDevice(
        @ReqUser() user: UserDocument,
    ) {
        return this.userService.testRemove(user);
    }
}
