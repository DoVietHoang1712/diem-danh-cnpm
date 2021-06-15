import { Body, Controller, Delete, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import * as moment from "moment";
import { Model } from "mongoose";
import { ApiErrorResponse, ApiPageableQuery, ApiSortQuery, FetchPageableQuery } from "../../common/decorator/api.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { ResponseDto } from "../../common/dto/response/response.dto";
import { FetchQueryOption } from "../../common/pipe/fetch-query-option.interface";
import { DB_ATTENDANCE } from "../repository/db-collection";
import { PeriodOfTime, SettingKey } from "../setting/common/setting.constant";
import { SettingService } from "../setting/service/setting.service";
import { UserDocument } from "../user/entities/user.entity";
import { Authorization, WorkspaceAuthorization } from "./../../common/decorator/auth.decorator";
import { AttendanceErrorCode, AttendanceResult } from "./common/attendance.constant";
import { AttendanceRegisterDto } from "./dto/attendance-register.dto";
import { AttendanceRegisteredPageableResponseDto } from "./dto/response/attendance-registered-pageable-response.dto";
import { AttendanceResponseDto } from "./dto/response/attendance-response.dto";
import { AttendanceStatusResponseDto } from "./dto/response/attendance-status-response.dto";
import { AttendanceUnregisteredPageableResponse } from "./dto/response/attendance-unregistered-pageable-response.dto";
import { AttendanceDocument } from "./entities/attendance.entity";
import { AttendanceService } from "./service/attendance.service";

@Controller("attendance")
@ApiTags("attendance")
@Authorization()
export class AttendanceController {
    constructor(
        private readonly attendanceService: AttendanceService,
        private readonly settingService: SettingService,
        @InjectModel(DB_ATTENDANCE)
        private readonly attendanceModel: Model<AttendanceDocument>,
    ) { }

    @Get("/dashboard")
    @ApiOperation({
        description: "Lấy danh sách sinh viên điểm danh theo lớp",
    })
    @ApiQuery({ name: "maLopHoc", example: "INT1340-20202-06" })
    @ApiQuery({ name: "studyFrom", example: "18:00" })
    @ApiQuery({ name: "studyTo", example: "19:50" })
    @ApiQuery({ name: "date", example: new Date().getDate() })
    @ApiQuery({ name: "month", example: new Date().getMonth() })
    @ApiQuery({ name: "year", example: new Date().getFullYear() })
    async getDashboard(
        @Query("maLopHoc") maLopHoc: string,
        @Query("studyFrom") studyFrom: string,
        @Query("studyTo") studyTo: string,
        @Query("date") date: number,
        @Query("month") month: number,
        @Query("year") year: number,
    ) {
        const data = await this.attendanceService.getRegistedUserInClass(maLopHoc, date, month, year, studyFrom, studyTo);
        return ResponseDto.response(data);
    }
    @Get("/registered")
    @ApiOperation({
        description: "Lấy danh sách user đã điểm danh theo ngày và theo buổi",
    })
    @ApiQuery({ name: "date", example: new Date() })
    @ApiQuery({ name: "periodOfTime", enum: PeriodOfTime })
    @ApiQuery({ name: "checkInResult", enum: AttendanceResult, required: false })
    @ApiQuery({ name: "checkedOut", enum: ["0", "1"], required: false })
    @ApiSortQuery()
    @ApiPageableQuery()
    async getUserAttendanced(
        @FetchPageableQuery() option: FetchQueryOption,
        @Query("date") date: string,
        @Query("periodOfTime") periodOfTime: PeriodOfTime,
        @Query("checkInResult") inResult: AttendanceResult,
        @Query("checkedOut") checkedOut: string,
    ): Promise<AttendanceRegisteredPageableResponseDto> {
        const data = await this.attendanceService.getRegistedUser(date, periodOfTime, inResult, checkedOut, option);
        return ResponseDto.response(data);
    }

    @Get("/unregistered")
    @ApiOperation({
        description: "Lấy danh sách user chưa điểm danh theo ngày và theo buổi",
    })
    @ApiQuery({ name: "periodOfTime", enum: PeriodOfTime })
    @ApiQuery({ name: "date", example: new Date() })
    @ApiQuery({ name: "periodOfTime", enum: PeriodOfTime })
    @ApiSortQuery()
    @ApiPageableQuery()
    async getUserNotAttendanced(
        @FetchPageableQuery() option: FetchQueryOption,
        @Query("date") date: string,
        @Query("periodOfTime") periodOfTime: PeriodOfTime,
    ): Promise<AttendanceUnregisteredPageableResponse> {
        const data = await this.attendanceService.getUnregistedUser(date, periodOfTime, option);
        return ResponseDto.response(data);
    }

    @Get("status/me")
    @WorkspaceAuthorization()
    @ApiOperation({
        description: "Lấy trạng thái điểm danh hiện tại.<ul><li>Nếu chưa điểm danh thì status là None</li><li>Nếu đã điểm danh lúc đến thì status là In</li><li>Nếu đã điểm danh lúc về thì status là Out</li></ul>",
    })
    async userGetStatus(
        @ReqUser() user: UserDocument,
    ): Promise<AttendanceStatusResponseDto> {
        const data = await this.attendanceService.getAttendanceStatus(user);
        return ResponseDto.response(data);
    }

    @Post("register/me/in")
    // @WorkspaceAuthorization()
    @ApiErrorResponse(
        HttpStatus.BAD_REQUEST,
        [
            {
                errorCode: AttendanceErrorCode.BAD_REQUEST_INVALID_OTP,
                errorDescription: "OTP không hợp lệ",
            },
            {
                errorCode: AttendanceErrorCode.BAD_REQUEST_INVALID_BSSID,
                errorDescription: "BSSID không hợp lệ",
            },
            {
                errorCode: AttendanceErrorCode.BAD_REQUEST_INVALID_TYPE,
                errorDescription: "Đã thực hiện điểm danh",
            },
        ]
    )
    async userRegisterAttendanceIn(
        @ReqUser() user: UserDocument,
        @Body() info: AttendanceRegisterDto,
    ): Promise<AttendanceResponseDto> {
        console.log(info);
        const data = await this.attendanceService.createIn(user, info);
        return ResponseDto.response(data);
    }

    @Post("register/me/out")
    @WorkspaceAuthorization()
    @ApiErrorResponse(
        HttpStatus.BAD_REQUEST,
        [
            {
                errorCode: AttendanceErrorCode.BAD_REQUEST_INVALID_OTP,
                errorDescription: "OTP không hợp lệ",
            },
            {
                errorCode: AttendanceErrorCode.BAD_REQUEST_INVALID_BSSID,
                errorDescription: "BSSID không hợp lệ",
            },
            {
                errorCode: AttendanceErrorCode.BAD_REQUEST_INVALID_TYPE,
                errorDescription: "Điểm danh không đúng trạng thái, ví dụ khi trạng thái điểm danh là In nhưng lại gọi điểm danh Out",
            },
        ]
    )
    async userRegisterAttendanceOut(
        @ReqUser() user: UserDocument,
        @Body() info: AttendanceRegisterDto,
    ): Promise<AttendanceResponseDto> {
        const data = await this.attendanceService.createOut(user, info);
        return ResponseDto.response(data);
    }

    @Post("test/setting/early")
    @ApiOperation({ summary: "Thiết lập setting để điểm danh lúc đến là sớm" })
    async testSettingInvalidEarly() {
        const now = new Date();
        const preriod = await this.attendanceService.getPeriodOfTime();
        const prefix = preriod === PeriodOfTime.MORNING ? "MORNING" : "AFTERNOON";
        await this.settingService.setSetting({
            key: SettingKey[`${prefix}_WORK_FROM`],
            value: moment(now).add(15, "minute").format("HH:mm"),
        });
        this.settingService.setSetting({
            key: SettingKey[`${prefix}_WORK_TO`],
            value: "23:59",
        });
        await this.settingService.setSetting({
            key: SettingKey["ATTENDANCE_REGISTER_DELAY_ALLOW"],
            value: 15,
        });
    }

    @Post("test/setting/in-time")
    @ApiOperation({ summary: "Thiết lập setting để điểm danh lúc đến là đúng giờ" })
    async testSettingInvalidInTime() {
        const now = new Date();
        const preriod = await this.attendanceService.getPeriodOfTime();
        const prefix = preriod === PeriodOfTime.MORNING ? "MORNING" : "AFTERNOON";
        await this.settingService.setSetting({
            key: SettingKey[`${prefix}_WORK_FROM`],
            value: moment(now).subtract(5, "minute").format("HH:mm"),
        });
        this.settingService.setSetting({
            key: SettingKey[`${prefix}_WORK_TO`],
            value: "23:59",
        });
        await this.settingService.setSetting({
            key: SettingKey["ATTENDANCE_REGISTER_DELAY_ALLOW"],
            value: 15,
        });
    }

    @Post("test/setting/late")
    @ApiOperation({ summary: "Thiết lập setting để điểm danh lúc đến là đi muộn" })
    async testSettingInvalidLate() {
        const now = new Date();
        const preriod = await this.attendanceService.getPeriodOfTime();
        const prefix = preriod === PeriodOfTime.MORNING ? "MORNING" : "AFTERNOON";
        await this.settingService.setSetting({
            key: SettingKey[`${prefix}_WORK_FROM`],
            value: moment(now).subtract(30, "minute").format("HH:mm"),
        });
        await this.settingService.setSetting({
            key: SettingKey[`${prefix}_WORK_TO`],
            value: "23:59",
        });
        await this.settingService.setSetting({
            key: SettingKey["ATTENDANCE_REGISTER_DELAY_ALLOW"],
            value: 15,
        });
    }

    @Delete("test/me/today")
    @ApiOperation({ summary: "Xóa toàn bộ điểm danh ngày hôm nay" })
    async testDeleteToday(
        @ReqUser() user: UserDocument,
    ) {
        const date = moment().format("YYYY/MM/DD");
        return this.attendanceModel.deleteMany({ username: user.username, date }).exec();
    }
}