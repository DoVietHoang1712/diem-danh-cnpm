import { IsNotEmpty, IsString } from "class-validator";

export class LoginMobileRequestDto {
    /**
     * Username
     * @example username
     */
    @IsString()
    username: string;
    /**
     * Password
     * @example password
     */
    @IsString()
    password: string;
    /**
     * Username
     * @example deviceId
     */
    @IsString()
    @IsNotEmpty()
    deviceId: string;
}