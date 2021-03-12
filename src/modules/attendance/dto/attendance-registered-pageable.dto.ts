import { PageableDto } from "../../../common/dto/pageable.dto";
import { AttendanceRegisteredDto } from "./attendance-registered.dto";
export class AttendanceRegistedPagebleDto extends PageableDto<AttendanceRegisteredDto> {
    result: AttendanceRegisteredDto[];
}