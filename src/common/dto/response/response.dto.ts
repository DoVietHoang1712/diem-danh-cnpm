
export class ResponseDto<T = any> {
    timestamp: Date;
    statusCode: number;
    method: string;
    path: string;
    data: T;

    static response<T>(data: T): ResponseDto<T> {
        return {
            timestamp: undefined,
            statusCode: undefined,
            method: undefined,
            path: undefined,
            data,
        };
    }
}