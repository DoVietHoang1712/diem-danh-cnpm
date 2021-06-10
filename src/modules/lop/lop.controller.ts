import { ResponseDto } from './../../common/dto/response/response.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Model } from "mongoose";
import { Authorization, SystemRoles } from "../../common/decorator/auth.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { SystemRole } from "../user/common/user.constant";
import { User } from "../user/entities/user.entity";
import { CreateLopDTO } from "./dto/create-lop.dto";
import { DeleteIdManyDTO } from "./dto/delete-id-many.dto";
import { EditInfoLopDTO } from "./dto/edit-info-lop.dto";
import { ImportXlsxDTO } from "./dto/import-xlsx.dto";
import { InsertDataLopDTO } from "./dto/insert-data-lop.dto";
import { Lop } from "./lop.schema";
import { LopService } from "./lop.service";

@Controller("sotay/lop")
@ApiTags("Lop")
@Authorization()
export class LopController {
    constructor(
        private readonly lopService: LopService,
    ) { }

    @Get("/hoc-ky/giang-day")
    @SystemRoles(SystemRole.GIANG_VIEN)
    async getKyHocCoLop(@ReqUser() user: User) {
        const data = await this.lopService.getKyHocGanNhat(user.maSv);
        return data;
    }

    @Get("giang-vien/search/available-class/current")
    @SystemRoles(SystemRole.GIANG_VIEN, SystemRole.ADMIN, SystemRole.SINH_VIEN)
    async searchCurrentAvailableClass(@Req() req: Request, @Query("maKyHoc") maKyHoc: string) {
        const maGv = (req.user as User).maSv;
        const data = await this.lopService.searchCurrentAvailableClass(maGv, maKyHoc);
        return data;
    }

    @Get("getListGiaoVienAndHocSinhTheoLop/:id")
    async getListGiaoVienAndHocSinhTheoLop(@Param("id") id: string) {
        const result = await this.lopService.getListGiaoVienAndHocSinhTheoLop(id);
        return result;
    }

    @Get("export/xlsx")
    async exportLop() {
        const result = await this.lopService.exportLop();
        return result;
    }

    @Post()
    @SystemRoles(SystemRole.ADMIN, SystemRole.ADMIN)
    @ApiBody({ type: CreateLopDTO })
    async create(@Body() lop: CreateLopDTO) {
        const data = await this.lopService.createLop(lop);
        return data;
    }



    @Put("giang-vien/join-class/:maLopHoc")
    @SystemRoles(SystemRole.GIANG_VIEN)
    async teacherJoinClass(@Req() req: Request, @Param("maLopHoc") maLopHoc: string) {
        const maGv = (req.user as User).maSv;
        const data = await this.lopService.teacherJoinClass(maLopHoc, [maGv]);
        return data;
    }

    @Put("giang-vien/leave/:maLopHoc")
    @SystemRoles(SystemRole.GIANG_VIEN)
    async teacherLeaveClass(@Req() req: Request, @Param("maLopHoc") maLopHoc: string) {
        const maSv = (req.user as User).maSv;
        const data = await this.lopService.teacherLeaveClass(maLopHoc, [maSv]);
        return data;
    }

    @Put(":maLopHoc/add/giang-vien")
    @SystemRoles(SystemRole.ADMIN)
    @ApiBody({ type: [String] })
    async adminAddTeachersToClass(@Param("maLopHoc") maLopHoc: string, @Body() danhSachGiangVien: string[]) {
        const data = await this.lopService.teacherJoinClass(maLopHoc, danhSachGiangVien);
        return data;
    }

    @Put(":maLopHoc/remove/giang-vien")
    @SystemRoles(SystemRole.ADMIN)
    @ApiBody({ type: [String] })
    async adminRemoveTeachersFromClass(@Param("maLopHoc") maLopHoc: string, @Body() danhSachGiangVien: string[]) {
        const data = await this.lopService.teacherLeaveClass(maLopHoc, danhSachGiangVien);
        return data;
    }



    @Put(":maLopHoc/add/sinh-vien")
    @SystemRoles(SystemRole.ADMIN)
    @ApiBody({ type: [String] })
    async adminAddStudensToClass(@Param("maLopHoc") maLopHoc: string, @Body() danhSachSinhVien: string[]) {
        const data = await this.lopService.adminAddStudentsToClass(maLopHoc, danhSachSinhVien);
        return data;
    }

    @Put(":maLopHoc/remove/sinh-vien")
    @SystemRoles(SystemRole.ADMIN)
    @ApiBody({ type: [String] })
    async adminRemoveStudensFromClass(@Param("maLopHoc") maLopHoc: string, @Body() danhSachSinhVien: string[]) {
        const data = await this.lopService.adminRemoveStudentsFromClass(maLopHoc, danhSachSinhVien);
        return data;
    }

    @Get(":id")
    @SystemRoles(SystemRole.ADMIN, SystemRole.GIANG_VIEN, SystemRole.SINH_VIEN)
    @ApiOkResponse({ type: Lop })
    async findById(@Param("id") id: string) {
        const data = await this.lopService.findById(id);
        return data;
    }

    @Get("ma-giang-vien/:maGiangVien")
    @SystemRoles(SystemRole.ADMIN, SystemRole.GIANG_VIEN)
    @ApiQuery({ name: "maKyHoc", required: false })
    async getDanhSachLopByMaGiangVien(
        @Param("maGiangVien") maGiangVien: string,
        @Query("maKyHoc") maKyHoc: string,
    ) {
        const data = await this.lopService.getDanhSachLopByMaGiangVien(maGiangVien, maKyHoc);
        return data;
    }
}
