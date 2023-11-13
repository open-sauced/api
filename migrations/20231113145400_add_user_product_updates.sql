ALTER TABLE IF EXISTS public.users
    ADD COLUMN receive_product_updates boolean NOT NULL DEFAULT true;