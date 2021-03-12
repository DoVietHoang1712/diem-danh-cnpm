import { CommonResultDto } from "../common-result.dto";
import { ResponseDto } from "./response.dto";

export class CommonResultResponseDto extends ResponseDto<CommonResultDto> {
    data: CommonResultDto;
}