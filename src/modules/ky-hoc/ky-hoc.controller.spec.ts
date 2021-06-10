import { Test, TestingModule } from "@nestjs/testing";
import { KyHocController } from "./ky-hoc.controller";

describe("KyHoc Controller", () => {
    let controller: KyHocController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [KyHocController],
        }).compile();

        controller = module.get<KyHocController>(KyHocController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
