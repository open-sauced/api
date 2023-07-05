import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EndorsementTokenGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(host: ExecutionContext) {
    const apiToken = this.configService.get<string>("api.endorsementServiceToken");
    const ctx = host.switchToHttp();
    const request: { headers: Record<string, string> } = ctx.getRequest();
    const token = request.headers["x-opensauced-token"];

    if (!apiToken) {
      return false;
    }

    const isValid = token === apiToken;

    if (!isValid) {
      return false;
    }

    return true;
  }
}
