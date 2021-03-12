import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";

@Schema()
export class BankAccount {
    @Prop()
    @IsString()
    bankName: string;

    @Prop({ unique: true, sparse: true })
    @IsString()
    accountNumber: string;

    @Prop()
    @IsString()
    name: string;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);