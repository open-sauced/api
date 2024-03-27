import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetPrevDateISOString } from "../common/util/datetimes";
import { MemberHistogramDto } from "../histogram/dtos/member.dto";
import { OrderDirectionEnum } from "../common/constants/order-direction.constant";
import { DbMemberGitHubEventsHistogram } from "./entities/member_github_events_histogram.entity";

/*
 * member events, named "MemberEvent" in the GitHub API, are when
 * a GitHub actor adds another user as a member to an org or repo.
 *
 * for further details, refer to: https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28
 */

@Injectable()
export class MemberGithubEventsService {
  constructor(
    @InjectRepository(DbMemberGitHubEventsHistogram, "TimescaleConnection")
    private memberGitHubEventsHistogramRepository: Repository<DbMemberGitHubEventsHistogram>
  ) {}

  baseQueryBuilder() {
    const builder = this.memberGitHubEventsHistogramRepository.manager.createQueryBuilder();

    return builder;
  }

  async genMemberHistogram(options: MemberHistogramDto): Promise<DbMemberGitHubEventsHistogram[]> {
    if (!options.contributor && !options.repo && !options.repoIds && !options.org) {
      throw new BadRequestException("must provide contributor, repo, org, or repoIds");
    }

    const { range } = options;
    const order = options.orderDirection ?? OrderDirectionEnum.DESC;
    const startDate = GetPrevDateISOString(options.prev_days_start_date ?? 0);
    const width = options.width ?? 1;

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .select(`time_bucket('${width} day', event_time)`, "bucket")
      .addSelect("count(*)", "members_added")
      .from("member_github_events", "member_github_events")
      .where(`'${startDate}':: TIMESTAMP >= "member_github_events"."event_time"`)
      .andWhere(`'${startDate}':: TIMESTAMP - INTERVAL '${range} days' <= "member_github_events"."event_time"`)
      .groupBy("bucket")
      .orderBy("bucket", order);

    /* filter on the provided membership actor username */
    if (options.contributor) {
      queryBuilder.andWhere(`LOWER("member_github_events"."actor_login") = LOWER(:actor)`, {
        actor: options.contributor,
      });
    }

    /* filter on the provide repo names */
    if (options.repo) {
      queryBuilder.andWhere(`LOWER("member_github_events"."repo_name") IN (:...repoNames)`).setParameters({
        repoNames: options.repo.toLowerCase().split(","),
      });
    }

    /* filter on the provide org names */
    if (options.org) {
      queryBuilder.andWhere(`LOWER("member_github_events"."org_login") IN (:...orgNames)`).setParameters({
        orgNames: options.org.toLowerCase().split(","),
      });
    }

    /* filter on the provide repo ids */
    if (options.repoIds) {
      queryBuilder.andWhere(`"member_github_events"."repo_id" IN (:...repoIds)`).setParameters({
        repoIds: options.repoIds.split(","),
      });
    }

    const rawResults = await queryBuilder.getRawMany();

    return rawResults as DbMemberGitHubEventsHistogram[];
  }
}
