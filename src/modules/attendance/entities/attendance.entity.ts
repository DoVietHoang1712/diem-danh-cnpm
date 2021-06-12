import { DB_PROFILE } from "./../../repository/db-collection";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { DB_ATTENDANCE, DB_USER } from "../../repository/db-collection";
import { PeriodOfTime } from "../../setting/common/setting.constant";
import { AttendanceResult, AttendanceType } from "../common/attendance.constant";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
@Schema({
    toJSON: { virtuals: true },
    collection: DB_ATTENDANCE,
    timestamps: true,
})

export class Attendance {
    @Prop({ required: true })
    @IsString()
    username: string;

    @Prop({ required: true })
    @IsString()
    deviceId: string;

    @Prop({ required: true })
    @IsNotEmpty()
    date: number;

    @Prop({ required: true })
    @IsNotEmpty()
    month: number;

    @Prop({ required: true })
    @IsNotEmpty()
    year: number;

    @Prop()
    @IsString()
    maLopHoc: string;

    @Prop()
    @IsString()
    maMonHoc: string;

    @Prop({ default: () => Date.now() })
    @IsOptional()
    registerAt: Date;

    @Prop({ maxlength: 5, required: true })
    @IsOptional()
    studyFrom: string;

    @Prop({ maxlength: 5, required: true })
    @IsOptional()
    studyTo: string;

    @Prop({ enum: Object.values(PeriodOfTime), required: true })
    @IsOptional()
    periodOfTime: PeriodOfTime;

    @Prop({ enum: Object.values(AttendanceResult) })
    @IsOptional()
    inResult?: AttendanceResult;

    @Prop()
    @IsOptional()
    studyDuration?: number;

    @Prop({ enum: Object.values(AttendanceType), required: true })
    @IsOptional()
    type: AttendanceType;

    createdAt?: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
export interface AttendanceDocument extends Attendance, Document { }

AttendanceSchema.virtual("profile", {
    ref: DB_PROFILE,
    localField: "username",
    foreignField: "username",
    justOne: true,
});