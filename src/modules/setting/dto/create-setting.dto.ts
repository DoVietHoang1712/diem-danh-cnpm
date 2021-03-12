import { OmitType } from "@nestjs/swagger";
import { Setting } from "./../entities/setting.entity";

export class CreateSettingDTO extends Setting { }