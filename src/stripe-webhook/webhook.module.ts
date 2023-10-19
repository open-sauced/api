import { Module } from "@nestjs/common";

import { StripeSubscriptionModule } from "../subscription/stripe-subscription.module";
import { CustomerModule } from "../customer/customer.module";

import { StripeModule } from "../stripe/stripe.module";
import { UserModule } from "../user/user.module";
import { StripeWebhookController } from "./stripe-webhook.controller";

@Module({
  imports: [StripeSubscriptionModule, CustomerModule, StripeModule, UserModule],
  providers: [StripeWebhookController],
  controllers: [StripeWebhookController],
  exports: [StripeWebhookController],
})
export class StripeWebHookModule {}
