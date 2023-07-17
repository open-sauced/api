import { Injectable } from "@nestjs/common";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { ObjectLiteral } from "typeorm";

import { PageMetaDto } from "../dtos/page-meta.dto";
import { PageDto } from "../dtos/page.dto";
import { PageOptionsDto } from "../dtos/page-options.dto";

interface PaginationInput<Entity extends ObjectLiteral> {
  queryBuilder: SelectQueryBuilder<Entity>;
  pageOptionsDto: PageOptionsDto;
}

@Injectable()
export class PagerService {
  async applyPagination<Entity extends ObjectLiteral>({ queryBuilder, pageOptionsDto }: PaginationInput<Entity>) {
    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.limit);

    const [itemCount, entities] = await Promise.all([queryBuilder.getCount(), queryBuilder.getMany()]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
