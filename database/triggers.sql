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


create or replace function private.check_user_does_not_have_pairing_in_round()
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

create or replace function private.cannot_change_events_group()
returns trigger
language plpgsql as
$$
begin
  if (new.event_group_pair <> old.event_group_pair) then
    raise exception 'cannot modify event_group_pair of existing event';
  end if;
  return new;
end;
$$

create trigger prevent_group_pair_modification 
before update on events 
for each row execute function private.cannot_change_events_group();


-- check that the max number of event_registrations is not reached
-- for total registration on events that do not use groups, per group otherwise
-- triggers acquire locks so there shouldn't be issues with concurrency
create or replace function private.limit_event_registrations()
returns trigger
language plpgsql security definer set search_path = 'public' as
$$
  declare
    registration_count integer;
    max_users integer;
    uses_groups boolean;
  begin
    uses_groups := (select event_group_pair from events where events.id = new.event_id) is not null;
    if (uses_groups) then
      registration_count := (select count(*) from event_registrations where event_registrations.event_id = new.event_id and event_registrations.group_id = new.group_id);
      max_users := (select max_participants / 2 from events where events.id = new.event_id);
    else
      registration_count := (select count(*) from event_registrations where new.event_id = event_registrations.event_id);
      max_users := (select max_participants from events where events.id = new.event_id);
    end if;
    if (max_users = registration_count) then
        raise exception 'cannot register for this events, because the maximum number of participants for the event or the group has been reached';
      end if;
    return new;
  end;
$$

create or replace function public.event_create_validate()
returns trigger
language plpgsql
as
$$
begin
  if (new.datetime <= now()) then
    raise exception '[events.create.datetime_must_be_future] Start timestamp of event must be in future';
  end if;
  return new;
end;
$$

create trigger on_event_create_check_start_timestmap
 before insert on events
  for each row 
  execute procedure public.event_create_validate();