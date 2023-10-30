import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import tier, { Features } from "tier";

@Injectable()
export class TierService {
  private logger = new Logger(TierService.name);

  constructor(private configService: ConfigService) {}

  async checkAddOrg(userId: number, userDetails: { email: string; name: string; login: string }, proAccount = false) {
    try {
      // check to see if the user is registered
      await tier.lookupOrg(`org:${userId}`);
    } catch (e) {
      const { email, name, login } = userDetails;

      // grandparent existing pro account if necessary
      const plan = proAccount ? this.configService.get("tier.proPlan") : this.configService.get("tier.freePlan");

      try {
        // register the user with a free/pro account
        await tier.subscribe(`org:${userId}`, [plan] as Features[], {
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
      } catch (e) {
        this.logger.error(`Unable to register account for ${login}`);
      }
    }
  }
}
