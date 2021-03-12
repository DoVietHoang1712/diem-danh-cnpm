import { ResponseDto } from "../../../common/dto/response/response.dto";
import { Profile } from "../entities/profile.entity";

export class ProfileListResponseDto extends ResponseDto<Profile[]> {
    data: Profile[];
}