import { ResponseDto } from "../../../common/dto/response/response.dto";
import { ProfilePageableDto } from "./profile-pageable.dto";

export class ProfilePageableResponseDto extends ResponseDto<ProfilePageableDto> {
    data: ProfilePageableDto;
}