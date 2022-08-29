select cron.schedule(
    'send-notifications',
    '* * * * *',
    $$
        call supabase_functions.handle_due_notifications();
    $$
);


select cron.schedule(
  'remove-unused-header-images',
  '0 0 * * *',
  $$
    call private.remove_unused_header_images();
  $$
);