import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DbCustomer } from "./customer.entity";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(DbCustomer, "ApiConnection")
    private customerRepository: Repository<DbCustomer>
  ) {}

  baseQueryBuilder() {
    return this.customerRepository.createQueryBuilder("customer");
  }

  async findById(id: number) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("customer.id=:id", { id });

    return queryBuilder.getOne();
  }

  async findByCustomerId(id: string) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("customer.stripe_customer_id=:id", { id });

    return queryBuilder.getOne();
  }

  async addCustomer(userId: number, stripe_customer_id: string) {
    return this.customerRepository.save({ id: userId, stripe_customer_id });
  }
}
