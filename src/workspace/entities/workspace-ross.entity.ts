import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Entity, Column } from "typeorm";
import {
  DbRossContributorsHistogram,
  DbRossIndexHistogram,
} from "../../timescale/entities/ross_index_histogram.entity";

@Entity("workspaces")
export class DbWorkspaceRossIndex {
  @ApiModelProperty({
    description: "Histogram buckets for the ross index of a workspace repos over a period of time",
  })
  @Column({
    select: false,
    insert: false,
  })
  ross: DbRossIndexHistogram[];

  @ApiModelProperty({
    description:
      "Histogram buckets for the new/returning/internal contributors of tracked workspace repos over a period of time",
  })
  @Column({
    select: false,
    insert: false,
  })
  contributors: DbRossContributorsHistogram[];
}
