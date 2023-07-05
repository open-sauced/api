import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { SupabaseAuthStrategy, SupabaseAuthUser } from "nestjs-supabase-auth";

@Injectable()
export class SupabaseStrategy extends PassportStrategy(SupabaseAuthStrategy, "supabase") {
  public constructor() {
    super({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_API_KEY,
      supabaseOptions: {},
      supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(user: SupabaseAuthUser) {
    return super.validate(user);
  }

  authenticate(req: never) {
    super.authenticate(req);
  }
}
