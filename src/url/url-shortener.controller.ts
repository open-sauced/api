import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { UrlShortenerService } from "./url-shortener.service";
import { UrlShortenerDto } from "./dtos/url.dto";
import { ShortURL } from "./dtos/short-url.dto";

@Controller("url/shorten")
@ApiTags("Url Shortener Service")
export class UrlShortenerController {
  constructor(private urlShortener: UrlShortenerService) {}

  @Get()
  @ApiOkResponse({ type: ShortURL })
  async shortenUrl(@Query() options: UrlShortenerDto) {
    return this.urlShortener.shortenUrl(options.url);
  }
}
