import { DB_PROFILE } from "./../../repository/db-collection";
import { AccessibleFieldsDocument } from "@casl/mongoose";
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsString, ValidateNested } from "class-validator";
import { Document } from "mongoose";
import { DB_USER } from "../../repository/db-collection";
import { SystemRole } from "../common/user.constant";
import { AuthorizationVersion, AuthorizationVersionSchema } from "./authorization-version.entity";
import { EmailVerify, EmailVerifySchema } from "./email-verify.entity";
import { IdentifiedDeviceInfo, IdentifiedDeviceInfoSchema } from "./identified-device-info.entity";
import { PasswordReset, PasswordResetSchema } from "./password-reset.entity";

@Schema({
    toJSON: { virtuals: true },
    collection: DB_USER,
    timestamps: true,
})
export class User {
    /**
     * @example username
     */
    @IsString()
    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    username: string;

    /**
     * @example password
     */
    @IsString()
    @Prop({ required: true })
    password: string;

    /**
     * @example "example@domain.co"
     */
    @IsEmail()
    @Prop({ trim: true, lowercase: true })
    email: string;

    @ValidateNested()
    @Type(() => AuthorizationVersion)
    @Prop(raw({ type: AuthorizationVersionSchema, default: () => ({}) }))
    authorizationVersion: AuthorizationVersion;

    @ValidateNested()
    @Type(() => PasswordReset)
    @Prop(raw(PasswordResetSchema))
    passwordReset?: PasswordReset;

    @ValidateNested()
    @Type(() => EmailVerify)
    @Prop(raw(EmailVerifySchema))
    emailVerify?: EmailVerify;

    @IsEnum(SystemRole, { each: true })
    @Prop({ type: [String], enum: Object.values(SystemRole), required: true })
    systemRoles: SystemRole[];

    @ValidateNested()
    @Type(() => IdentifiedDeviceInfo)
    @Prop(raw(IdentifiedDeviceInfoSchema))
    identifiedDeviceInfo?: IdentifiedDeviceInfo;

    clientDeviceId: string;
    clientPlatform: string;
    jti: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function save() {
    if (this.isModified("password")) {
        const password = String(this.get("password"));
        this.set("password", password ? await bcrypt.hash(password, 10) : undefined);
    }
    const authorizationProps: string[] = [
        "password",
        "email",
        "systemRoles",
    ].filter(prop => this.isModified(prop));
    if (authorizationProps.length > 0) {
        this
            .updateOne({
                $inc: { "authorizationVersion.version": 1 },
                $set: {
                    "authorizationVersion.updatedAt": new Date(),
                    "authorizationVersion.props": authorizationProps,
                },
            })
            .exec()
            .catch(() => { return; });
    }
});

UserSchema.methods.comparePassword = function comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, (this as Document).get("password"));
};

export interface UserDocument extends User, AccessibleFieldsDocument {
    comparePassword: (password: string) => Promise<boolean>;
}

UserSchema.virtual("profile", {
    ref: DB_PROFILE,
    localField: "username",
    foreignField: "username",
    justOne: true,
});