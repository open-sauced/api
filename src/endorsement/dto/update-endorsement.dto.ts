import { PartialType } from "@nestjs/swagger";
import { CreateEndorsementDto } from "./create-endorsement.dto";

export class UpdateEndorsementDto extends PartialType(CreateEndorsementDto) {}
