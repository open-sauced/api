import { registerAs } from "@nestjs/config";
import { URL } from "node:url";

const getDomain = (subdomain?: string) =>
  new URL(`https://${subdomain ? `${subdomain}.` : ""}${process.env.DOMAIN ?? "opensauced.pizza"}`).toString();

export default registerAs("endpoint", () => ({
  landing: getDomain(),
  app: getDomain("app"),
  hot: getDomain("hot"),
  docs: getDomain("docs"),
  explore: getDomain("explore"),
  admin: getDomain("admin"),
}));
