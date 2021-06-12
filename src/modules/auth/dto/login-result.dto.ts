import { UserDocument } from "../../user/entities/user.entity";

export class LoginResultDto {
    user: UserDocument;
    accessToken: string;
}