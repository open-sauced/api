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

@Controller("health")
@ApiTags("Health check service")
export class HealthController {
  constructor (
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
  async service () {
    return this.health.check([
      async () => this.database.pingCheck("db"),
      async () => this.memory.checkHeap("memory.heap", this.configService.get("memory_heap")!),
      async () => this.memory.checkRSS("memory.rss", this.configService.get("memory_rss")!),
      async () => this.disk.checkStorage("disk.usage", {
        thresholdPercent: this.configService.get("disk_percentage")!,
        path: "/",
      }),
      async () => this.disk.checkStorage("disk.storage", {
        thresholdPercent: this.configService.get("disk_size")!,
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
  async web () {
    return this.health.check([
      async () => this.http.pingCheck("opensauced.pizza", this.configService.get("endpoint.landing")!),
      async () => this.http.pingCheck("app.opensauced", this.configService.get("endpoint.app")!),
      async () => this.http.pingCheck("hot.opensauced", this.configService.get("endpoint.hot")!),
      async () => this.http.pingCheck("docs.opensauced", this.configService.get("endpoint.docs")!),
      async () => this.http.pingCheck("explore.opensauced", this.configService.get("endpoint.explore")!),
      async () => this.http.pingCheck("admin.opensauced", this.configService.get("endpoint.admin")!),
    ]);
  }
}
