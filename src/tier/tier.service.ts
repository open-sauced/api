import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Features, lookupOrg, subscribe } from "tier";

@Injectable()
export class TierService {
  private logger = new Logger(TierService.name);

  constructor(private configService: ConfigService) {}

  async checkAddOrg(userId: number, userDetails: { email: string; name: string; login: string }) {
    try {
      // check to see if the user is registered
      await lookupOrg(`org:${userId}`);
    } catch (e) {
      const { email, name, login } = userDetails;

      // grandparent existing pro account if necessary
      const plan: Features = this.configService.get("tier.proPlan")! as Features;

      try {
        // register the user with a free/pro account
        await subscribe(`org:${userId}`, plan, {
          info: {
            email,
            name,
            description: `OpenSauced Free Account`,
            phone: "",
            metadata: {
              login,
            },
          },
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          this.logger.error(`Unable to register account for ${login}`);
        }
      }
    }
  }
}
