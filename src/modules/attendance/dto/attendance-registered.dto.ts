import { AttendanceResult } from "../common/attendance.constant";

export class AttendanceRegisteredDto {
    username: string;
    firstname: string;
    lastname: string;
    gender: string;
    dateOfBirth: string;
    checkInAt: Date;
    checkInResult: AttendanceResult;
    checkOutAt: Date;
    workDuration: number;
}