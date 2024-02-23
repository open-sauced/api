import { Module } from "@nestjs/common";

import { TimescaleModule } from "../timescale/timescale.module";
import { HistogramController } from "./histogram.controller";
import { TopHistogramController } from "./top.controller";

@Module({
  imports: [TimescaleModule],
  controllers: [HistogramController, TopHistogramController],
})
export class HistogramModule {}
