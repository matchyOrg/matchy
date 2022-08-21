select cron.schedule(
    'send-notifications',
    '* * * * *',
    $$
        call supabase_functions.handle_due_notifications();
    $$
)