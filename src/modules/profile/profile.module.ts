import { Module } from "@nestjs/common";
import { ProfileAbitityFactory } from "./common/profile.ability";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
    controllers: [ProfileController],
    providers: [
        ProfileService,
        ProfileAbitityFactory,
    ],
})
export class ProfileModule { }
