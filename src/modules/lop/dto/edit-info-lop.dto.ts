import { PartialType, PickType } from "@nestjs/swagger";
import { Lop } from "../lop.schema";

export class EditInfoLopDTO extends PartialType(
    PickType(Lop, ["maMonHoc", "coSoDaoTao", "heDaoTao", "hinhThucGiangDay", "ngonNguGiangDay", "chuongTrinhGiangDay"]),
) {}
