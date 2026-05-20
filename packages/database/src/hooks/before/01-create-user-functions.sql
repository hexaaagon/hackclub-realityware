create function current_user_id() returns text as $$
  select current_setting('my.user_id', true);
$$ language sql stable;

create function set_user_id (user_id text)
returns void
language sql
as $$
  select set_config('my.user_id', user_id, false);
$$;
