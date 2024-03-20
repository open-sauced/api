import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

import { UrlShortenerController } from "./url-shortener.controller";
import { UrlShortenerService } from "./url-shortener.service";

describe("UrlShortenerController", () => {
  let controller: UrlShortenerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [UrlShortenerService, ConfigService],
    }).compile();

    controller = module.get<UrlShortenerController>(UrlShortenerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
