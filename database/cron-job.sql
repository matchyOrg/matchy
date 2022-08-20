select cron.schedule(
    'send-notifications',
    '*/30 * * * *',
    $$
        call supabase_functions.handle_due_notifications();
    $$
)