-------------------------------------------------------------------------------
-- A one off modification to unchanged workspace names/descriptions
-- to update the copy for users
-------------------------------------------------------------------------------

-- Declare a function to loop through workspaces and modify personal workspace
-- names / descriptions for those that have not been modified.
create or replace function update_personal_workspaces_names_for_users()
returns void as $$
declare
    workspace_record record;
begin
    for workspace_record in select id from workspaces where name = 'Personal workspace' loop

    update workspaces set
    name = 'Your workspace',
    description = 'Your personal workspace',
    updated_at = now()
    where id = workspace_record.id;

    end loop;
end;
$$ language plpgsql;

-- Execute the function
select update_personal_workspaces_names_for_users();
