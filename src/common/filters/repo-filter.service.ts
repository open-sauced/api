import { Injectable } from "@nestjs/common";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

import { InsightFilterFieldsEnum } from "../../insight/dtos/insight-options.dto";
import { FilterOptionsDto } from "../dtos/filter-options.dto";

@Injectable()
export class RepoFilterService {
  /**
   * applies repo-based filters based on the filter/InsightFilterFieldsEnum query param
   * @param options
   * @param range
   */

  getRepoFilters(options: FilterOptionsDto, range = 0): [string, object][] {
    const filters: [string, object][] = [];

    if (options.repoIds) {
      filters.push([`repos.id IN (:...repoIds)`, { repoIds: options.repoIds.split(",") }]);
    }

    if (options.repo) {
      filters.push([`LOWER(repos.full_name)=:repo`, { repo: decodeURIComponent(options.repo.toLowerCase()) }]);
    }

    if (options.topic) {
      filters.push([`:topic = ANY("repos"."topics")`, { topic: options.topic }]);
    }

    if (options.filter === InsightFilterFieldsEnum.Recent) {
      filters.push(["repos.stars >= 1000", {}]);
    } else if (options.filter === InsightFilterFieldsEnum.Top100) {
      filters.push([
        `
        repos.id IN (
          SELECT "top_repos".id
          FROM "repos" "top_repos"
          WHERE
            top_repos.stars > 1000
          ORDER BY top_repos.stars DESC
          LIMIT 1000
        )
      `,
        {},
      ]);
    } else if (options.filter === InsightFilterFieldsEnum.MostSpammed) {
      filters.push([
        `
        repos.id IN (
          SELECT spam_pull_requests.repo_id
          FROM "pull_requests" "spam_pull_requests"
          WHERE
            'spam' = ANY("spam_pull_requests"."label_names")
            AND now() - INTERVAL '${range} days' <= "spam_pull_requests"."updated_at"
        )
      `,
        {},
      ]);
    }

    /*
     *  else if (options.filter === InsightFilterFieldsEnum.MinimumContributors) {
     *   filters.push([`
     *     repo.id IN (
     *       SELECT id FROM (SELECT repos.id, COUNT(contributors.id) as contributor_count
     *       FROM repos
     *       JOIN contributors on repos.id=contributors.repo_id
     *       WHERE now() - INTERVAL '${interval} days' <= to_timestamp("contributors"."last_commit_time" / 1000)
     *       GROUP BY repos.id
     *     ) contributor_counts
     *     WHERE contributor_count >= 5
     *   )`, {}]);
     * }
     */

    return filters;
  }

  /**
   * applies the filters using the provided QueryBuilder
   * @param qb
   * @param filters
   */

  applyQueryBuilderFilters<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, filters: [string, object][] = []) {
    filters.forEach(([sql, data], index) => {
      if (index === 0) {
        qb.where(sql, data);
      } else {
        qb.andWhere(sql, data);
      }
    });
  }
}
