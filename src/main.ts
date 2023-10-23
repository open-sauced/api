import path from "node:path";
import { writeFile } from "node:fs/promises";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import fastifyHelmet from "@fastify/helmet";
import { ConfigService } from "@nestjs/config";
import fastifyRateLimit from "@fastify/rate-limit";
import { major } from "semver";

import { AppModule } from "./app.module";
import { swaggerMarkdownDescription } from "./common/util/swagger";
import CustomLogger from "./log/custom-logger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }), {
    bufferLogs: true,
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  const apiDomain = String(configService.get("api.domain"));
  const markdownDescription = swaggerMarkdownDescription(apiDomain);

  app.useLogger(app.get(CustomLogger));
  app.flushLogs();
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: String(major("1.8.0", { loose: false })),
  });

  const options = new DocumentBuilder();

  if (configService.get("api.development")) {
    options.addServer(`http://localhost:${String(configService.get("api.port"))}`, "Development", {});
  }

  options
    .addServer(`https://${apiDomain}`, "Production", {})
    .addServer(`https://beta.${apiDomain}`, "Beta", {})
    .addServer(`https://alpha.${apiDomain}`, "Alpha", {})
    .setTitle(`@open-sauced/api.opensauced.pizza`)
    .setDescription(markdownDescription)
    .setVersion(`1`)
    .setContact("Open Sauced", "https://opensauced.pizza", "hello@opensauced.pizza")
    .setTermsOfService("https://github.com/open-sauced/code-of-conduct")
    .setLicense(`The MIT License`, `https://opensource.org/licenses/mit`)
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, options.build(), {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
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
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    })
  );

  await app.listen(configService.get("api.port")!, configService.get("api.host"));
}

void bootstrap();
