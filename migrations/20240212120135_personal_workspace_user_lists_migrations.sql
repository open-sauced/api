-------------------------------------------------------------------------------
-- This function loops through the user_lists and adds them to a personal workspace
-- based on the user_id column in the user_lists table.
--
-- This is only intended to be run once during the migration to personal workspaces.
-------------------------------------------------------------------------------

-- Loop through insight members to find the "admin" users and add those insights to their personal workspace
create or replace function migrate_workspace_user_lists()
returns void as $$
declare
    user_lists_record record;
    personal_workspace_id_var uuid;
begin
    for user_lists_record in select id, user_id, deleted_at from user_lists loop

        -- find the personal workspace id for the given user
        select personal_workspace_id into personal_workspace_id_var
        from users
        where id = user_lists_record.user_id;

        -- generate a new workspace_insight row for the given insight and user
        if personal_workspace_id_var is not null then
          insert into workspace_user_lists (id, user_list_id, workspace_id, created_at, deleted_at)
          values (uuid_generate_v4(), user_lists_record.id, personal_workspace_id_var, now(), user_lists_record.deleted_at);
        end if;
    end loop;
end;
$$ language plpgsql;

-- Execute the function
select migrate_workspace_user_lists()
