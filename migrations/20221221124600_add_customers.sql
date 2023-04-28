create table if not exists public.customers
(
    id bigint not null,
    stripe_customer_id text collate pg_catalog."default",

    constraint customers_pkey primary key (id)
)

tablespace pg_default;
