import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";

@Schema()
export class PasswordReset {
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
    resetAt: Date;

    @IsBoolean()
    @IsOptional()
    @Prop()
    reset?: boolean;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);