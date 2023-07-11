import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EndorsementService } from "./endorsement.service";
import { EndorsementController } from "./endorsement.controller";
import { DbEndorsement } from "./entities/endorsement.entity";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { EndorsementTokenGuard } from "./endorsement-token.guard";
import { ApiServicesModule } from "../common/services/api-services.module";

@Module({
  imports: [TypeOrmModule.forFeature([DbEndorsement], "ApiConnection"), UserModule, AuthModule, ApiServicesModule],
  controllers: [EndorsementController],
  providers: [EndorsementService, EndorsementTokenGuard],
  exports: [EndorsementService],
})
export class EndorsementModule {}
