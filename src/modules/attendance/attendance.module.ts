import { AttendanceService } from "./service/attendance.service";
import { AttendanceController } from "./attendance.controller";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService],
})

export class AttendanceModule { }