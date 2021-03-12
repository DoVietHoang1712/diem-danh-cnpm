import { OmitType, PickType } from "@nestjs/swagger";
import { Profile } from "../entities/profile.entity";

export class CreateProfileDto extends OmitType(Profile, [
    "publicInfo",
]) { }
