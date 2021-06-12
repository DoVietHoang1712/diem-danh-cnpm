import { ProfileSchema } from './../profile/entities/profile.entity';
import { DB_PROFILE } from './../repository/db-collection';
import { LOP_MODEL, LopSchema } from './../lop/lop.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceService } from "./service/attendance.service";
import { AttendanceController } from "./attendance.controller";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LOP_MODEL, schema: LopSchema },
            { name: DB_PROFILE, schema: ProfileSchema }
        ])
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService],
})

export class AttendanceModule { }