import { Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Module({
  imports: [],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
