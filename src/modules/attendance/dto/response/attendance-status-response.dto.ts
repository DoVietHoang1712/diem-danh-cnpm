import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { AttendanceStatus } from "../attendance-status.dto";

export class AttendanceStatusResponseDto extends ResponseDto<AttendanceStatus> {
    data: AttendanceStatus;
}