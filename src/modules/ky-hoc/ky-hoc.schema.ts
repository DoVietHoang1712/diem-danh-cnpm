import { Schema, Document } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export const KyHocSchema = new Schema(
    {
        maKyHoc: {
            type: String,
            unique: true,
        },
        namHoc: {
            type: Number,
        },
        ky: {
            type: Number,
        },
        ngayBatDau: {
            type: Date,
        },
        soTuan: {
            type: Number,
        },
    },
    { timestamps: true, collection: "KyHoc" },
);

export class KyHoc {
    @ApiProperty()
    maKyHoc: string;
    @ApiProperty()
    namHoc: number;
    @ApiProperty()
    ky: number;
    @ApiProperty()
    ngayBatDau: Date;
    @ApiProperty()
    soTuan: number;
}

export interface KyHocDocument extends KyHoc, Document {}

export const KY_HOC_MODEL = "KyHoc";
