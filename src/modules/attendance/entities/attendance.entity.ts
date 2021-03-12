import { DB_PROFILE } from "./../../repository/db-collection";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { DB_ATTENDANCE, DB_USER } from "../../repository/db-collection";
import { PeriodOfTime } from "../../setting/common/setting.constant";
import { AttendanceResult, AttendanceType } from "../common/attendance.constant";
@Schema({
    toJSON: { virtuals: true },
    collection: DB_ATTENDANCE,
    timestamps: true,
})

export class Attendance {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    deviceId: string;

    @Prop({ required: true })
    date: string;

    @Prop({ default: () => Date.now() })
    registerAt: Date;

    @Prop({ maxlength: 5, required: true })
    workFrom: string;

    @Prop({ maxlength: 5, required: true })
    workTo: string;

    @Prop({ enum: Object.values(PeriodOfTime), required: true })
    periodOfTime: PeriodOfTime;

    @Prop({ enum: Object.values(AttendanceResult) })
    inResult?: AttendanceResult;

    @Prop()
    workDuration?: number;

    @Prop({ enum: Object.values(AttendanceType), required: true })
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