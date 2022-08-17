create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
  begin
    insert into public.profiles (user_id)
    values (new.id);
    return new;
  end;
$$;

create trigger on_user_created_create_profile
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();