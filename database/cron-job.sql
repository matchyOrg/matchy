select cron.schedule(
    'send-notifications',
    '*/30 * * * *',
    $$
    begin
        call supabase_functions.handle_due_notifications();
    end;
    $$
)