import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { ApiServicesModule } from "../common/services/api-services.module";
import { EndorsementService } from "./endorsement.service";
import { EndorsementController } from "./endorsement.controller";
import { DbEndorsement } from "./entities/endorsement.entity";
import { EndorsementTokenGuard } from "./endorsement-token.guard";

@Module({
  imports: [TypeOrmModule.forFeature([DbEndorsement], "ApiConnection"), UserModule, AuthModule, ApiServicesModule],
  controllers: [EndorsementController],
  providers: [EndorsementService, EndorsementTokenGuard],
  exports: [EndorsementService],
})
export class EndorsementModule {}
