import { registerAs } from "@nestjs/config";

export const PizzaConfig = registerAs("pizza", () => ({
  host: String(process.env.PIZZA_OVEN_HOST ?? "0.0.0.0"),
  port: String(process.env.PIZZA_OVEN_PORT ?? "80"),
}));

export default PizzaConfig;
