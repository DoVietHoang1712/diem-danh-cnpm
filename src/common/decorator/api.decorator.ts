import { applyDecorators, HttpStatus, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse } from "@nestjs/swagger";
import { ErrorResponseDto } from "../dto/response/error-response.dto";
import { ResponseDto } from "../dto/response/response.dto";
import { ErrorData } from "../exception/error-data";
import { FetchPageableQueryPipe } from "../pipe/fetch-pageable-query.pipe";
import { FetchQueryPipe } from "../pipe/fetch-query.pipe";

export const ApiPageableQuery = () => applyDecorators(
    ApiQuery({
        name: "page",
        required: false,
        example: 1,
    }),
    ApiQuery({
        name: "limit",
        required: false,
        example: 20,
    }),
);

export const ApiSelectQuery = () => applyDecorators(
    ApiQuery({
        name: "select",
        required: false,
        examples: {
            Default: {
                value: "",
            },
            "MongoDB - include": {
                value: {
                    firstname: 1,
                    lastname: 1,
                },
            },
            "MongoDB - exclude": {
                value: {
                    firstname: 0,
                    lastname: 0,
                },
            },
        },
    }),
);

export const ApiSortQuery = () => applyDecorators(
    ApiQuery({
        name: "sort",
        required: false,
        examples: {
            Default: {
                value: "",
            },
            MongoDB: {
                value: {
                    createdAt: -1,
                    firstname: 1,
                },
            },
        },
    }),
);

export const ApiListQuery = () => applyDecorators(
    ApiSelectQuery(),
    ApiSortQuery(),
);

export const ApiPageableListQuery = () => applyDecorators(
    ApiPageableQuery(),
    ApiSelectQuery(),
    ApiSortQuery(),
);

export const ApiErrorResponse = (
    statusCode: HttpStatus,
    errors: ErrorData[],
) => ApiResponse({
    status: statusCode,
    description: `<table><thead><tr><th>Error code</th><th>Description</th></tr></thead><tbody>${
        errors.map(e => `<tr><td>${e.errorCode}</td><td>${e.errorDescription}</td></tr>`).join("")
    }</tbody></table>`,
    type: ErrorResponseDto,
});

export const FetchQuery = () => Query(FetchQueryPipe);
export const FetchPageableQuery = () => Query(FetchPageableQueryPipe);