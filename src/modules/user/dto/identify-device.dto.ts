import { IsString } from "class-validator";

export class IdentifyDeviceDto {
    @IsString()
    password: string;
}