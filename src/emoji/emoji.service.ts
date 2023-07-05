import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { DbEmoji } from "./entities/emoji.entity";

@Injectable()
export class EmojiService {
  constructor(
    @InjectRepository(DbEmoji, "ApiConnection")
    private emojiRepository: Repository<DbEmoji>
  ) {}

  baseQueryBuilder() {
    return this.emojiRepository.createQueryBuilder("emoji");
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.orderBy("emoji.display_order", "ASC");

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
