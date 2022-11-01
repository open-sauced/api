import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SupabaseGuard } from "./supabase.guard";
import { SupabaseStrategy } from "./supabase.strategy";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { UserReposModule } from "../user-repo/user-repos.module";

@Module({
  imports: [PassportModule, UserModule, UserReposModule],
  providers: [SupabaseStrategy, SupabaseGuard],
  exports: [SupabaseStrategy, SupabaseGuard],
  controllers: [AuthController],
})
export class AuthModule {}
