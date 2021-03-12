import { Global, Module } from "@nestjs/common";
import { SettingService } from "./service/setting.service";
import { SettingController } from "./setting.controller";
@Global()
@Module({
    controllers: [SettingController],
    providers: [SettingService],
    exports: [SettingService],
})

export class SettingModule { }