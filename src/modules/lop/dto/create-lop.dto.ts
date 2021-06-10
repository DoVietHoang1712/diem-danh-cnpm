import { OmitType, PartialType } from "@nestjs/swagger";
import { Lop } from "../lop.schema";

export class CreateLopDTO extends PartialType(OmitType(Lop, ["danhSachSinhVien", "danhSachGiangVien", "lichHoc"])) {}
