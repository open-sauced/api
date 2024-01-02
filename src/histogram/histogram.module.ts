import { Module } from "@nestjs/common";

import { TimescaleModule } from "../timescale/timescale.module";
import { HistogramController } from "./histogram.controller";

@Module({
  imports: [TimescaleModule],
  controllers: [HistogramController],
})
export class HistogramModule {}
