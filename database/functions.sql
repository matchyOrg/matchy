-- Streamlines creation of event with groups.
-- Creates the groups, group-pairing and event in a transactional avoiding multiple round-trips 
create or replace function public.create_event_with_groups(
    title text,
    description text,
    header_image uuid,
    datetime timestamp with time zone,
    event_location text,
    max_participants integer,
    "groupATitle" text,
    "groupADescription" text,
    "groupBTitle" text,
    "groupBDescription" text
)
    returns void language sql as
$$
    with groupA as (
        insert into event_groups (title, description) values ("groupATitle", "groupADescription") returning id
    ),
    groupB as (
        insert into event_groups (title, description) values ("groupBTitle", "groupBDescription") returning id
    ),
    pair as (
        insert into event_group_pairs (group_a, group_b) select groupA.id, groupB.id from groupA, groupB returning id
    )
    insert into events (organizer, title, description, header_image, datetime, location, max_participants, event_group_pair, is_cancelled, delay_for_sending_matches, is_ended)
        select auth.uid(), title, description, header_image, datetime, event_location, max_participants, pair.id, False, Null, False from pair
$$;


create or replace procedure supabase_functions.handle_due_notifications()
language plpgsql as
$$
declare 
  notif_json varchar;
  num_rows int;

begin
  create local temp table temp_due_notifications (
    ID bigint primary key,
    User_id uuid not null,
    Content text not null,
    Subject text not null,
    Send_earliest_at timestamp with time zone
  );
  insert into temp_due_notifications (ID, User_id, Content, Subject, Send_earliest_at) select id, user_id, content, subject, send_earliest_at from due_notifications;
  num_rows := (select count(n) from due_notifications as n);

  if (num_rows = 0) then
    return;
  end if;
  
  notif_json := (select json_agg(temp_due_notifications) from temp_due_notifications);
  
  perform http((
    'POST',
    'https://ngryplxakzlojeqhdkse.functions.supabase.co/testFn',
    ARRAY[
        http_header(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncnlwbHhha3psb2plcWhka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgwOTg5MDksImV4cCI6MTk3MzY3NDkwOX0.D7r1RQLp1cwCwdgO318R0Tj7gteS9zcJBa1vdQQEUPI'
        )
    ],
    'application/json',
    notif_json
  ));
  delete from notifications where notifications.id in (select id from temp_due_notifications);
end;
$$