import { ConfigService } from "@nestjs/config";
import { BadRequestException, Controller, Logger, Post, RawBodyRequest, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import Stripe from "stripe";

import { CustomerService } from "../customer/customer.service";
import { StripeSubscriptionService } from "../subscription/stripe-subscription.service";
import { StripeService } from "../stripe/stripe.service";
import { UserService } from "../user/services/user.service";
import { toDateTime } from "./utils";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

@ApiTags("Stripe service")
@Controller("stripe")
export class StripeWebhookController {
  private logger = new Logger(`StripeWebhook`);

  constructor(
    private customerService: CustomerService,
    private stripeSubscriptionService: StripeSubscriptionService,
    private stripeService: StripeService,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  private async manageSubscriptionStatusChange(subscriptionId: string, customerId: string) {
    const customerData = await this.customerService.findByCustomerId(customerId);

    if (!customerData) {
      throw new BadRequestException();
    }

    const { id: uuid } = customerData;
    const userId = parseInt(`${uuid}`, 10);
    const subscription = await this.stripeService.stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    });

    // upsert the latest status of the subscription object.
    const subscriptionData = {
      id: subscription.id,
      user_id: userId,
      metadata: JSON.stringify(subscription.metadata),
      status: subscription.status as string,
      price_id: subscription.items.data[0].price.id,
      quantity: subscription.items.data.length,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at) : undefined,
      canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at) : undefined,
      current_period_start_at: toDateTime(subscription.current_period_start),
      current_period_end_at: toDateTime(subscription.current_period_end),
      created_at: toDateTime(subscription.created),
      ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : undefined,
      trial_start_at: subscription.trial_start ? toDateTime(subscription.trial_start) : undefined,
      trial_end_at: subscription.trial_end ? toDateTime(subscription.trial_end) : undefined,
    };

    try {
      await this.stripeSubscriptionService.upsertSubscription(subscriptionData);

      const userRole = subscription.status === "active" ? 50 : 10;

      await this.userService.updateRole(userId, userRole);
    } catch (e: unknown) {
      this.logger.error(
        `Error inserting/updating subscription [${subscription.id}] for user [${userId}]: ${(e as Error).toString()}`
      );
      throw new BadRequestException();
    }

    this.logger.log(`Inserted/updated subscription [${subscription.id}] for user [${userId}]`);
  }

  @Post("/webhooks")
  @ApiOkResponse()
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const sig = (req.headers as unknown as Record<string, string>)["stripe-signature"];
    const webhookSecret: string | undefined = this.configService.get("stripe.webhookSecret");

    if (!sig || !webhookSecret) {
      return;
    }

    const event = this.stripeService.stripe.webhooks.constructEvent(req.rawBody!, sig, webhookSecret);

    if (relevantEvents.has(event.type)) {
      const subEvents = [
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
      ];

      if (subEvents.includes(event.type)) {
        const subscription = event.data.object as Stripe.Subscription;

        await this.manageSubscriptionStatusChange(subscription.id, subscription.customer as string);
      } else if (event.type === "checkout.session.completed") {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        if (checkoutSession.mode === "subscription") {
          const subscriptionId = checkoutSession.subscription;

          await this.manageSubscriptionStatusChange(subscriptionId as string, checkoutSession.customer as string);
        }
      } else {
        throw new BadRequestException();
      }
    }
  }
}
