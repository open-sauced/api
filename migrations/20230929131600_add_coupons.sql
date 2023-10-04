create table if not exists public.coupons
(
  -- static columns
  code character varying(50) collate pg_catalog."default" not null,
  created_at timestamp without time zone not null default now(),
  expired_at timestamp without time zone default null,

  -- dynamic columns
  constraint coupons_pkey primary key (code)
)

tablespace pg_default;

-- indexes
create index if not exists coupons_idx_created_at on public.coupons (created_at);
create index if not exists coupons_idx_expired_at on public.coupons (expired_at);

ALTER TABLE IF EXISTS public.users
    ADD COLUMN coupon_code character varying DEFAULT '';
