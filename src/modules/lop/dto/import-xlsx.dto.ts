import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ImportXlsxDTO {
    @ApiProperty({ type: "string", format: "binary" })
    @IsNotEmpty()
    file: string;
}
