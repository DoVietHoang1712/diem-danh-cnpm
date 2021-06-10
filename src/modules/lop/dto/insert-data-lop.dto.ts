import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { GiangVien, LichHoc } from "../lop.schema";

export class InsertDataUserDTO {
    @ApiProperty()
    @IsNotEmpty()
    maSv: string;
    @ApiProperty()
    @IsNotEmpty()
    hoTen: string;
}

export class LichHocDTO extends PartialType(LichHoc) {}

export class InsertDataLopDTO {
    @ApiProperty()
    @IsNotEmpty()
    tenLopHoc: string;
    @ApiProperty()
    @IsNotEmpty()
    maLopHoc: string;
    @ApiProperty()
    @IsNotEmpty()
    maMonHoc: string;
    danhSachGiangVien: GiangVien[];
    @ApiProperty({ type: [InsertDataUserDTO] })
    @IsNotEmpty()
    giaoVien: InsertDataUserDTO[];
    @ApiProperty()
    @IsNotEmpty()
    maKyHoc: string;
    @ApiProperty({ type: [LichHocDTO] })
    @IsNotEmpty()
    lichHoc: LichHocDTO[];
}
