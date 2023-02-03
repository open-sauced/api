-- Table: public.subscriptions

-- DROP TABLE IF EXISTS public.subscriptions;

CREATE TABLE IF NOT EXISTS public.subscriptions
(
    id text COLLATE pg_catalog."default" NOT NULL,
    user_id bigint NOT NULL,
    status varchar(255) collate pg_catalog."default" not null default 'trialing'::character varying,
    metadata jsonb,
    price_id text COLLATE pg_catalog."default",
    quantity integer,
    cancel_at_period_end boolean,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_start_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    ended_at timestamp with time zone,
    cancel_at timestamp with time zone,
    canceled_at timestamp with time zone,
    trial_start_at timestamp with time zone,
    trial_end_at timestamp with time zone,
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.subscriptions
    OWNER to postgres;

GRANT ALL ON TABLE public.subscriptions TO anon;

GRANT ALL ON TABLE public.subscriptions TO authenticated;

GRANT ALL ON TABLE public.subscriptions TO postgres;

GRANT ALL ON TABLE public.subscriptions TO service_role;