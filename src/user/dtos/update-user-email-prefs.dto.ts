import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateUserEmailPreferencesDto {
  @ApiProperty({
    description: "User Display Public Email",
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  public display_email: boolean;

  @ApiProperty({
    description: "User Recieve Collaboration Requests",
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  public receive_collaboration: boolean;
}
