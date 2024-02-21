import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SupabaseAuthUser } from "nestjs-supabase-auth";
import { StripeService } from "../stripe/stripe.service";
import { DbCustomer } from "./customer.entity";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(DbCustomer, "ApiConnection")
    private customerRepository: Repository<DbCustomer>,
    private stripeService: StripeService
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

  async findByIdOrCreate(user: SupabaseAuthUser): Promise<string> {
    const {
      email,
      user_metadata: { sub },
    } = user;
    const id = sub as number;
    const customer = await this.findById(id);
    let customerId: string;

    if (customer) {
      customerId = customer.stripe_customer_id;
    } else {
      const stripeCustomer = await this.stripeService.addCustomer(id, email);
      const newCustomer = await this.addCustomer(id, stripeCustomer.id);

      customerId = newCustomer.stripe_customer_id;
    }

    return customerId;
  }

  async addCustomer(userId: number, stripe_customer_id: string) {
    return this.customerRepository.save({ id: userId, stripe_customer_id });
  }
}
