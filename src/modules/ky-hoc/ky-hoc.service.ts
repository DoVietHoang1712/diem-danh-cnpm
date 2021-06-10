import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateKyHocDTO } from "./dto/create-ky-hoc.dto";
import { KyHoc, KyHocDocument, KY_HOC_MODEL } from "./ky-hoc.schema";
import { ExportTool } from "src/tools/export.tools";
import { Promise } from "bluebird";

@Injectable()
export class KyHocService {
    constructor(
        @InjectModel(KY_HOC_MODEL)
        private readonly kyHocModel: Model<KyHocDocument>,
    ) {

    }

    async getNamHoc() {
        const dsNamHoc = await this.kyHocModel.distinct("namHoc");
        dsNamHoc.sort((a, b) => b - a);
        return dsNamHoc.map(a => `${a}-${a + 1}`);
    }

    async findCurrentKyHoc(): Promise<KyHoc> {
        return this.kyHocModel
            .findOne()
            .sort({ ngayBatDau: -1 })
            .lean()
            .exec();
    }

    async createKyHoc(data: CreateKyHocDTO): Promise<KyHoc> {
        const day = data.ngayBatDau.getDay();
        if (day === 1) {
            throw new NotFoundException(400, "Not Monday");
        }
        return this.kyHocModel.create(data);
    }

    // async findListKyHocOfSinhVien(maSv: string) {
    //     const lopHanhChinh = await this.lopHanhChinhModel.findOne({
    //         danhSachMaSinhVien: maSv,
    //     });
    //     const thisYear = new Date().getFullYear();
    //     const listHocKy = this.kyHocModel
    //         .find({
    //             namHoc: { $gte: lopHanhChinh?.namBatDau || 0, $lte: lopHanhChinh?.namKetThuc || thisYear },
    //         })
    //         .sort({
    //             namHoc: -1,
    //             ky: -1,
    //         })
    //         .exec();
    //     return listHocKy;
    // }
}
