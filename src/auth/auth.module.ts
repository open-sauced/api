import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { UserReposModule } from "../user-repo/user-repos.module";
import { StripeModule } from "../stripe/stripe.module";
import { CustomerModule } from "../customer/customer.module";
import { CouponModule } from "../coupon/coupon.module";
import { AuthController } from "./auth.controller";
import { SupabaseStrategy } from "./supabase.strategy";
import { SupabaseGuard } from "./supabase.guard";
import { PassthroughSupabaseGuard } from "./passthrough-supabase.guard";

@Module({
  imports: [PassportModule, forwardRef(() => UserModule), UserReposModule, StripeModule, CustomerModule, CouponModule],
  providers: [SupabaseStrategy, SupabaseGuard, PassthroughSupabaseGuard],
  exports: [SupabaseStrategy, SupabaseGuard, PassthroughSupabaseGuard],
  controllers: [AuthController],
})
export class AuthModule {}
