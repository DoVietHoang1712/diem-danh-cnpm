import { OmitType } from "@nestjs/swagger";
import { ResponseDto } from "./response.dto";

export class ErrorResponseDto extends OmitType(ResponseDto, [
    "data",
]) {
    errorCode: string;
    errorDescription: string;
    message: string;
}