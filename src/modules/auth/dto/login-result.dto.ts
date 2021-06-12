import { UserDocument } from './../../../../dist/modules/user/entities/user.entity.d';
export class LoginResultDto {
    user: UserDocument;
    accessToken: string;
}