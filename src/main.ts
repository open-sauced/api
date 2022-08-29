import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import fastifyHelmet from "@fastify/helmet";
import { ConfigService } from "@nestjs/config";
import fastifyRateLimit from "@fastify/rate-limit";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { major } from "semver";

import { AppModule } from "./app.module";
import { name, description, version, license } from "../package.json";

async function bootstrap () {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const configService = app.get(ConfigService);

  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: String(major("1.8.0", { loose: false })),
  });

  const options = (new DocumentBuilder)
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .setContact("Open Sauced Triage Team", "https://opensauced.pizza", "hello@opensauced.pizza")
    .setTermsOfService("https://github.com/open-sauced/code-of-conduct")
    .setLicense(license, `https://opensource.org/licenses/${license}`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, {
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

  SwaggerModule.setup("docs", app, document, customOptions);

  await app.register(fastifyHelmet, { contentSecurityPolicy: false });
  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidUnknownValues: true,
  }));

  await app.listen(configService.get("api.port")!, configService.get("api.host"));
}

void bootstrap();
