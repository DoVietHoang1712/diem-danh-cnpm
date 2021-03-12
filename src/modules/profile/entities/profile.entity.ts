import { AccessibleFieldsDocument } from "@casl/mongoose";
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsString, ValidateNested } from "class-validator";
import { DB_PROFILE } from "../../repository/db-collection";
import { Gender } from "../common/profile.constant";
import { PublicInfo, PublicInfoSchema } from "./public-info.entity";

@Schema({
    timestamps: true,
    collection: DB_PROFILE,
})
export class Profile {
    @IsString()
    @Prop({ unique: true })
    username: string;

    @IsString()
    @Prop()
    firstname: string;

    @IsString()
    @Prop()
    lastname: string;

    @IsDateString()
    @Prop()
    dateOfBirth: Date;

    @IsEnum(Gender)
    @Prop({ type: String, enum: Object.values(Gender) })
    gender: Gender;

    @IsString()
    @Prop()
    phoneNumber: string;

    @IsString()
    @Prop()
    avatar: string;

    @IsString()
    @Prop()
    address: string;

    @ValidateNested()
    @Type(() => PublicInfo)
    @Prop(raw(PublicInfoSchema))
    publicInfo: PublicInfo;

    // HRM Info
    @Prop()
    @IsString()
    idNumber: string;

    @Prop()
    @IsDateString()
    joinDate: Date;

    @Prop()
    @IsString()
    position: string;

    @Prop()
    @IsString()
    team: string;

    @Prop()
    @IsString()
    placeOfBirth: string;

    @Prop()
    @IsString()
    contactEmail: string;

    // @Prop(raw(BankAccountSchema))
    // @ValidateNested()
    // @Type(() => BankAccount)
    // bankAccount?: BankAccount;
    @Prop()
    @IsString()
    bankAccount: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
export interface ProfileDocument extends Profile, AccessibleFieldsDocument { }
