import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StripeModule } from "../stripe/stripe.module";
import { DbCustomer } from "./customer.entity";
import { CustomerService } from "./customer.service";

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([DbCustomer], "ApiConnection")],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
