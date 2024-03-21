import { Module } from "@nestjs/common";
import { UrlShortenerController } from "./url-shortener.controller";
import { UrlShortenerService } from "./url-shortener.service";

@Module({
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
})
export class UrlModule {}
