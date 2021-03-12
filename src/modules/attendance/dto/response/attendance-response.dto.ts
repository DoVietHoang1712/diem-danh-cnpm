import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { Attendance } from "../../entities/attendance.entity";

export class AttendanceResponseDto extends ResponseDto<Attendance> {
    data: Attendance;
}