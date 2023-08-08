import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { UserReposModule } from "../user-repo/user-repos.module";
import { StripeModule } from "../stripe/stripe.module";
import { CustomerModule } from "../customer/customer.module";
import { AuthController } from "./auth.controller";
import { SupabaseStrategy } from "./supabase.strategy";
import { SupabaseGuard } from "./supabase.guard";

@Module({
  imports: [PassportModule, UserModule, UserReposModule, StripeModule, CustomerModule],
  providers: [SupabaseStrategy, SupabaseGuard],
  exports: [SupabaseStrategy, SupabaseGuard],
  controllers: [AuthController],
})
export class AuthModule {}
