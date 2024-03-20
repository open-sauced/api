import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

import { UrlShortenerService } from "./url-shortener.service";

describe("UrlShortenerService", () => {
  let service: UrlShortenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlShortenerService, ConfigService],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should throw an error for an invalid URL", async () => {
    let error;
    try {
      await service.shortenUrl("https://opensauces.pizza");
    } catch (e) {
      error = e;
      console.log(e);
    }

    expect(error).toBeDefined();
  });
});
