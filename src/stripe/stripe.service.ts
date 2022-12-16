import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Stripe from "stripe";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor (private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY")!, { apiVersion: "2022-11-15" });
  }

  async addCustomer (id: number, email?: string) {
    return this.stripe.customers.create({
      metadata: { userId: id },
      email,
    });
  }

  async createCheckoutSession (customer: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: this.configService.get("STRIPE_SUBSCRIPTION_PRICE_ID")!,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${this.configService.get<string>("STRIPE_CHECKOUT_SESSION_SUCCESS_URL")!}`,
      cancel_url: `${this.configService.get<string>("STRIPE_CHECKOUT_SESSION_CANCEL_URL")!}`,
    });

    return { sessionId: session.id };
  }
}
