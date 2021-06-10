import { PartialType } from "@nestjs/swagger";
import { KyHoc } from "../ky-hoc.schema";

export class CreateKyHocDTO extends PartialType(KyHoc) {}
