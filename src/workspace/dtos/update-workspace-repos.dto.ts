import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";

export class NewWorkspaceRepo {
  full_name: string;
}

export class UpdateWorkspaceReposDto {
  @ApiProperty({
    description: "An array of repo objects to be added to the workspace",
    isArray: true,
    example: [{ full_name: "open-sauced/api" }],
  })
  @IsArray()
  @Type(() => NewWorkspaceRepo)
  repos: { full_name: string }[];
}
