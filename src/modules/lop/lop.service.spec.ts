import { Test, TestingModule } from "@nestjs/testing";
import { LopService } from "./lop.service";

describe("LopService", () => {
    let service: LopService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LopService],
        }).compile();

        service = module.get<LopService>(LopService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
