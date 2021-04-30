import { AttendanceSchema } from "../attendance/entities/attendance.entity";
import { SettingSchema } from "./../setting/entities/setting.entity";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileSchema } from "../profile/entities/profile.entity";
import { UserSchema } from "../user/entities/user.entity";
import { DB_ATTENDANCE, DB_PROFILE, DB_REQUEST_IDENTITY, DB_SETTING, DB_USER } from "./db-collection";
import { RequestIdentitySchema } from "../user/entities/request-identity.entity";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DB_USER, schema: UserSchema },
            { name: DB_PROFILE, schema: ProfileSchema },
            { name: DB_SETTING, schema: SettingSchema },
            { name: DB_ATTENDANCE, schema: AttendanceSchema },
            { name: DB_REQUEST_IDENTITY, schema: RequestIdentitySchema },
        ]),
    ],
    exports: [
        MongooseModule,
    ],
})
export class RepositoryModule { }