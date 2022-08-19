import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PageDto } from "../dtos/page.dto";
import { Repo } from "../../repo/entities/repo.entity";

export const ApiPaginatedResponse = <TModel extends Type>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PageDto, Repo),
    ApiOkResponse({
      description: "Successfully received model list",
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
