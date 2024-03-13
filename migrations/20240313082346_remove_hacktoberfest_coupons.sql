-------------------------------------------------------------------------------
-- remove hacktoberfest coupons
-------------------------------------------------------------------------------

-- now that we've moved to the new Workspace pricing modal (as of this writing 03/13/24),
-- the previously "closed" OpenSauced features behind the pro plan are now free.
--
-- this removes the "HACKTOBERFEST" coupon code from the users table which previously
-- gave users upgraded access.

update users set coupon_code = ''
where coupon_code = 'HACKTOBERFEST';
