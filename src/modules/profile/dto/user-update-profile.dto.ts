import { OmitType } from "@nestjs/swagger";
import { UpdateProfileDto } from "./update-profile.dto";

export class UserUpdateProfileDto extends OmitType(UpdateProfileDto, [
    "username",
]) { }