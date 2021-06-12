import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AttendanceRegisterDto {
    @IsString()
    @ApiProperty()
    otp: string;

    @IsString()
    @ApiProperty()
    maLopHoc: string;

    @IsString()
    @ApiProperty()
    maMocHoc: string;

    @ApiProperty()
    @IsString()
    studyFrom: string;

    @ApiProperty()
    @IsString()
    studyTo: string;
}