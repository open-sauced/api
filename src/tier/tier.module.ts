import { Module } from "@nestjs/common";
import { TierService } from "./tier.service";

@Module({
  providers: [TierService],
  exports: [TierService],
})
export class TierModule {}
