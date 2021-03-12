import { AttendanceRegistedPagebleDto } from "../attendance-registered-pageable.dto";
import { ResponseDto } from "../../../../common/dto/response/response.dto";
export class AttendanceRegisteredPageableResponseDto extends ResponseDto<AttendanceRegistedPagebleDto> { 
    data: AttendanceRegistedPagebleDto;
}