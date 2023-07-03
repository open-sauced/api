import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbCustomer } from "./customer.entity";
import { CustomerService } from "./customer.service";

@Module({
  imports: [TypeOrmModule.forFeature([DbCustomer], "ApiConnection")],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
