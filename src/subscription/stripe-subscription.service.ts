import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DbSubscription } from "./stripe-subscription.dto";

@Injectable()
export class StripeSubscriptionService {
  constructor(
    @InjectRepository(DbSubscription, "ApiConnection")
    private subscriptionRepository: Repository<DbSubscription>
  ) {}

  baseQueryBuilder() {
    return this.subscriptionRepository.createQueryBuilder("subscription");
  }

  async upsertSubscription(subscription: Partial<DbSubscription>) {
    return this.subscriptionRepository.save(subscription);
  }
}
