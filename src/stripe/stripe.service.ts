import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Stripe from "stripe";

@Injectable()
export class StripeService {
  private _stripe?: Stripe;

  constructor(private configService: ConfigService) {}

  get stripe() {
    if (!this._stripe) {
      this._stripe = new Stripe(this.configService.get("stripe.secretKey")!, { apiVersion: "2022-11-15" });
    }

    return this._stripe;
  }

  async addCustomer(id: number, email?: string) {
    return this.stripe.customers.create({
      metadata: { userId: id },
      email,
    });
  }

  async createCheckoutSession(customer: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      allow_promotion_codes: true,
      customer,
      line_items: [
        {
          price: this.configService.get("stripe.subscriptionPriceID")!,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${this.configService.get<string>("stripe.subscriptionSessionCheckoutSuccessURL")!}`,
      cancel_url: `${this.configService.get<string>("stripe.subscriptionSessionCancelURL")!}`,
    });

    return { sessionId: session.id };
  }
}
