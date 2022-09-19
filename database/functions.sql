-- Streamlines creation of event with groups.
-- Creates the groups, group-pairing and event in a transactional avoiding multiple round-trips 
create or replace function public.create_event_with_groups(
    title text,
    description text,
    header_image text,
    datetime timestamp with time zone,
    location text,
    max_participants integer,
    "groupATitle" text,
    "groupADescription" text,
    "groupBTitle" text,
    "groupBDescription" text
)
    returns bigint language plpgsql as
$$
declare event_id bigint;
begin
    with groupA as (
        insert into event_groups (title, description, creator) values ("groupATitle", "groupADescription", auth.uid()) returning id
    ),
    groupB as (
        insert into event_groups (title, description, creator) values ("groupBTitle", "groupBDescription", auth.uid()) returning id
    ),
    pair as (
        insert into event_group_pairs (group_a, group_b) select groupA.id, groupB.id from groupA, groupB returning id
    )
    insert into events (organizer, title, description, header_image, datetime, location, max_participants, event_group_pair, is_cancelled, is_ended)
        select auth.uid(), title, description, header_image, datetime, location, max_participants, pair.id, False, False from pair returning id into event_id;
    return event_id;
end;
$$;


create or replace procedure supabase_functions.handle_due_notifications()
language plpgsql as
$$
declare 
  notif_json varchar;
  num_rows int;
  anon_key text;
  func_secret text;
begin
  create local temp table temp_due_notifications (
    ID bigint primary key,
    Email varchar not null,
    Content text not null,
    Subject text not null,
    Send_earliest_at timestamp with time zone
  );
  insert into temp_due_notifications (ID, Email, Content, Subject, Send_earliest_at) select id, email, content, subject, send_earliest_at from due_notifications;
  num_rows := (select count(n) from due_notifications as n);

  if (num_rows = 0) then
    return;
  end if;

  anon_key := (select public_key from auth.secrets);
  func_secret := (select function_secret from auth.secrets);

  notif_json := (select json_agg(temp_due_notifications) from temp_due_notifications);
  
  perform http((
    'POST',
    'https://ngryplxakzlojeqhdkse.functions.supabase.co/sendBatchNotifications',
    ARRAY[
        http_header('Authorization', 'Bearer ' || anon_key),
        http_header('function-secret', func_secret)
    ],
    'application/json',
    notif_json
  ));
  delete from notifications where notifications.id in (select id from temp_due_notifications);
end;
$$

create or replace function can_form_pair(main_user uuid, other_user uuid, event_round bigint)
returns bool
language plpgsql
security definer set search_path = 'public' as
$$
declare
  main_user_group bigint;
  main_user_registration bigint;
  other_user_group bigint;
  other_user_registration bigint;
  _event_id bigint;
  event_group bigint;
begin
  select into _event_id, event_group events.id, events.event_group_pair from events where events.id in (select event_id from event_rounds where event_rounds.id = event_round);
  select into main_user_group, main_user_registration reg.group_id, reg.id from event_registrations as reg where reg.user_id = main_user and reg.event_id = _event_id;
  select into other_user_group, other_user_registration reg.group_id, reg.id from event_registrations as reg where reg.user_id = other_user and reg.event_id = _event_id;

  if (main_user_registration is null or other_user_registration is null) then -- on of the users is not registered
    return false;
  end if;

  if (event_group is null) then -- both users are registered and the event doesn't use groups so they can't be in different groups
    return true;
  end if;
  return main_user_group <> other_user_group;
end;
$$

-- removes all header images that are not used as header images for events
create or replace procedure private.remove_unused_header_images()
language sql as
$$
  delete from storage.objects
    where bucket_id = 'event-header-images'
    and name <> '.emptyFolderPlaceholder'
    and name not in (select trim(leading 'event-header-images/' from header_image)  from events where header_image is not null);
$$

create or replace function public.compute_matches_and_send_notifications(ev_id bigint)
returns void
language plpgsql
security definer
as
$$
declare 
  anon_key text;
  func_secret text;
  _organizer uuid;
begin
  select into _organizer events.organizer from events where events.id = ev_id;
  if (auth.uid() <> _organizer) then
    raise exception '[events.not_organizer] You do not have permission to perform this action because you are not the organizer.';
  end if;
  call public.compute_matches(ev_id);
  anon_key := (select public_key from auth.secrets);
  func_secret := (select function_secret from auth.secrets);
  perform http((
    'POST',
    'https://ngryplxakzlojeqhdkse.functions.supabase.co/sendAvailableMatchesNotifications',
    ARRAY[
        http_header('Authorization', 'Bearer ' || anon_key),
        http_header('function-secret', func_secret)
    ],
    'application/json',
    CAST(ev_id as varchar)
  ));
  update events set results_published = true where events.id = ev_id;
end;
$$