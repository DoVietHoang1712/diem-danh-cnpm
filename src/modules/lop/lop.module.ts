import { UserModule } from './../user/user.module';
import { DB_USER } from './../repository/db-collection';
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LopController } from "./lop.controller";
import { LopSchema, LOP_MODEL } from "./lop.schema";
import { LopService } from "./lop.service";
import { KyHocSchema, KY_HOC_MODEL } from "../ky-hoc/ky-hoc.schema";
import { UserSchema } from '../user/entities/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LOP_MODEL, schema: LopSchema },
            { name: KY_HOC_MODEL, schema: KyHocSchema },
            { name: DB_USER, schema: UserSchema },
        ]),
        UserModule,
    ],
    providers: [LopService],
    controllers: [LopController],
    exports: [LopService],
})
export class LopModule { }
