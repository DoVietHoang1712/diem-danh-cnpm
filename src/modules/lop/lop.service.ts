import { KyHoc, KyHocDocument } from './../ky-hoc/ky-hoc.schema';
import { UserService } from './../user/service/user.service';
import { DB_USER } from './../repository/db-collection';
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Promise } from "bluebird";
import * as moment from "moment";
import { Model } from "mongoose";
import * as xlsx from "xlsx";
import { ExportTool } from "../../tools/export.tools";
import { QueryOption, QueryPostOption } from "../../tools/request.tool";
import { EUploadFolder, UploadTool } from "../../tools/upload.tool";
// import { MonHocDocument } from "../mon-hoc/mon-hoc.schema";
// import { TKBToolService } from "../tool/tkb-tool/tkb-tool.service";
import { ObjectTool } from "./../../tools/object.tool";
import { CreateLopDTO } from "./dto/create-lop.dto";
import { InsertDataLopDTO } from "./dto/insert-data-lop.dto";
import { LichHoc, Lop, LopDocument, LOP_MODEL } from "./lop.schema";
import { User, UserDocument } from '../user/entities/user.entity';

@Injectable()
export class LopService {
    constructor(
        @InjectModel(LOP_MODEL)
        private readonly lopModel: Model<LopDocument>,
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,
        @InjectModel("KyHoc")
        private readonly kyHocModel: Model<KyHocDocument>,
        private readonly userService: UserService,
        //  readonly TKBTool: TKBToolService
    ) {

    }

    // async test() {
    //     return new Date(await this.TKBTool.getFirstWeekDate("20193"));
    // }

    // private async assignToday(lop: LopDocument, today: number): Promise<LopDocument> {
    //     const firstWeekDate = await this.TKBTool.getFirstWeekDate(lop.maKyHoc);
    //     const isToday = await (async (): Promise<boolean> => {
    //         for (const lichHoc of lop.lichHoc) {
    //             for (const tuanHoc of lichHoc.tuanHoc) {
    //                 const date = await this.TKBTool.getTKBDate(tuanHoc, lichHoc.thuHoc, lop.maKyHoc, firstWeekDate);
    //                 if (date === today) {
    //                     return true;
    //                 }
    //             }
    //         }
    //         return false;
    //     })();
    //     lop.set("today", isToday, { strict: false });
    //     return lop;
    // } 

    async getKyHocGanNhat(maGv: string): Promise<KyHoc> {
        const danhSachKyHocCoLop: KyHoc = this.lopModel
            .aggregate([
                {
                    $match: {
                        "danhSachGiangVien.maGv": maGv,
                    },
                },
                {
                    $group: {
                        _id: "$maKyHoc",
                    },
                },
                {
                    $lookup: {
                        from: "KyHoc",
                        localField: "_id",
                        foreignField: "maKyHoc",
                        as: "kyHocDetail",
                    },
                },
                {
                    $unwind: "$kyHocDetail",
                },
                {
                    $replaceRoot: {
                        newRoot: "$kyHocDetail",
                    },
                },
                {
                    $sort: {
                        maKyHoc: -1,
                    },
                },
            ])
            .exec() as any;
        return danhSachKyHocCoLop;
    }

    async searchCurrentAvailableClass(maGv: string, maKyHoc: string): Promise<any> {
        // maKyHoc =
        //     maKyHoc ||
        //     (await this.kyHocModel
        //         .findOne()
        //         .sort({ maKyHoc: -1 })
        //         .then(res => res.maKyHoc));
        const data = await this.lopModel
            .find({ maKyHoc, "danhSachGiangVien.maGv": { $ne: maGv } })
            .select({
                tenLopHoc: 1,
                maMonHoc: 1,
                maLopHoc: 1,
                maKyHoc: 1,
                lichHoc: 1,
            })
            .sort({ tenLopHoc: 1 })
            .lean()
            .exec();
        return data;
    }

    async find(options: QueryOption, conditions: object = {}): Promise<Lop[]> {
        return (
            this.lopModel
                .find(conditions || {})
                .populate("monHoc", "-__v -updatedAt -createdAt")
                // .populate("giaoVien", "username hoTen maSv anhDaiDien")
                .sort(options.sort)
                .skip(options.skip)
                .limit(options.limit)
                .exec()
        );
    }

    async findAllOfUser(id: string, type: "SV" | "GV"): Promise<Lop[]> {
        const condition = type === "SV" ? { "danhSachSinhVien.maSv": id } : { "danhSachGiangVien.maGv": id };
        const result = this.lopModel
            .find(condition)
            .populate("monHoc", "-__v -updatedAt -createdAt")
            .populate("kyHoc");
        // .populate("giaoVien", "username hoTen maSv anhDaiDien");
        return result.exec();
    }

    async findById(id: string): Promise<Lop> {
        const lop = await this.lopModel
            .findById(id)
            .populate("monHoc", "-__v -updatedAt -createdAt")
            .populate("kyHoc", "-__v -updatedAt -createdAt")
            .populate("danhSachSinhVien.sinhVien", "username hoTen maSv anhDaiDien userChatId")
            .populate("danhSachGiangVien.giangVien", "username hoTen maSv anhDaiDien userChatId")
            .populate("danhSachGiangDay.canBo", "maSv hoTen")
        return lop;
    }

    // async getCurrentInfoByMaLopHocAndMaKyHoc(maLopHoc: string, maKyHoc: string): Promise<LichHoc> {
    //     // const tkbInfo = await this.TKBTool.getTKBInfo(new Date(), maKyHoc);

    //     // TODO: Remove comment in production
    //     // const lich = await this.lopModel
    //     //     .findOne({
    //     //         maLopHoc,
    //     //         maKyHoc,
    //     //         lichHoc: {
    //     //             $elemMatch: {
    //     //                 tuanHoc: tkbInfo.tuan,
    //     //                 thuHoc: tkbInfo.thu,
    //     //             },
    //     //         },
    //     //     })
    //     //     .then(res => {
    //     //         if (res) {
    //     //             return res.lichHoc.filter(l => {
    //     //                 return (
    //     //                     l.tuanHoc.includes(tkbInfo.tuan) &&
    //     //                     l.thuHoc === tkbInfo.thu &&
    //     //                     l.thoiGianBatDau <= tkbInfo.thoiGian &&
    //     //                     tkbInfo.thoiGian <= l.thoiGianKetThuc
    //     //                 );
    //     //             });
    //     //         } else {
    //     //             return [];
    //     //         }
    //     //     });
    //     const lop = await this.lopModel
    //         .findOne({
    //             maLopHoc,
    //             maKyHoc,
    //         })
    //         .populate("monHoc", "tenMonHoc");
    //     if ((lop.lichHoc?.length ?? 0) > 0) {
    //         const lich: LichHoc = (lop.lichHoc[0] as any).toJSON();
    //         const ngayHoc = moment(await this.TKBTool.getTKBDate(lich.tuanHoc[0], lich.thuHoc, maKyHoc))
    //             .startOf("days")
    //             .valueOf();
    //         return Object.assign(lich, {
    //             tenMonHoc: (lop.monHoc as any).tenMonHoc || "Chưa có dữ liệu",
    //             maLopHoc: lop.maLopHoc,
    //             tuanHoc: lich.tuanHoc[0],
    //             ngayHoc,
    //         });
    //     } else {
    //         return null;
    //     }
    // }

    // async findBySemesterLabelOfUser(id: string, condition: any, type: "SV" | "GV"): Promise<Lop[]> {
    //     const today = moment(Date.now())
    //         .startOf("days")
    //         .valueOf();
    //     if (ObjectTool.isNullOrUndefined(condition?.maKyHoc)) {
    //         condition.maKyHoc = await this.TKBTool.getCurrentSemesterLabel();
    //     }
    //     Object.assign(condition, type === "SV" ? { "danhSachSinhVien.maSv": id } : { "danhSachGiangVien.maGv": id });
    //     return this.lopModel
    //         .find(condition)
    //         .select("-danhSachSinhVien")
    //         .populate("monHoc", "-__v -updatedAt -createdAt")
    //         .populate("kyHoc")
    //         .populate("danhSachGiangVien.giangVien", "username hoTen maSv anhDaiDien userChatId")
    //         .exec()
    //         .then(data =>
    //             Promise.map(data, lop => {
    //                 return this.assignToday(lop, today);
    //             }),
    //         );
    // }

    // async getMyMonAndGiaoVien(maSv: string, maKyHoc?: string): Promise<object> {
    //     if (!maKyHoc) {
    //         maKyHoc = await this.TKBTool.getCurrentSemesterLabel();
    //     }
    //     const lopList: LopDocument[] = await this.lopModel
    //         .find({ "danhSachSinhVien.maSv": maSv, maKyHoc })
    //         .select("-danhSachSinhVien")
    //         .populate("monHoc", "-__v -updatedAt -createdAt")
    //         .populate("danhSachGiangVien.giangVien", "username hoTen maSv anhDaiDien userChatId")
    //         .map(res => Promise.map(res, lop => this.TKBTool.transformOldLopInterface(lop).then(oldLop => oldLop.toJSON())));
    //     const temp1: string[] = [];
    //     let temp2: string[] = [];
    //     for (const lop of lopList) {
    //         temp1.push(String(lop.monHoc._id));
    //         const temp3: string[] = lop.giaoVien.map((gv: any) => String(gv._id));
    //         temp2 = [...temp2, ...temp3];
    //     }
    //     temp1.sort();
    //     temp2.sort();
    //     const danhSachMonHoc: string[] = [];
    //     const danhSachGiaoVien: string[] = [];
    //     const l1 = temp1.length;
    //     for (let i = 0; i < l1; i++) {
    //         if (i === 0 || temp1[i] !== temp1[i - 1]) {
    //             danhSachMonHoc.push(temp1[i]);
    //         }
    //     }
    //     const l2 = temp2.length;
    //     for (let i = 0; i < l2; i++) {
    //         if (i === 0 || temp2[i] !== temp2[i - 1]) {
    //             danhSachGiaoVien.push(temp2[i]);
    //         }
    //     }
    //     return { danhSachMonHoc, danhSachGiaoVien };
    // }

    // async getLichHocByMaSvMaHocKyFromTo(
    //     maSv: string,
    //     maKyHoc: string,
    //     fromTimestamp: number,
    //     toTimestamp: number,
    //     type: "SV" | "GV",
    // ): Promise<Lop[]> {
    //     const filters =
    //         type === "SV" ? { "danhSachSinhVien.maSv": maSv, maKyHoc } : { "danhSachGiangVien.maGv": maSv, maKyHoc };
    //     const today = moment()
    //         .startOf("days")
    //         .valueOf();
    //     const firstWeekDate = await this.TKBTool.getFirstWeekDate(maKyHoc);
    //     return (
    //         this.lopModel
    //             .find(filters)
    //             .populate("monHoc", "-__v -updatedAt -createdAt")
    //             .populate("kyHoc")
    //             // .populate("giaoVien", "username hoTen maSv anhDaiDien")
    //             .exec()
    //             .then(async data => {
    //                 const dataLength = data.length;
    //                 for (let it1 = 0; it1 < dataLength; ++it1) {
    //                     const lop = data[it1];
    //                     lop.lichHoc = await Promise.map(
    //                         lop.lichHoc,
    //                         async lichHoc => {
    //                             // tslint:disable-next-line: prefer-const
    //                             let newTuanHoc: number[] = [];
    //                             await Promise.map(lichHoc.tuanHoc, async tuanHoc => {
    //                                 const date = await this.TKBTool.getTKBDate(tuanHoc, lichHoc.thuHoc, null, firstWeekDate);
    //                                 // console.log(tuanHoc);
    //                                 if (date >= fromTimestamp && date <= toTimestamp) {
    //                                     newTuanHoc.push(tuanHoc);
    //                                 }
    //                             });
    //                             lichHoc.tuanHoc = newTuanHoc;
    //                             return lichHoc;
    //                         },
    //                         { concurrency: 4 },
    //                     );

    //                     lop.lichHoc = lop.lichHoc.filter(lichHoc => {
    //                         console.log(lichHoc);
    //                         return lichHoc.tuanHoc.length > 0;
    //                     });
    //                 }
    //                 return Promise.map(data, lop => this.assignToday(lop, today), { concurrency: 4 });
    //             })
    //     );
    // }

    async getListGiaoVienAndHocSinhTheoLop(id: string) {
        const result: LopDocument = await this.lopModel.findOne({ _id: id })
            .populate("monHoc", "-__v -updatedAt -createdAt")
            .populate("kyHoc")
            .select("-lichHoc")
            .populate({
                path: "danhSachSinhVien.sinhVien",
                select: "username hoTen maSv anhDaiDien",
            })
            .populate({
                path: "danhSachGiangVien.giangVien",
                select: "username hoTen maSv anhDaiDien",
            });
        return result;
    }

    async teacherJoinClass(maLopHoc: string, danhSachGiangVien: string[]) {
        const lop = await this.lopModel.findOne({ maLopHoc });
        if (!lop) {
            throw new NotFoundException(HttpStatus.NOT_FOUND, "Không tìm thấy lớp");
        }
        for (const maGv of danhSachGiangVien) {
            if (lop.danhSachGiangVien.findIndex(gv => gv.maGv === maGv) === -1) {
                lop.danhSachGiangVien.push({ maGv });
            }
        }
        await lop.save();
        return { success: true };
    }

    async teacherLeaveClass(maLopHoc: string, danhSachGiangVien: string[]) {
        const lop = await this.lopModel.findOne({ maLopHoc });
        if (!lop) {
            throw new NotFoundException(HttpStatus.NOT_FOUND, "Không tìm thấy lớp");
        }
        lop.danhSachGiangVien = lop.danhSachGiangVien.filter(gv => !danhSachGiangVien.includes(gv.maGv));
        await lop.save();
        return { success: true };
    }

    async adminAddStudentsToClass(maLopHoc: string, danhSachSinhVien: string[]) {
        const lop = await this.lopModel.findOne({ maLopHoc });
        if (!lop) {
            throw new NotFoundException(HttpStatus.NOT_FOUND, "Không tìm thấy lớp");
        }
        for (const maSv of danhSachSinhVien) {
            if (lop.danhSachSinhVien.findIndex(sv => sv.maSv === maSv) === -1) {
                lop.danhSachSinhVien.push({ maSv });
            }
        }
        lop.sySo += 1;
        await lop.save();
        return { success: true };
    }

    async adminRemoveStudentsFromClass(maLopHoc: string, danhSachSinhVien: string[]) {
        const lop = await this.lopModel.findOne({ maLopHoc });
        if (!lop) {
            throw new NotFoundException(HttpStatus.NOT_FOUND, "Không tìm thấy lớp");
        }
        lop.danhSachSinhVien = lop.danhSachSinhVien.filter(sv => !danhSachSinhVien.includes(sv.maSv));
        lop.sySo -= 1;
        await lop.save();
        return { success: true };
    }

    async createLop(lop: CreateLopDTO): Promise<Lop> {
        return this.lopModel.create(lop);
    }

    // async importSinhVienAccount(file: Express.Multer.File) {
    //     const url = UploadTool.getURL(EUploadFolder.DATA, file.filename);
    //     const path = UploadTool.getPath(url);
    //     try {
    //         const workbook = xlsx.readFile(path);
    //         UploadTool.removeFileURL(url);
    //         const insertData: { [maSv: string]: User } = {};
    //         const data: Array<{
    //             MaSV: string;
    //             HoDem: string;
    //             Ten: string;
    //             MaLopHanhChinh: string;
    //             MaNganh: string;
    //             MaKhoa: string;
    //         }> = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    //         for (const sinhVien of data) {
    //             if (!(sinhVien.MaSV in insertData)) {
    //                 insertData[sinhVien.MaSV] = {
    //                     maSv: sinhVien.MaSV,
    //                     username: sinhVien.MaSV,
    //                     password: DEFAULT_USER_PASSWORD,
    //                     ten: sinhVien.Ten,
    //                     hoDem: sinhVien.HoDem,
    //                     hoTen: `${sinhVien.HoDem} ${sinhVien.Ten}`,
    //                     maLopHanhChinh: sinhVien.MaLopHanhChinh,
    //                     maNganh: sinhVien.MaNganh,
    //                     maKhoa: sinhVien.MaKhoa,
    //                     vaiTro: 0,
    //                 } as User;
    //             }
    //         }
    //         return Promise.map(
    //             Object.values(insertData),
    //             async sinhVien => {
    //                 const systemInfo: SystemInfo = {
    //                     indentityValidate: true,
    //                     emailValidate: true,
    //                     thirdPartyAuth: false,
    //                 };
    //                 try {
    //                     await this.userService.create(sinhVien, undefined, systemInfo);
    //                     return {
    //                         data: { maSv: sinhVien.maSv },
    //                         success: true,
    //                     };
    //                 } catch (err) {
    //                     return {
    //                         data: { maSv: sinhVien.maSv },
    //                         success: false,
    //                         message: err.code === 11000 ? "Student account existed" : err.message,
    //                     };
    //                 }
    //             },
    //             { concurrency: DEFAULT_CONCURRENCY_LOW },
    //         );
    //     } catch (err) {
    //         UploadTool.removeFileURL(url);
    //         return {
    //             success: false,
    //             message: err.message,
    //         };
    //     }
    // }

    // async importSinhVienIntoLop(file: Express.Multer.File): Promise<any> {
    //     const url = UploadTool.getURL(EUploadFolder.DATA, file.filename);
    //     const path = UploadTool.getPath(url);
    //     try {
    //         const workbook = xlsx.readFile(path);
    //         UploadTool.removeFileURL(url);
    //         const insertData: { [maLopHoc: string]: string[] } = {};
    //         const data: Array<{
    //             NhomTo: string;
    //             MaSV: string;
    //             HoDem: string;
    //             Ten: string;
    //             MaLopHanhChinh: string;
    //             MaNganh: string;
    //             MaKhoa: string;
    //         }> = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    //         for (const sinhVien of data) {
    //             const maLopHoc = sinhVien.NhomTo;
    //             if (!(maLopHoc in insertData)) {
    //                 insertData[maLopHoc] = [];
    //             }
    //             insertData[maLopHoc].push(sinhVien.MaSV);
    //         }
    //         return Promise.map(
    //             Object.entries(insertData),
    //             async entry => {
    //                 return this.adminAddStudentsToClass(entry[0], entry[1]).catch(err => {
    //                     console.error(err);
    //                     return null;
    //                 });
    //             },
    //             { concurrency: DEFAULT_CONCURRENCY_LOW },
    //         ).then(tempArr => {
    //             const result: CommonResponseDTO[] = [];
    //             tempArr.forEach(temp => {
    //                 result.push(...temp);
    //             });
    //             return result;
    //         });
    //     } catch (err) {
    //         UploadTool.removeFileURL(url);
    //         return {
    //             success: false,
    //             message: err.message,
    //         };
    //     }
    // }

    async exportLop() {
        const listLop = await this.lopModel
            .find()
            .populate("danhSachGiangVien.giangVien")
            .lean();
        return ExportTool.exportExcel(listLop, "Lop");
    }

    async getDanhSachLopByMaGiangVien(maGiangVien: string, maKyHoc: string): Promise<any> {
        // if (!maKyHoc) {
        //     maKyHoc = await this.TKBTool.getCurrentSemesterLabel();
        // }
        const filter = {};
        Object.assign(filter, {
            "danhSachGiangVien.maGv": maGiangVien,
            maKyHoc,
        });
        const data = await this.lopModel
            .find(filter)
            .select("-danhSachSinhVien");
        const total = await this.lopModel.count(filter);
        return {
            data,
            total,
        };
    }

    async getListGiangVienByLop(maLopHoc: string): Promise<any> {
        const lop = await this.lopModel.findOne({ maLopHoc }).select("danhSachGiangVien.maGv");
        const result = lop.danhSachGiangVien.map(gv => {
            return gv.maGv;
        });
        return result;
    }
}
