import { AttendanceUnregisteredPageableDto } from "../attendance-not-registed-pageable.dto";
import { ResponseDto } from "../../../../common/dto/response/response.dto";
export class AttendanceUnregisteredPageableResponse extends ResponseDto<AttendanceUnregisteredPageableDto> {
    data: AttendanceUnregisteredPageableDto;
}