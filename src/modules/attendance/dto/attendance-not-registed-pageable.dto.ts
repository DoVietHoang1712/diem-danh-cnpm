import { PageableDto } from "../../../common/dto/pageable.dto";
import { AttendanceUnregisteredDto } from "./attendance-unregistered.dto";

export class AttendanceUnregisteredPageableDto extends PageableDto<AttendanceUnregisteredDto> {
    result: AttendanceUnregisteredDto[];
}