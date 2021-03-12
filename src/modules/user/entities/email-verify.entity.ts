import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";

@Schema()
export class EmailVerify {
    @IsString()
    @Prop({ required: true })
    token: string;

    @IsDateString()
    @Prop({ required: true })
    createdAt: Date;

    @IsDateString()
    @Prop({ required: true })
    expiredAt: Date;

    @IsDateString()
    @Prop({ required: true })
    verifiedAt: Date;

    @IsBoolean()
    @IsOptional()
    @Prop()
    verified?: boolean;
}

export const EmailVerifySchema = SchemaFactory.createForClass(EmailVerify);
