import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import * as mongoose from "mongoose";
import { DB_SETTING } from "../../repository/db-collection";
import { SettingValueType } from "../common/setting.constant";
import { SettingKey } from "./../common/setting.constant";

@Schema({
    collection: DB_SETTING,
    timestamps: true,
})

export class Setting {
    @IsEnum(SettingKey)
    @Prop({ required: true, unique: true, type: String, enum: Object.values(SettingKey) })
    key: SettingKey;

    @IsNotEmpty()
    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    value: any;

    @IsEnum(SettingValueType)
    @Prop({ type: String, enum: Object.values(SettingValueType) })
    @IsOptional()
    type?: SettingValueType;

    @IsString()
    @Prop()
    @IsOptional()
    name?: string;

    @IsString()
    @Prop()
    @IsOptional()
    description?: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
export interface SettingDocument extends Setting, mongoose.Document { }