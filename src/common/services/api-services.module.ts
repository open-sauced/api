import { Module } from "@nestjs/common";
import { PagerService } from "./pager.service";

@Module({
  providers: [PagerService],
  exports: [PagerService],
})
export class ApiServicesModule {}
