import { SystemRoles } from './../../common/decorator/auth.decorator';
import { Controller, Get, Post, Body, Put, Param } from "@nestjs/common";
import { KyHocService } from "./ky-hoc.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateKyHocDTO } from "./dto/create-ky-hoc.dto";
import { UpdateKyHocDTO } from "./dto/update-ky-hoc-dto";
import { QueryPostOption } from "src/tools/request.tool";
import { Authorization } from "../../common/decorator/auth.decorator";
import { SystemRole } from '../user/common/user.constant';

@Controller("sotay/kyhoc")
@ApiTags("Ky Hoc")
@Authorization()
export class KyHocController {
    constructor(private readonly kyHocService: KyHocService) { }

    // @Get("/current")
    // async findCurrentKyHoc() {
    //     const query: QueryPostOption = {
    //         options: {
    //             skip: 0,
    //             limit: 1,
    //             sort: {
    //                 ngayBatDau: -1,
    //             },
    //             select: {},
    //         },
    //     };
    //     const data = await this.kyHocService.getOne(query);
    //     return data;
    // }

    @Post()
    @SystemRoles(SystemRole.ADMIN)
    async create(@Body() kyHoc: CreateKyHocDTO) {
        const data = await this.kyHocService.createKyHoc(kyHoc);
        return data;
    }

    // @Put(":id")
    // @Roles(ERole.ADMIN)
    // async updatebyId(@Param("id") id: string, @Body() update: UpdateKyHocDTO): Promise<ResponseDTO> {
    //     const data = await this.kyHocService.updateById({ id, update });
    //     return ResponseTool.PUT_OK(data);
    // }

    // @Put(":id")
    // @Roles(ERole.ADMIN)
    // async deleteById(@Param("id") id: string): Promise<ResponseDTO> {
    //     const data = await this.kyHocService.deleteById(id);
    //     return ResponseTool.PUT_OK(data);
    // }
}
