/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */
/* eslint @typescript-eslint/no-unsafe-return: 0 */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class PassthroughSupabaseGuard extends AuthGuard("supabase") {
  /*
   * allow the request to proceed if no user is found with no errors.
   * this allows for routes with requests to public resources to not require authentication.
   */

  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    // no user and no error can pass-through
    if (!user && !err) {
      return undefined;
    }

    // for any actual error, throw it as unauthorized
    if (err) {
      throw new UnauthorizedException();
    }

    /*
     * if a user is found, with a user id and authentication,
     * return the user object to proceed with the authenticated request.
     * this will effectivly pass through the users authenticated request including
     * their supabase user id and context
     */
    return user;
  }
}
