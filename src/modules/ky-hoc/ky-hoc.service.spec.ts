import { Test, TestingModule } from "@nestjs/testing";
import { KyHocService } from "./ky-hoc.service";

describe("KyHocService", () => {
    let service: KyHocService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [KyHocService],
        }).compile();

        service = module.get<KyHocService>(KyHocService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
