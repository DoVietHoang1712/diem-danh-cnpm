import { HttpException, HttpStatus } from "@nestjs/common";

export class ErrorData {
    readonly errorCode: string;
    readonly errorDescription: string;

    constructor(errorCode: string, errorDescription?: string) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
    }

    static init(statusCode: HttpStatus, errorCode: string, errorDescription?: string): HttpException {
        return new HttpException(new ErrorData(errorCode, errorDescription), statusCode);
    }
}