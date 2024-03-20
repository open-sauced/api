import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UrlShortenerService {
  private readonly dubApiHost = this.configService.get<string>("dub.apiHost");
  private readonly dubApiKey = this.configService.get<string>("dub.apiKey");
  private readonly workspaceId = this.configService.get<string>("dub.workspaceId");
  private readonly domain = this.configService.get<string>("dub.domain");

  constructor(private configService: ConfigService) {}

  async shortenUrl(url: string) {
    try {
      const urlToValidate = new URL(url);

      if (
        !urlToValidate.host.endsWith("opensauced.pizza") &&
        !urlToValidate.host.endsWith("oss-insights.netlify.app")
      ) {
        throw new BadRequestException("Invalid URL");
      }

      const response = await fetch(`${this.dubApiHost}/links?workspaceId=${this.workspaceId}&search=${url}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.dubApiKey}`,
        },
      });

      if (response.ok) {
        const results = (await response.json()) as { shortLink: string }[];

        if (results.length > 0) {
          return { shortUrl: results[0].shortLink };
        }

        return this.createShortLink(url);
      }
    } catch (e) {
      throw new BadRequestException(`Unable to shorten URL ${e}`);
    }
  }

  async createShortLink(url: string) {
    const response = await fetch(`${this.dubApiHost}/links?workspaceId=${this.workspaceId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.dubApiKey}`,
      },
      body: JSON.stringify({ url, domain: this.domain }),
    });

    if (response.ok) {
      const data = (await response.json()) as { shortLink: string };

      return { shortUrl: data.shortLink };
    }

    throw new BadRequestException("Unable to shorten URL");
  }
}
