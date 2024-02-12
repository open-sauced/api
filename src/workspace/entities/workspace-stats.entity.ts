import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, Column } from "typeorm";

class DbWorkspacePrStats {
  @ApiModelProperty({
    description: "Number of PRs opened in a time range",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  opened = 0;

  @ApiModelProperty({
    description: "Number of PRs closed in a time range",
    example: 1,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  merged = 0;

  @ApiModelProperty({
    description: "Repository average open/close time for PRs",
    example: 2,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  velocity = 0;
}

class DbWorkspaceIssueStats {
  @ApiModelProperty({
    description: "Number of issues opened in a time range",
    example: 4,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  opened = 0;

  @ApiModelProperty({
    description: "Number of issues closed in a time range",
    example: 1,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  closed = 0;

  @ApiModelProperty({
    description: "Repository average open/close time for issues",
    example: 2,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  velocity = 0;
}

class DbWorkspaceRepoStats {
  @ApiModelProperty({
    description: "Number of stars for workspace repos",
    example: 1234,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  stars = 0;

  @ApiModelProperty({
    description: "Number of forks for repos",
    example: 987,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  forks = 0;

  @ApiModelProperty({
    description:
      "Number of commits and comments over the number of unique contributors in time range for entire workspace",
    example: 9,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  activity_ratio = 0;

  @ApiModelProperty({
    description: "An aggregate, overview calculation of how all repos in a workspace are generally doing",
    example: 9,
    type: "integer",
  })
  @Column({
    type: "integer",
    select: false,
    insert: false,
  })
  health = 0;
}

@Entity("workspaces")
export class DbWorkspaceStats {
  @ApiModelProperty({
    description: "Pull Request stats for workspace repos",
  })
  @Column({
    select: false,
    insert: false,
  })
  pull_requests: DbWorkspacePrStats;

  @ApiModelProperty({
    description: "Issue stats for workspace repos",
  })
  @Column({
    select: false,
    insert: false,
  })
  issues: DbWorkspaceIssueStats;

  @ApiModelProperty({
    description: "Repo stats for workspace repos",
  })
  @Column({
    select: false,
    insert: false,
  })
  repos: DbWorkspaceRepoStats;

  constructor() {
    this.pull_requests = new DbWorkspacePrStats();
    this.issues = new DbWorkspaceIssueStats();
    this.repos = new DbWorkspaceRepoStats();
  }
}
