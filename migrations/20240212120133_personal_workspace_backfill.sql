-------------------------------------------------------------------------------
-- This SQL file backfills personal workspaces for all users who do not yet
-- have a personal workspace.
--
-- This is only intended to be run once during the migration to personal workspaces.
-------------------------------------------------------------------------------

-- Declare a function to loop users and create personal workspaces for them
-- if they do not yet have a personal workspace
create or replace function backfill_personal_workspaces_for_users()
returns void as $$
declare
    user_record record;
begin
    for user_record in select id, personal_workspace_id from users where personal_workspace_id is null and is_open_sauced_member = true loop

        -- generate a new workspace for the current user
        insert into workspaces (id, name, description, created_at)
        values (uuid_generate_v4(), 'Personal workspace', 'Your personal workspace', now())
        returning id into user_record.personal_workspace_id;

        -- update the user's personal_workspace_id with the new workspace
        update users
        set personal_workspace_id = user_record.personal_workspace_id
        where id = user_record.id;

        -- add them as a workspace member
        insert into workspace_members (user_id, workspace_id, role)
        values (user_record.id, user_record.personal_workspace_id, 'owner');
    end loop;
end;
$$ language plpgsql;

-- Execute the function
select backfill_personal_workspaces_for_users();
