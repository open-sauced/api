import { registerAs } from "@nestjs/config";

export const StripeConfig = registerAs("stripe", () => ({
  secretKey: String(process.env.STRIPE_SECRET_KEY ?? ""),
  webhookSecret: String(process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET ?? ""),
  subscriptionPriceID: String(process.env.STRIPE_SUBSCRIPTION_PRICE_ID ?? ""),
  subscriptionSessionCheckoutSuccessURL: String(process.env.STRIPE_CHECKOUT_SESSION_SUCCESS_URL ?? ""),
  subscriptionSessionCancelURL: String(process.env.STRIPE_CHECKOUT_SESSION_CANCEL_URL ?? ""),
}));

export default StripeConfig;
