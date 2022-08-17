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