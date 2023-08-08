import { URL } from "node:url";
import { registerAs } from "@nestjs/config";

const getDomain = (subdomain?: string) =>
  new URL(`https://${subdomain ? `${subdomain}.` : ""}${process.env.DOMAIN ?? "opensauced.pizza"}`).toString();

export const EndpointConfig = registerAs("endpoint", () => ({
  landing: getDomain(),
  app: getDomain("app"),
  hot: getDomain("hot"),
  docs: getDomain("docs"),
  explore: getDomain("explore"),
  admin: getDomain("admin"),
}));

export default EndpointConfig;
