import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class AttendanceRegisterDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    otp?: number;

    @IsString()
    @ApiProperty()
    maLopHoc: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    maMocHoc?: string;

    @ApiProperty()
    @IsString()
    studyFrom: string;

    @ApiProperty()
    @IsString()
    studyTo: string;
}