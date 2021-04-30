import { TrangThaiRequestIdentity } from './../common/user.constant';
import { DB_REQUEST_IDENTITY } from './../../repository/db-collection';
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Document } from "mongoose";
import { DB_USER } from "../../repository/db-collection";
import * as mongoose from "mongoose";

@Schema({
    collection: DB_REQUEST_IDENTITY,
    timestamps: true,
    toJSON: { virtuals: true },
})

export class RequestIdentity {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: DB_USER })
    @IsNotEmpty()
    idUserRequest: string;

    @Prop({ type: String, enum: Object.values(TrangThaiRequestIdentity), default: () => TrangThaiRequestIdentity.PROCESSING })
    @IsOptional()
    trangThai?: TrangThaiRequestIdentity;
}

export const RequestIdentitySchema = SchemaFactory.createForClass(RequestIdentity);
export interface RequestIdentityDocument extends RequestIdentity, mongoose.Document { }