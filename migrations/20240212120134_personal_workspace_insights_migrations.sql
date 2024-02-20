-------------------------------------------------------------------------------
-- Migrates insight pages where the user is an "admin" to their personal workspace.
--
-- In the initial implementation of the workspaces feature in: https://github.com/open-sauced/api/pull/448
-- the "user_id" field was removed on individual insights in favor of using the insight_members table.
--
-- All those users had "admin" access added as their access level.
-- This migration shifts those "admin" users to use the "workspace_insights" glue table.
--
-- This is only intended to be run once during the migration to personal workspaces.
-------------------------------------------------------------------------------

-- Loop through insight members to find the "admin" users and add those insights to their personal workspace
create or replace function migrate_workspace_insights()
returns void as $$
declare
    insight_member_record record;
    personal_workspace_id_var uuid;
    insight_deleted_at timestamp;
begin
    for insight_member_record in select user_id, insight_id from insight_members where access = 'admin' loop

        -- find the personal workspace id for the given user
        select personal_workspace_id into personal_workspace_id_var
        from users
        where id = insight_member_record.user_id;

        -- get the insights deleted_at field
        select deleted_at into insight_deleted_at
        from insights
        where id = insight_member_record.insight_id;

        -- generate a new workspace_insight row for the given insight and user
        if personal_workspace_id_var is not null then
          insert into workspace_insights (id, insight_id, workspace_id, created_at, deleted_at)
          values (uuid_generate_v4(), insight_member_record.insight_id, personal_workspace_id_var, now(), insight_deleted_at);
        end if;
    end loop;
end;
$$ language plpgsql;

-- Execute the function
select migrate_workspace_insights()
