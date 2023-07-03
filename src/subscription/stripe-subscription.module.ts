import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbSubscription } from "../subscription/stripe-subscription.dto";
import { StripeSubscriptionService } from "./stripe-subscription.service";

@Module({
  imports: [TypeOrmModule.forFeature([DbSubscription], "ApiConnection")],
  providers: [StripeSubscriptionService],
  exports: [StripeSubscriptionService],
})
export class StripeSubscriptionModule {}
