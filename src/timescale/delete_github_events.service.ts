import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeleteHistogramDto } from "../histogram/dtos/delete.dto";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { DbDeleteGitHubEventsHistogram } from "./entities/delete_github_events_histogram.entity";

/*
 * delete events, named "DeleteEvent" in the GitHub API, are when
 * a GitHub actor deletes a public repo, a tag, or a branch within a repo.
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class DeleteGithubEventsService {
  constructor(
    @InjectRepository(DbDeleteGitHubEventsHistogram, "TimescaleConnection")
    private deleteGitHubEventsHistogramRepository: Repository<DbDeleteGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.deleteGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genDeleteHistogram(options: DeleteHistogramDto): Promise<DbDeleteGitHubEventsHistogram[]> {
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
      .addSelect("count(CASE WHEN LOWER(delete_ref_type) = 'tag' THEN 1 END)", "tags_deleted")
      .addSelect("count(CASE WHEN LOWER(delete_ref_type) = 'branch' THEN 1 END)", "branches_deleted")
      .from("delete_github_events", "delete_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "delete_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "delete_github_events"."event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    /* filter on the provided deleter username*/
    if (options.contributor) {
      queryBuilder.andWhere(`LOWER("delete_github_events"."actor_login") = LOWER(:actor)`, {
        actor: options.contributor,
      });
    }

    /* filter on the provided repo names */
    if (options.repo) {
      queryBuilder.andWhere(`LOWER("delete_github_events"."repo_name") IN (:...repoNames)`).setParameters({
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* filter on the provided repo ids */
    if (options.repoIds) {
      queryBuilder.andWhere(`"delete_github_events"."repo_id" IN (:...repoIds)`).setParameters({
        repoIds: options.repoIds.split(","),
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbDeleteGitHubEventsHistogram[];
  }
}
