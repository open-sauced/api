create table if not exists public.subscriptions
(
    id text collate pg_catalog."default" not null,
    user_id bigint not null,
    quantity integer,
    cancel_at_period_end boolean,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    current_period_start_at timestamp with time zone not null default timezone('utc'::text, now()),
    current_period_end_at timestamp with time zone not null default timezone('utc'::text, now()),
    ended_at timestamp with time zone,
    cancel_at timestamp with time zone,
    canceled_at timestamp with time zone,
    trial_start_at timestamp with time zone,
    trial_end_at timestamp with time zone,

    status varchar(255) collate pg_catalog."default" not null default 'trialing'::character varying,
    metadata jsonb,
    price_id text collate pg_catalog."default",

    constraint subscriptions_pkey primary key (id)
)

tablespace pg_default;
