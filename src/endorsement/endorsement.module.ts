import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EndorsementService } from "./endorsement.service";
import { EndorsementController } from "./endorsement.controller";
import { DbEndorsement } from "./entities/endorsement.entity";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbEndorsement,
    ], "ApiConnection"),
    UserModule,
  ],
  controllers: [EndorsementController],
  providers: [EndorsementService],
  exports: [EndorsementService],
})
export class EndorsementModule {}
