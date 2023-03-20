import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import fastifyHelmet from "@fastify/helmet";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";
import fastifyRateLimit from "@fastify/rate-limit";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { major } from "semver";

import { AppModule } from "./app.module";
// import { name, version, license } from "../package.json";

async function bootstrap () {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { bufferLogs: true, rawBody: true },
  );
  const configService = app.get(ConfigService);
  const apiDomain = String(configService.get("api.domain"));
  const markdownDescription = `
## Swagger-UI API Documentation

This REST API can be used to create, read, update or delete data from the Open Sauced community platform.
The Swagger-UI provides useful information to get started and an overview of all available resources.
Each API route is clickable and has their own detailed description on how to use it.
The base URL for the API is [${apiDomain}](https://${apiDomain}).

[comment]: # (TODO: add bearer auth information)

## Rate limiting

Every IP address is allowed to perform 5000 requests per hour.
This is measured by saving the date of the initial request and counting all requests in the next hour.
When an IP address goes over the limit, HTTP status code 429 is returned.
The returned HTTP headers of any API request show the current rate limit status:

header | description
--- | ---
\`X-RateLimit-Limit\` | The maximum number of requests allowed per hour
\`X-RateLimit-Remaining\` | The number of requests remaining in the current rate limit window
\`X-RateLimit-Reset\` | The date and time at which the current rate limit window resets in [UTC epoch seconds](https://en.wikipedia.org/wiki/Unix_time)

[comment]: # (TODO: add pagination information)

## Common response codes

Each route shows for each method which data they expect and which they will respond when the call succeeds.
The table below shows most common response codes you can receive from our endpoints.

code | condition
--- | ---
[\`200\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) | The [\`GET\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) request was handled successfully. The response provides the requested data.
[\`201\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) | The [\`POST\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request was handled successfully. The response provides the created data.
[\`204\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) | The [\`PATCH\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) or [\`DELETE\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) request was handled successfully. The response provides no data, generally.
[\`400\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400) | The server will not process the request due to something that is perceived to be a client error. Check the provided error for mote information.
[\`401\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) | The request requires user authentication. Check the provided error for more information.
[\`403\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) | The request was valid, but the server is refusing user access. Check the provided error for more information.
[\`404\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) | The requested resource could not be found. Check the provided error for more information.
[\`429\`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) | The current API Key made too many requests in the last hour. Check [Rate limiting](#ratelimiting) for more information.

## Additional links`;

  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: String(major("1.8.0", { loose: false })),
  });

  const options = (new DocumentBuilder);

  if (configService.get("api.development")) {
    options.addServer(`http://localhost:${String(configService.get("api.port"))}`, "Development");
  }

  options
    .addServer(`https://${apiDomain}`, "Production")
    .addServer(`https://beta.${apiDomain}`, "Beta")
    .addServer(`https://alpha.${apiDomain}`, "Alpha")
    // .setTitle(name)
    .setDescription(markdownDescription)
    // .setVersion(version)
    .setContact("Open Sauced", "https://opensauced.pizza", "hello@opensauced.pizza")
    .setTermsOfService("https://github.com/open-sauced/code-of-conduct")
    // .setLicense(`The ${license} License`, `https://opensource.org/licenses/${license}`)
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, options.build(), {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string,
    ) => methodKey,
  });

  const customOptions: SwaggerCustomOptions = { swaggerOptions: { persistAuthorization: true } };

  const outputPath = path.resolve(process.cwd(), "dist/swagger.json");

  try {
    await writeFile(outputPath, JSON.stringify(document, null, 2), { encoding: "utf8" });
  } catch (e) {
    console.log(e);
  }

  SwaggerModule.setup("/", app, document, customOptions);

  await app.register(fastifyHelmet, { contentSecurityPolicy: false });
  await app.register(fastifyRateLimit, {
    global: true,
    max: 5000,
    timeWindow: "1 hour",
    enableDraftSpec: false,
    addHeadersOnExceeding: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
      "x-ratelimit-reset": true,
    },
    addHeaders: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
      "x-ratelimit-reset": true,
      "retry-after": true,
    },
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidUnknownValues: true,
  }));

  await app.listen(configService.get("api.port")!, configService.get("api.host"));
}

void bootstrap();
