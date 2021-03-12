import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiPageableListQuery, FetchPageableQuery } from "../../common/decorator/api.decorator";
import { Authorization, SystemRoles } from "../../common/decorator/auth.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { ResponseDto } from "../../common/dto/response/response.dto";
import { FetchQueryOption } from "../../common/pipe/fetch-query-option.interface";
import { SystemRole } from "../user/common/user.constant";
import { UserDocument } from "../user/entities/user.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfilePageableResponseDto } from "./dto/profile-pageable-response.dto";
import { ProfileResponseDto } from "./dto/profile-response.dto";
import { UserUpdateProfileDto } from "./dto/user-update-profile.dto";
import { ProfileService } from "./profile.service";

@Controller("profile")
@ApiTags("profile")
@Authorization()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post()
    async create(@Body() createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
        const data = await this.profileService.create(createProfileDto);
        return ResponseDto.response(data);
    }

    @Get("pageable")
    @SystemRoles(SystemRole.ADMIN)
    @ApiPageableListQuery()
    async findPageable(
        @FetchPageableQuery() option: FetchQueryOption,
    ): Promise<ProfilePageableResponseDto> {
        const conditions: any = {};
        const data = await this.profileService.findPageable(conditions, option);
        return ResponseDto.response(data);
    }

    @Get("me")
    async findMe(
        @ReqUser() user: UserDocument,
    ): Promise<ProfileResponseDto> {
        const data = await this.profileService.findByUsername(user.username);
        return ResponseDto.response(data);
    }

    @Put("me")
    async updateMe(
        @ReqUser() user: UserDocument,
        @Body() updateProfileDto: UserUpdateProfileDto,
    ): Promise<ProfileResponseDto> {
        const data = await this.profileService.userUpdate(user, updateProfileDto);
        return ResponseDto.response(data);
    }

    @Get(":id")
    @SystemRoles(SystemRole.ADMIN)
    async findById(
        @ReqUser() user: UserDocument,
        @Param("id") id: string,
    ): Promise<ProfileResponseDto> {
        const data = await this.profileService.userFindById(user, id);
        return ResponseDto.response(data);
    }

    @Delete(":id")
    @SystemRoles(SystemRole.ADMIN)
    async deleteById(@Param("id") id: string) {
        await this.profileService.deleteById(id);
    }
}
