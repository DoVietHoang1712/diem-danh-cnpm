import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { User } from "../../entities/user.entity";

export class UserListResponseDto extends ResponseDto<User[]> {
    data: User[];
}