import { IsString } from "class-validator";

export class AttendanceRegisterDto {
    @IsString()
    otp: string;

    @IsString()
    bssid: string;
}