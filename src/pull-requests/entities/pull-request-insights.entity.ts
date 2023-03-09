import { Entity, Column } from "typeorm";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

import { DbPullRequest } from "./pull-request.entity";

@Entity({ name: "pull_requests_insights" })
export class DbPullRequestInsight extends DbPullRequest {
  @ApiModelPropertyOptional()
  @Column({ type: "text" })
  public repo_full_name?: string;

  @ApiModelPropertyOptional()
  @Column({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public repo_updated_at?: Date;

  @ApiModelProperty({
    description: "Repository GitHub topics",
    example: ["open-sauced", "open-source", "github"],
  })
  @Column({
    type: "varchar",
    array: true,
    default: "{}",
  })
  public repo_topics: string[];

  @ApiModelPropertyOptional({
    type: "number",
    description: "Recent has spam",
  })
  @Column({ type: "boolean" })
  public repo_has_spam?: boolean;

  @ApiModelPropertyOptional({
    type: "number",
    description: "Recent is in top 100 repos",
  })
  @Column({ type: "boolean" })
  public repo_is_top_100?: boolean;

  @ApiModelPropertyOptional({
    type: "number",
    description: "Recent contributor count",
  })
  @Column({ type: "boolean" })
  public repo_recent_contributor_count?: boolean;
}
