import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UrlShortenerService } from "./url-shortener.service";
import { UrlShortenerDto } from "./dtos/url.dto";

@Controller("url/shorten")
@ApiTags("Url Shortener Service")
export class UrlShortenerController {
  constructor(private urlShortener: UrlShortenerService) {}

  @Get()
  async shortenUrl(@Query() options: UrlShortenerDto) {
    return this.urlShortener.shortenUrl(options.url);
  }
}
