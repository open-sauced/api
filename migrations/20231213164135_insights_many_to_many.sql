-- This psql file transforms the insights table to remove the "user_id" field
-- which restricts insights to be owned by a single "user". This is in service of allowing
-- insights to be more flexible with workspaces and used by multiple users.
--
-- Uses a transaction to propagate existing relationships into the insight_members table
-- and remove the user_id column from the insights table.
-- If there are no errors, this will safely transform the insights table.

begin;

insert into public.insight_members (user_id, insight_id, access)
select user_id, id, 'admin' as access from public.insights
where user_id is not null;

alter table public.insights
  drop column user_id;

commit;
