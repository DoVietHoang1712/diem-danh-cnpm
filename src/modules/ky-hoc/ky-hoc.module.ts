import { Module } from "@nestjs/common";
import { KyHocService } from "./ky-hoc.service";
import { KyHocController } from "./ky-hoc.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { KyHocSchema } from "./ky-hoc.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "KyHoc", schema: KyHocSchema },
        ]),
    ],
    providers: [KyHocService],
    controllers: [KyHocController],
    exports: [KyHocService],
})
export class KyHocModule { }
