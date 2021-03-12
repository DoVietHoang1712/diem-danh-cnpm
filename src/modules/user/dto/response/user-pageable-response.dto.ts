import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { UserPageableDto } from "../user-pageable.dto";

export class UserPageableResponseDto extends ResponseDto<UserPageableDto> {
    data: UserPageableDto;
}