import { PeriodOfTime } from "../../setting/common/setting.constant";
import { AttendanceType } from "../common/attendance.constant";

export class AttendanceStatus {
    periodOfTime: PeriodOfTime;
    status: AttendanceType;
    workDuration?: number;
}