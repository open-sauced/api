import { ApiProperty } from "@nestjs/swagger";

export class DbPullRequestContributor {
  @ApiProperty({
    description: "Pull request author username",
    example: "Th3nn3ss",
  })
  public author_login: string;

  @ApiProperty({
    description: "Timestamp representing pr last update",
    example: "2022-08-28 22:04:29.000000",
  })
  public updated_at?: Date;
}
