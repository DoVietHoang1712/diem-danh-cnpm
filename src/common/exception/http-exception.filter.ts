import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { ErrorResponseDto } from "../dto/response/error-response.dto";
import { ResponseDto } from "../dto/response/response.dto";
import { ErrorData } from "./error-data";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        let statusCode: number;
        let errorCode: string;
        let errorDescription: string;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const excResponse = exception.getResponse();
            if (excResponse instanceof ErrorData) {
                errorCode = excResponse.errorCode;
                errorDescription = excResponse.errorDescription;
            } else {
                errorDescription = exception.message;
            }
        } else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            errorDescription = "Internal server error";
            console.error(exception.message);
        }

        const errorObject = {
            timestamp: new Date(),
            statusCode,
            method: request.method,
            path: request.path,
            errorCode,
            errorDescription,
        } as ErrorResponseDto;

        console.error(JSON.stringify(Object.assign({}, errorObject, { exception }), null, 2));;
        response.status(statusCode).json(errorObject);

    }
}