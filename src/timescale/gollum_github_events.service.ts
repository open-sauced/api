import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GollumHistogramDto } from "../histogram/dtos/gollum.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { DbGollumGitHubEventsHistogram } from "./entities/gollum_github_events_histogram.entity";

/*
 * gollum events, named "GollumEvent" in the GitHub API, are when
 * a GitHub actor modifies a repo's wiki. They are named "gollum" events after the
 * gollum-lib Ruby library: https://github.com/gollum/gollum-lib which is an extension used
 * by GitHub to power wikis via git.
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class GollumGithubEventsService {
  constructor(
    @InjectRepository(DbGollumGitHubEventsHistogram, "TimescaleConnection")
    private gollumGitHubEventsHistogramRepository: Repository<DbGollumGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.gollumGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genGollumHistogram(options: GollumHistogramDto): Promise<DbGollumGitHubEventsHistogram[]> {
    if (!options.contributor && !options.repo && !options.repoIds) {
      throw new BadRequestException("must provide contributor, repo, or repoIds");
    }

    const { range } = options;
    const order = options.orderDirection ?? OrderDirectionEnum.DESC;
    const startDate = GetPrevDateISOString(options.prev_days_start_date ?? 0);
    const width = options.width ?? 1;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select(`time_bucket('${width} day', event_time)`, "bucket")
      .addSelect("count(CASE WHEN LOWER(pages_action) = 'created' THEN 1 END)", "created_pages")
      .addSelect("count(CASE WHEN LOWER(pages_action) = 'edited' THEN 1 END)", "edited_pages")
      .from("gollum_github_events", "gollum_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "gollum_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "gollum_github_events"."event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    /* filter on the provided wiki editor/creator username */
    if (options.contributor) {
      queryBuilder.andWhere(`LOWER("gollum_github_events"."actor_login") = LOWER(:actor)`, {
        actor: options.contributor,
      });
    }

    /* filter on the provided repo names */
    if (options.repo) {
      queryBuilder.andWhere(`LOWER("gollum_github_events"."repo_name") IN (:...repoNames)`).setParameters({
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* filter on the provided repo ids */
    if (options.repoIds) {
      queryBuilder.andWhere(`"gollum_github_events"."repo_id" IN (:...repoIds)`).setParameters({
        repoIds: options.repoIds.split(","),
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbGollumGitHubEventsHistogram[];
  }
}
