import { ResponseDto } from "../../../common/dto/response/response.dto";
import { Profile } from "../entities/profile.entity";

export class ProfileResponseDto extends ResponseDto<Profile> {
    data: Profile;
}