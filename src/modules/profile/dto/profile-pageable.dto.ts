import { PageableDto } from "../../../common/dto/pageable.dto";
import { Profile } from "../entities/profile.entity";

export class ProfilePageableDto extends PageableDto<Profile> {
    result: Profile[];
}