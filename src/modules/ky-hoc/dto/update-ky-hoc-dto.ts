import { PartialType } from "@nestjs/swagger";
import { CreateKyHocDTO } from "./create-ky-hoc.dto";

export class UpdateKyHocDTO extends PartialType(CreateKyHocDTO) {}
