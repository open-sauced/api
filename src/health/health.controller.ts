import { Controller, Get } from "@nestjs/common";
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private database: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get("/service")
  @ApiOperation({
    operationId: "healthStatusService",
    summary: "Check the health of Open Sauced service endpoints",
  })
  @HealthCheck()
  @ApiOkResponse()
  async service() {
    return this.health.check([
      async () => this.database.pingCheck("db"),
      async () => this.memory.checkHeap("memory.heap", <number>this.configService.get("memory_heap")),
      async () => this.memory.checkRSS("memory.rss", <number>this.configService.get("memory_rss")),
      async () => this.disk.checkStorage("disk.usage", {
        thresholdPercent: <number>this.configService.get("disk_percentage"),
        path: "/",
      }),
      async () => this.disk.checkStorage("disk.storage", {
        thresholdPercent: <number>this.configService.get("disk_size"),
        path: "/",
      }),
    ]);
  }

  @Get("/web")
  @ApiOperation({
    operationId: "healthStatusWeb",
    summary: "Check the health of Open Sauced web endpoints",
  })
  @HealthCheck()
  @ApiOkResponse()
  async web() {
    return this.health.check([
      async () => this.http.pingCheck("opensauced.pizza", <string>this.configService.get("endpoint.landing")),
      async () => this.http.pingCheck("app.opensauced", <string>this.configService.get("endpoint.app")),
      async () => this.http.pingCheck("hot.opensauced", <string>this.configService.get("endpoint.hot")),
      async () => this.http.pingCheck("docs.opensauced", <string>this.configService.get("endpoint.docs")),
      async () => this.http.pingCheck("explore.opensauced", <string>this.configService.get("endpoint.explore")),
      async () => this.http.pingCheck("admin.opensauced", <string>this.configService.get("endpoint.admin")),
    ]);
  }
}
