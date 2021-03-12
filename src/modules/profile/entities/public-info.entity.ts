import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum } from "class-validator";
import { Document } from "mongoose";
import { PublicInfoScope } from "../common/profile.constant";

@Schema()
export class PublicInfo {
    @IsEnum(PublicInfoScope)
    @Prop({ type: String, enum: Object.values(PublicInfoScope), default: PublicInfoScope.PRIVATE })
    dateOfBirth: PublicInfoScope;

    @IsEnum(PublicInfoScope)
    @Prop({ type: String, enum: Object.values(PublicInfoScope), default: PublicInfoScope.PRIVATE })
    gender: PublicInfoScope;

    @IsEnum(PublicInfoScope)
    @Prop({ type: String, enum: Object.values(PublicInfoScope), default: PublicInfoScope.PRIVATE })
    phoneNumber: PublicInfoScope;

    @IsEnum(PublicInfoScope)
    @Prop({ type: String, enum: Object.values(PublicInfoScope), default: PublicInfoScope.PRIVATE })
    address: PublicInfoScope;
}

export const PublicInfoSchema = SchemaFactory.createForClass(PublicInfo);
export interface PublicInfoSchemaDocument extends PublicInfo, Document { }