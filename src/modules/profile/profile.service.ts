import { AccessibleModel } from "@casl/mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageableDto } from "../../common/dto/pageable.dto";
import { FetchQueryOption } from "../../common/pipe/fetch-query-option.interface";
import { DB_PROFILE } from "../repository/db-collection";
import { SystemRole } from "../user/common/user.constant";
import { UserDocument } from "../user/entities/user.entity";
import { ProfileAbitityFactory } from "./common/profile.ability";
import { PublicInfoScope } from "./common/profile.constant";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfilePageableDto } from "./dto/profile-pageable.dto";
import { UserUpdateProfileDto } from "./dto/user-update-profile.dto";
import { ProfileDocument } from "./entities/profile.entity";
import { PublicInfo } from "./entities/public-info.entity";

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(DB_PROFILE)
        private readonly profileModel: AccessibleModel<ProfileDocument>,
        private readonly profileAbilityFactory: ProfileAbitityFactory,
    ) { }

    private isFobbidenProp(profile: ProfileDocument, prop: string): boolean {
        // TODO: Implement FRIEND scope
        return profile.get(`publicInfo.${prop}`) !== PublicInfoScope.PUBLIC;
    }

    private async userGetPublicProfile(user: UserDocument, profile: ProfileDocument) {
        if (user.systemRoles.includes(SystemRole.ADMIN)) {
            return profile;
        } else if (user.systemRoles.includes(SystemRole.USER)) {
            const info: PublicInfo = {
                address: PublicInfoScope.PUBLIC,
                dateOfBirth: PublicInfoScope.PUBLIC,
                gender: PublicInfoScope.PUBLIC,
                phoneNumber: PublicInfoScope.PUBLIC,
            };
            Object.keys(info)
                .filter(prop => this.isFobbidenProp(profile, prop))
                .forEach(fobbidenProp => {
                    profile.set(fobbidenProp, undefined);
                });
            return profile;
        } else {
            return null;
        }
    }

    create(createProfileDto: CreateProfileDto) {
        return this.profileModel.create(createProfileDto);
    }

    async findPageable(conditions: any, option: FetchQueryOption): Promise<ProfilePageableDto> {
        const total = this.profileModel.countDocuments(conditions);
        const result = this.profileModel.find(conditions).setOptions(option);
        return Promise.all([total, result]).then(p => PageableDto.create(option, p[0], p[1]));
    }

    async findAll(query: FetchQueryOption) {
        return this.profileModel.find().setOptions(query);
    }

    async userFindById(user: UserDocument, id: string) {
        const profile = await this.profileModel.findById(id);
        return this.userGetPublicProfile(user, profile);
    }

    async userUpdate(
        user: UserDocument,
        updateProfileDto: UserUpdateProfileDto,
    ) {
        return this.profileModel.findOneAndUpdate(
            { username: user.username },
            { $set: updateProfileDto },
            { runValidators: true, upsert: true },
        );
    }

    async findByUsername(username: string) {
        return this.profileModel.findOne({ username });
    }

    async deleteById(id: string) {
        return this.profileModel.findByIdAndDelete(id);
    }
}
