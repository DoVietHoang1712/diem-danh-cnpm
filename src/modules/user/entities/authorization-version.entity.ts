import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class AuthorizationVersion {
    @Prop({ required: true, default: 0 })
    version: number;
    @Prop()
    updateAt?: Date;
    @Prop([String])
    props?: string[];
}

export const AuthorizationVersionSchema = SchemaFactory.createForClass(AuthorizationVersion);