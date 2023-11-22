-- Table: public.logs

CREATE TABLE IF NOT EXISTS public.logs
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    context text COLLATE pg_catalog."default",
    message text COLLATE pg_catalog."default",
    level text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT logs_pkey PRIMARY KEY (id)
)

tablespace pg_default;
