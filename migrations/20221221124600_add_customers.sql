-- Table: public.customers

-- DROP TABLE IF EXISTS public.customers;

CREATE TABLE IF NOT EXISTS public.customers
(
    id bigint NOT NULL,
    stripe_customer_id text COLLATE pg_catalog."default",
    CONSTRAINT customers_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.customers
    OWNER to postgres;

GRANT ALL ON TABLE public.customers TO anon;

GRANT ALL ON TABLE public.customers TO authenticated;

GRANT ALL ON TABLE public.customers TO postgres;

GRANT ALL ON TABLE public.customers TO service_role;