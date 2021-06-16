import { LopDocument, LOP_MODEL } from './../../lop/lop.schema';
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Crypto from "crypto-js";
import { filter } from "lodash";
import * as moment from "moment";
import { Model } from "mongoose";
import { check } from "prettier";
import { ErrorData } from "../../../common/exception/error-data";
import { FetchQueryOption } from "../../../common/pipe/fetch-query-option.interface";
import { DB_ATTENDANCE } from "../../repository/db-collection";
import { PeriodOfTime, SettingKey } from "../../setting/common/setting.constant";
import { SettingService } from "../../setting/service/setting.service";
import { UserDocument } from "../../user/entities/user.entity";
import { AttendanceErrorCode, AttendanceResult, AttendanceType } from "../common/attendance.constant";
import { AttendanceUnregisteredDto } from "../dto/attendance-unregistered.dto";
import { AttendanceRegistedPagebleDto } from "../dto/attendance-registered-pageable.dto";
import { AttendanceRegisterDto } from "../dto/attendance-register.dto";
import { AttendanceStatus } from "../dto/attendance-status.dto";
import { Attendance, AttendanceDocument } from "../entities/attendance.entity";
import { PageableDto } from "./../../../common/dto/pageable.dto";
import { DB_PROFILE, DB_USER } from "./../../repository/db-collection";
import { AttendanceUnregisteredPageableDto } from "./../dto/attendance-not-registed-pageable.dto";
import * as blueBird from "bluebird";
import { ProfileDocument } from '../../profile/entities/profile.entity';
@Injectable()
export class AttendanceService {
    constructor(
        @InjectModel(DB_ATTENDANCE)
        private readonly attendanceModel: Model<AttendanceDocument>,
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(LOP_MODEL)
        private readonly lopModel: Model<LopDocument>,
        @InjectModel(DB_PROFILE)
        private readonly profileModel: Model<ProfileDocument>,
        private readonly settingService: SettingService,
    ) { }

    async getPeriodOfTime(): Promise<PeriodOfTime> {
        const now = moment().format("HH:mm");
        // const afternoonWorkFrom = await this.settingService.getSettingValue(SettingKey.AFTERNOON_WORK_FROM);
        if (now >= "06:00" && now <= "13:00") {
            return PeriodOfTime.MORNING;
        } else {
            return PeriodOfTime.AFTERNOON;
        }
    }

    static getTodayString(): string {
        return moment().format("YYYY/MM/DD");
    }

    async getAttendanceOtp() {
        const timestamp = Math.floor(Date.now() / 15000).toString();
        const attendancePrivateKey = await this.settingService.getSettingValue(SettingKey.ATTENDANCE_PRIVATE_KEY);
        return Crypto.HmacSHA1(timestamp, attendancePrivateKey).toString();
    }

    private async validateRegister(info: AttendanceRegisterDto): Promise<void> {
        const [otp, bssid] = await Promise.all([
            this.getAttendanceOtp(),
            this.settingService.getSettingValue(SettingKey.WORKSPACE_BSSID),
        ]);
        // if (info.otp !== otp) {
        //     throw ErrorData.init(HttpStatus.BAD_REQUEST, AttendanceErrorCode.BAD_REQUEST_INVALID_OTP);
        // }
        // if (String(info.bssid).toUpperCase() !== String(bssid).toUpperCase()) {
        //     throw ErrorData.init(HttpStatus.BAD_REQUEST, AttendanceErrorCode.BAD_REQUEST_INVALID_BSSID);
        // }
    }

    private async getResult(
        data: Attendance,
    ): Promise<AttendanceResult> {
        const registerAt = moment(data.registerAt).format("HH:mm");
        const delay = parseInt(await this.settingService.getSettingValue(SettingKey.ATTENDANCE_REGISTER_DELAY_ALLOW), 10);
        const registerAtWithDelay = moment(data.registerAt).format("HH:mm");
        if (registerAt <= data.studyFrom) {
            return AttendanceResult.IN_TIME;
        } else {
            return AttendanceResult.LATE;
        }
    }

    private async getAttendanceTimeInfo(registerAt: Date) {
        const periodOfTime = await this.getPeriodOfTime();
        let workFromSettingKey: SettingKey;
        let workToSettingKey: SettingKey;
        switch (periodOfTime) {
            case PeriodOfTime.MORNING:
                workFromSettingKey = SettingKey.MORNING_WORK_FROM;
                workToSettingKey = SettingKey.MORNING_WORK_TO;
                break;
            case PeriodOfTime.AFTERNOON:
                workFromSettingKey = SettingKey.AFTERNOON_WORK_FROM;
                workToSettingKey = SettingKey.AFTERNOON_WORK_TO;
                break;
        }
        const [workFrom, workTo] = await Promise.all([
            this.settingService.getSettingValue<string>(workFromSettingKey),
            this.settingService.getSettingValue<string>(workToSettingKey),
        ]);

        return {
            registerAt,
            workFrom,
            workTo,
            periodOfTime,
        };
    }

    async getAttendanceStatus(user: UserDocument): Promise<AttendanceStatus> {
        const today = AttendanceService.getTodayString();
        const periodOfTime = await this.getPeriodOfTime();
        const [existsIn, existsOut] = await Promise.all([
            this.attendanceModel
                .exists({
                    username: user.username,
                    date: today,
                    periodOfTime,
                    type: AttendanceType.IN,
                }),
            this.attendanceModel
                .findOne({
                    username: user.username,
                    date: today,
                    periodOfTime,
                    type: AttendanceType.OUT,

                })
                .select("workDuration"),
        ]);
        if (!existsIn && !existsOut) {
            return {
                periodOfTime,
                status: AttendanceType.NONE,
            };
        } else if (!existsOut) {
            return {
                periodOfTime,
                status: AttendanceType.IN,
            };
        } else {
            return {
                periodOfTime,
                status: AttendanceType.OUT,
                workDuration: 0,
            };
        }
    }

    async createIn(
        user: UserDocument,
        info: AttendanceRegisterDto,
    ): Promise<AttendanceDocument> {
        const today = moment().toDate();
        const date = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();
        console.log(date);
        // await this.validateRegister(info);

        // const status = await this.getAttendanceStatus(user);
        // if (status.status !== AttendanceType.NONE) {
        //     throw ErrorData.init(HttpStatus.BAD_REQUEST, AttendanceErrorCode.BAD_REQUEST_INVALID_TYPE);
        // }
        const isExists = await this.attendanceModel.findOne({username: user.username, maLopHoc: info.maLopHoc, studyFrom: info.studyFrom, studyTo: info.studyTo, date, month, year});
        if (isExists) {
            throw ErrorData.init(HttpStatus.BAD_REQUEST, AttendanceErrorCode.BAD_REQUEST_INVALID_TYPE, "Đã thực hiện điểm danh");
        }
        const registerAt = new Date();
        // const timeInfo = await this.getAttendanceTimeInfo(registerAt);

        const data: Attendance = {
            username: user.maSv.toLowerCase(),
            deviceId: user.clientDeviceId,
            date,
            month,
            year,
            maLopHoc: info.maLopHoc,
            maMonHoc: info.maMocHoc,
            studyFrom: info.studyFrom,
            studyTo: info.studyTo,
            // periodOfTime: timeInfo.periodOfTime,
            inResult: undefined,
            type: AttendanceType.IN,
        };

        data.inResult = await this.getResult(data);
        return this.attendanceModel.create(data);
    }

    async createOut(
        user: UserDocument,
        info: AttendanceRegisterDto,
    ): Promise<AttendanceDocument> {
        const today = moment().toDate();
        const date = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();

        await this.validateRegister(info);

        const status = await this.getAttendanceStatus(user);
        if (status.status !== AttendanceType.IN) {
            throw ErrorData.init(HttpStatus.BAD_REQUEST, AttendanceErrorCode.BAD_REQUEST_INVALID_TYPE);
        }

        const registerAt = new Date();
        const timeInfo = await this.getAttendanceTimeInfo(registerAt);
        const inRegister = await this.attendanceModel
            .findOne({
                username: user.username,
                date: today,
                periodOfTime: timeInfo.periodOfTime,
                type: AttendanceType.IN,
            }).select("createdAt");
        const data: Attendance = {
            username: user.username,
            deviceId: user.clientDeviceId,
            date: date,
            month,
            year,
            maLopHoc: info.maLopHoc,
            maMonHoc: info.maMocHoc,
            registerAt: new Date(),
            studyFrom: timeInfo.workFrom,
            studyTo: timeInfo.workTo,
            periodOfTime: timeInfo.periodOfTime,
            // workDuration: Math.floor(moment.duration(moment().diff(moment(inRegister.createdAt))).asSeconds()),
            type: AttendanceType.OUT,
        };
        return this.attendanceModel.create(data);
    }

    async getRegistedUserInClass(maLopHoc: string, date: number, month: number, year: number, studyFrom: string, studyTo: string) {
        const lop = await this.lopModel.findOne({ maLopHoc });
        if (lop) {
            const danhSachSinhVien = lop.danhSachSinhVien.sort((a: any, b: any) => a.maSv - b.maSv);
            const result = await blueBird.Promise.map(danhSachSinhVien, async sinhVien => {
                const profile = await this.profileModel.findOne({ username: sinhVien.maSv });
                const data = await this.attendanceModel.findOne({
                    username: sinhVien.maSv.toLowerCase(),
                    date,
                    month,
                    year,
                    maLopHoc,
                    studyFrom,
                    studyTo,
                });
                return {
                    maSv: sinhVien.maSv,
                    firstname: profile?.firstname ?? null,
                    lastname: profile?.lastname ?? null,
                    registerAt: data?.registerAt ?? null,
                    inResult: data?.inResult ?? null,
                }
            }, { concurrency: 4 });
            return result;
        } else {
            throw new NotFoundException("Không tìm thấy thông tin lớp");
        }
        // const data = await this.lopModel.aggregate([
        //     {
        //         $match: {
        //             maLopHoc: maLopHoc,
        //         }
        //     },
        //     {
        //         $unwind: "$danhSachSinhVien"
        //     },
        //     {
        //         $lookup: {
        //             from: DB_PROFILE,
        //             localField: "danhSachSinhVien.maSv",
        //             foreignField: "username",
        //             as: "profile",
        //         }
        //     },
        //     { $unwind: "$profile" },
        //     // {
        //     //     $lookup: {
        //     //         from: DB_ATTENDANCE,
        //     //         let: { username: "$danhSachSinhVien.maSv" },
        //     //         pipeline: [
        //     //             {
        //     //                 $match: {
        //     //                     $expr: {
        //     //                         $and: [
        //     //                             { $eq: ["$username", "$$username"] },
        //     //                             { $eq: ["$type", "In"] },
        //     //                             { $eq: ["$month", month] },
        //     //                             { $eq: ["$year", year] },
        //     //                             { $eq: ["$date", date] },
        //     //                             { $eq: ["$maLopHoc", maLopHoc] },
        //     //                             { $eq: ["$studyFrom", studyFrom] },
        //     //                             { $eq: ["$studyTo", studyTo] },
        //     //                         ]
        //     //                     }
        //     //                 }
        //     //             }
        //     //         ],
        //     //         as: "checkIn",
        //     //     }
        //     // },
        //     // { $unwind: "$checkIn" },
        //     {
        //         $project: {
        //             maSv: "$danhSachSinhVien.maSv",
        //             firstname: "$profile.firstname",
        //             lastname: "$profile.lastname",
        //             registerAt: "$checkIn.registerAt",
        //             // inResult: "$checkIn.inResult",
        //         }
        //     }
        // ]);
        // console.log(data);
    }

    async getRegistedUser(
        date: string,
        periodOfTime: PeriodOfTime,
        inResult: AttendanceResult,
        checkedOut: string,
        option: FetchQueryOption,
    ): Promise<AttendanceRegistedPagebleDto> {
        const dateString = moment(date).format("YYYY/MM/DD");
        const matchCondition1: Record<string, any> = {
            date: dateString,
            periodOfTime,
            type: AttendanceType.IN,
        };
        if (inResult) {
            matchCondition1.inResult = inResult;
        }
        const matchCondition2: Record<string, any> = {};
        if (checkedOut === "1") {
            matchCondition2.checkOut = { $exists: true };
        }
        const data = await this.attendanceModel.aggregate([
            { $match: matchCondition1 },
            {
                $lookup: {
                    from: DB_PROFILE,
                    localField: "username",
                    foreignField: "username",
                    as: "profile",
                },
            },
            { $unwind: "$profile" },
            {
                $lookup: {
                    from: DB_ATTENDANCE,
                    let: { username: "$username" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$username", "$$username"] },
                                        { $eq: ["$date", dateString] },
                                        { $eq: ["$periodOfTime", periodOfTime] },
                                        { $eq: ["$type", AttendanceType.OUT] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "checkOut",
                },
            },
            {
                $unwind: {
                    path: "$checkOut",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $match: matchCondition2 },
            {
                $project: {
                    username: 1,
                    firstname: "$profile.firstname",
                    lastname: "$profile.lastname",
                    gender: "$profile.gender",
                    dateOfBirth: "$profile.dateOfBirth",
                    checkInAt: "$registerAt",
                    checkInResult: 1,
                    checkOutAt: "$checkOut.registerAt",
                    workDuration: "$checkOut.workDuration",
                },
            },
            {
                $facet: {
                    stat: [
                        { $count: "total" },
                    ],
                    data: [
                        { $skip: option.skip },
                        { $limit: option.limit },
                    ],
                },
            },
        ]);
        return PageableDto.create(
            option,
            data[0]?.stat?.[0]?.total || 0,
            data[0]?.data || [],
        );
    }

    async getUnregistedUser(
        date: string,
        periodOfTime: PeriodOfTime,
        option: FetchQueryOption
    ): Promise<AttendanceUnregisteredPageableDto> {
        const dateObj = moment(date).endOf("days");
        const dateString = dateObj.format("YYYY/MM/DD");
        const data = await this.userModel.aggregate([
            {
                $match: {
                    createdAt: { $lte: dateObj.toDate() },
                },
            },
            {
                $lookup: {
                    from: DB_PROFILE,
                    localField: "username",
                    foreignField: "username",
                    as: "profile",
                },
            },
            {
                $unwind: {
                    path: "$profile",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: DB_ATTENDANCE,
                    let: { username: "$username" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$username", "$$username"] },
                                        { $eq: ["$date", dateString] },
                                        { $eq: ["$periodOfTime", periodOfTime] },
                                        { $eq: ["$type", AttendanceType.IN] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "checkIn",
                },
            },
            {
                $unwind: {
                    path: "$checkIn",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $match: { checkIn: { $exists: false } } },
            {
                $project: {
                    username: 1,
                    firstname: "$profile.firstname",
                    lastname: "$profile.lastname",
                    gender: "$profile.gender",
                    dateOfBirth: "$profile.dateOfBirth",
                },
            },
            {
                $facet: {
                    stat: [
                        { $count: "total" },
                    ],
                    data: [
                        { $skip: option.skip },
                        { $limit: option.limit },
                    ],
                },
            },
        ]);
        return PageableDto.create(
            option,
            data[0]?.stat?.[0]?.total || 0,
            data[0]?.data || [],
        );
    }
}