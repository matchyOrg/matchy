import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY, please set these in a .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
