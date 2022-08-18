import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SupabaseGuard } from "./supabase.guard";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  @Get("/status")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "checkAuthStatus",
    summary: "Check the status of JWT based authentication",
  })
  @ApiOkResponse({ type: String })
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    console.log("SupabaseGuard");

    return "1";
  }
}
