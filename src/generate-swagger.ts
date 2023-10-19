import path from "node:path";
import { writeFile } from "node:fs/promises";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { VersioningType } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { major } from "semver";
import * as yaml from "yaml";

import { AppModule } from "./app.module";
import { swaggerMarkdownDescription } from "./common/util/swagger";

const generateSwaggerJson = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }), {
    bufferLogs: true,
    rawBody: true,
  });

  const apiDomain = "api.opensauced.pizza";

  const markdownDescription = swaggerMarkdownDescription(apiDomain);

  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: String(major("1.8.0", { loose: false })),
  });

  const options = new DocumentBuilder();

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

  const yamlSwaggerDoc = yaml.stringify(document);

  // write the yaml swagger doc to the root project directory anytime the server starts
  await writeFile(path.resolve(process.cwd(), "swagger.yaml"), yamlSwaggerDoc, "utf8");

  await app.close();
};

generateSwaggerJson().catch((e) => console.log(e));
