import { DB_USER } from './../repository/db-collection';
import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongodb";
import { Document, Schema } from "mongoose";
import { KyHoc } from "../ky-hoc/ky-hoc.schema";
import { EHeDaoTao } from "./constants/lop.constant";
import { User } from '../user/entities/user.entity';

export const LOP_MODEL = "Lop";

export const LopSchema = new Schema(
    {
        historyId: Schema.Types.ObjectId,
        original: {
            type: Boolean,
            default: true,
        },
        tenLopHoc: {
            type: String,
            required: true,
        },
        nhomTo: String,
        toTH: String,
        maLopHoc: {
            type: String,
            unique: true,
        },
        maMonHoc: {
            type: String,
            index: true,
        },
        tenMonHoc: String,
        sySo: {
            type: Number,
            default: 0,
        },
        danhSachSinhVien: [
            {
                _id: false,
                maSv: {
                    type: String,
                    required: true,
                },
                diemChuyenCan: {
                    type: Number,
                    required: false,
                },
                diemKiemTra: {
                    type: Number,
                    required: false,
                },
                diemThucHanh: {
                    type: Number,
                    required: false,
                },
                diemBaiTap: {
                    type: Number,
                    required: false,
                },
            },
        ],
        danhSachGiangVien: [
            {
                _id: false,
                maGv: {
                    type: String,
                    required: true,
                },
                soTiet: {
                    type: Number,
                    default: 0,
                },
                soTietNgoaiGio: {
                    type: Number,
                    default: 0,
                },
                soTietT7CN: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        maKyHoc: {
            type: String,
            index: true,
        },
        lichHoc: [
            {
                _id: false,
                tuanHoc: [
                    {
                        type: Number,
                    },
                ],
                tenToHop: Number,
                thuHoc: Number,
                phongHoc: String,
                thoiGianBatDau: String,
                thoiGianKetThuc: String,
                tietBatDau: Number,
                tietKetThuc: Number,
            },
        ],
        groupChatId: String,
        chuongTrinhGiangDay: String,
        //
        heDaoTao: {
            type: String,
            enum: Object.values(EHeDaoTao),
        },
        coSoDaoTao: String,
        soTietNgoaiGio: Number,
        soTietT7CN: Number,
        heSoLopDong: Number,
        hinhThucGiangDay: String,
        ngonNguGiangDay: String,
    },
    {
        timestamps: true,
        collection: LOP_MODEL,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.maKyHoc;
                // delete ret.danhSachSinhVien;
                // delete ret.danhSachGiangVien;
            },
        },
    },
);

LopSchema.index({
    maLopHoc: 1,
    "lichHoc.tuanHoc": 1,
    "lichHoc.thuHoc": 1,
    "lichHoc.tietBatDau": 1,
});

LopSchema.index({
    maKyHoc: 1,
    original: 1,
    "danhSachGiangVien.maGv": 1,
});

LopSchema.index({
    maKyHoc: 1,
    heDaoTao: 1,
});

LopSchema.virtual("monHoc", {
    ref: "MonHoc",
    localField: "maMonHoc",
    foreignField: "maMonHoc",
    justOne: true,
});

LopSchema.virtual("kyHoc", {
    ref: "KyHoc",
    localField: "maKyHoc",
    foreignField: "maKyHoc",
    justOne: true,
});

LopSchema.virtual("danhSachSinhVien.sinhVien", {
    ref: DB_USER,
    localField: "danhSachSinhVien.maSv",
    foreignField: "maSv",
    justOne: true,
});

LopSchema.virtual("danhSachGiangVien.giangVien", {
    ref: DB_USER,
    localField: "danhSachGiangVien.maGv",
    foreignField: "maSv",
    justOne: true,
});

export class LichHoc {
    @ApiProperty({ type: [String] })
    tuanHoc: number[];

    @ApiProperty()
    tenToHop?: number;

    @ApiProperty()
    thuHoc: number;

    @ApiProperty()
    phongHoc: string;

    @ApiProperty()
    thoiGianBatDau: string;

    @ApiProperty()
    thoiGianKetThuc: string;

    @ApiProperty()
    tietBatDau: number;

    @ApiProperty()
    tietKetThuc: number;
}

export class SinhVien {
    @ApiProperty()
    maSv: string;
    sinhVien?: User;
    @ApiProperty({ required: false })
    diemChuyenCan?: number;
    @ApiProperty({ required: false })
    diemKiemTra?: number;
    @ApiProperty({ required: false })
    diemThucHanh?: number;
    @ApiProperty({ required: false })
    diemBaiTap?: number;
    @ApiProperty({ required: false })
    ghiChu?: string;
}

export class GiangVien {
    @ApiProperty()
    maGv: string;

    giangVien?: User;

    @ApiProperty()
    soTiet?: number;

    @ApiProperty()
    soTietNgoaiGio?: number;

    @ApiProperty()
    soTietT7CN?: number;
}

export class Lop {
    historyId: string | ObjectId;
    @ApiProperty()
    @Prop()
    tenLopHoc: string;

    @ApiProperty()
    @Prop()
    maLopHoc: string;

    @ApiProperty()
    @Prop()
    maMonHoc: string;

    @ApiProperty()
    @Prop()
    tenMonHoc: string;

    @ApiProperty()
    nhomTo: string;

    @ApiProperty()
    toTH: string;

    original: boolean;

    @ApiProperty()
    sySo: number;

    @ApiProperty()
    monHoc: string;

    @ApiProperty({ type: [SinhVien] })
    danhSachSinhVien: SinhVien[];

    @ApiProperty({ type: [GiangVien] })
    danhSachGiangVien: GiangVien[];

    giaoVien: User[];

    sinhVien: User[];

    @ApiProperty()
    @Prop()
    maKyHoc: string;

    kyHoc: KyHoc;

    @ApiProperty()
    lichHoc: LichHoc[];

    groupChatId: string;

    today: boolean;

    //
    @ApiProperty({ enum: Object.values(EHeDaoTao) })
    heDaoTao: EHeDaoTao;

    @ApiProperty()
    coSoDaoTao: string;

    @ApiProperty()
    soTietNgoaiGio: number;

    @ApiProperty()
    soTietT7CN: number;

    @ApiProperty()
    heSoLopDong: number;

    @ApiProperty()
    hinhThucGiangDay: string;

    @ApiProperty()
    chuongTrinhGiangDay: string;

    @ApiProperty()
    ngonNguGiangDay: string;
}

export interface LopDocument extends Lop, Document { }
