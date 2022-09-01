alter table events
add constraint title_min_length check (length(title) > 3);

alter table events
add constraint title_max_length check (length(title) < 50);

alter table events
add constraint description_max_length check (length(description) < 1000);

alter table events
add constraint location_max_length check (length(description) < 100);

alter table votes
add constraint only_one_vote_per_pair unique(user_id, user_pair_id);

alter table event_groups
add constraint title_min_length check (length(title) > 0);

alter table event_groups
add constraint title_max_length check (length(title) < 50);

alter table event_groups
add constraint description_max_length check (length(title) < 250);

alter table events add constraint cannot_end_unstarted_event check(is_started = true or is_ended = false);

do
$$
begin
alter table public.events drop constraint events_organizer_fkey;
alter table public.events add constraint events_organizer_fkey foreign key (organizer) references public.profiles(user_id) on delete set null;
alter table public.events drop constraint events_event_group_pair_fkey;
alter table public.events add constraint events_event_group_pair_fkey foreign key (event_group_pair) references public.event_group_pairs(id) on delete set null;
alter table public.event_group_pairs drop constraint event_group_pairs_group_a_fkey;
alter table public.event_group_pairs drop constraint event_group_pairs_group_b_fkey;
alter table public.event_group_pairs add constraint event_group_pairs_group_a_fkey foreign key (group_a) references public.event_groups(id) on delete cascade;
alter table public.event_group_pairs add constraint event_group_pairs_group_b_fkey foreign key (group_b) references public.event_groups(id) on delete cascade;
end;
$$