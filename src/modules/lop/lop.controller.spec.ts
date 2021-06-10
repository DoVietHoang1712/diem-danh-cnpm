import { Test, TestingModule } from "@nestjs/testing";
import { LopController } from "./lop.controller";

describe("Lop Controller", () => {
    let controller: LopController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LopController],
        }).compile();

        controller = module.get<LopController>(LopController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
