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


-- injects the new row's user_id field with the current user's id
-- if it is not set
create or replace function public.inject_user_id()
returns trigger
language plpgsql
security definer set search_path = public
as $$
    begin
        if new.user_id is NULL then
            new.user_id := auth.uid();
        end if;
        return new;
    end;
$$;


create trigger on_user_created_create_profile
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();


create trigger on_vote_insert_inject_user_id
    before insert on public.votes
    execute procedure public.inject_user_id();


create trigger on_registration_insert_inject_user_id
    before insert on public.event_registrations
    execute procedure public.inject_user_id();


create or replace function check_user_does_not_have_pairing_in_round()
returns trigger
language plpgsql as
$$
begin
  if exists (select from event_user_pairs where event_round = new.event_round and (auth.uid() = new.main_user or auth.uid() = new.other_user)) then
    raise exception 'user already has a pairing this round';
  end if;
  return new;
end;
$$


create trigger one_pair_per_round before insert on event_user_pairs for each row
execute procedure check_user_does_not_have_pairing_in_round();