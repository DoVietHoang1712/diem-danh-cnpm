import { SettingSearchBody } from './entities/setting-search.entity';
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Authorization, SystemRoles } from "../../common/decorator/auth.decorator";
import { SystemRole } from "../user/common/user.constant";
import { SettingKey } from "./common/setting.constant";
import { CreateSettingDTO } from "./dto/create-setting.dto";
import { Setting } from "./entities/setting.entity";
import { SettingService } from "./service/setting.service";

@Controller("setting")
@ApiTags("setting")
@Authorization()
export class SettingController {
    constructor(
        private readonly settingService: SettingService,
    ) { }

    @Get("/:key")
    async getByKey(@Param("key") key: SettingKey): Promise<Setting> {
        return this.settingService.getSetting(key);
    }

    @Post("upsert")
    @SystemRoles(SystemRole.ADMIN)
    async upsertSetting(@Body() data: CreateSettingDTO) {
        return this.settingService.setSetting(data);
    }
}