import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SupabaseGuard } from "./supabase.guard";
import { SupabaseStrategy } from "./supabase.strategy";
import { AuthController } from "./auth.controller";
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, UserModule],
  providers: [SupabaseStrategy, SupabaseGuard],
  exports: [SupabaseStrategy, SupabaseGuard],
  controllers: [AuthController],
})
export class AuthModule {}
