import { Setting } from './setting.entity';
import { PartialType } from "@nestjs/swagger";

export class SettingSearchBody extends PartialType(Setting) { }