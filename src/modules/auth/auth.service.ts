import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";
import { ErrorData } from "../../common/exception/error-data";
import { ClientPlatform } from "../../config/constant";
import { DB_USER } from "../repository/db-collection";
import { UserDocument } from "../user/entities/user.entity";
import { AuthErrorCode } from "./common/auth.constant";
import { JwtPayload } from "./dto/jwt-payload";
import { LoginMobileRequestDto } from "./dto/login-mobile-request.dto";
import { LoginResultDto } from "./dto/login-result.dto";
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username });
        if (user) {
            const matchPassword = await user.comparePassword(password);
            if (matchPassword) {
                return user;
            }
            throw ErrorData.init(HttpStatus.UNAUTHORIZED, AuthErrorCode.UNAUTHORIZED_WRONG_PASSWORD);
        } else {
            throw ErrorData.init(HttpStatus.UNAUTHORIZED, AuthErrorCode.UNAUTHORIZED_USERNAME_NOT_FOUND);
        }
    }

    async loginWeb(user: UserDocument): Promise<LoginResultDto> {
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                authorizationVersion: user.authorizationVersion.version,
                platform: ClientPlatform.WEB,
            },
            jti: new mongo.ObjectId().toHexString(),
        };
        return { user, accessToken: this.jwtService.sign(payload) };
    }

    async loginMobile(user: UserDocument, loginInfo: LoginMobileRequestDto): Promise<LoginResultDto> {
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                authorizationVersion: user.authorizationVersion.version,
                platform: ClientPlatform.MOBILE,
                deviceId: loginInfo.deviceId,
            },
            jti: new mongo.ObjectId().toHexString(),
        };
        return { user, accessToken: this.jwtService.sign(payload) };
    }

}
