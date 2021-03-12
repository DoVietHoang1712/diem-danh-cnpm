import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseDto } from "../dto/response/response.dto";

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto> {
        return next.handle().pipe(map((data: any) => {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest<Request>();
            const res = ctx.getResponse<Response>();
            if (data instanceof ResponseDto) {
                data.timestamp = new Date();
                data.method = req.method;
                data.path = req.path;
                data.statusCode = res.statusCode;
            }
            return data;
        }));
    }
}