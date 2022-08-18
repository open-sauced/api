import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SupabaseGuard } from "./supabase.guard";
import { SupabaseStrategy } from "./supabase.strategy";
import { AuthController } from "./auth.controller";

@Module({
  imports: [PassportModule],
  providers: [SupabaseStrategy, SupabaseGuard],
  exports: [SupabaseStrategy, SupabaseGuard],
  controllers: [AuthController],
})
export class AuthModule {}
