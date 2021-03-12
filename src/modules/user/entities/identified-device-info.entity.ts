import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";

@Schema()
export class IdentifiedDeviceInfo {
    @IsString()
    @Prop({ required: true, unique: true, sparse: true })
    deviceId: string;

    @Prop({ required: true })
    identifiedAt: Date;
}

export const IdentifiedDeviceInfoSchema = SchemaFactory.createForClass(IdentifiedDeviceInfo);