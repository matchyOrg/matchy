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