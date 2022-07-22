import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseQueryBuilder } from "@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder";
import type { definitions } from "./supabase-types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY, please set these in a .env file");
}

// Hehehe, this works very nicely
// (Somewhat relevant Typescript issue: https://github.com/microsoft/TypeScript/issues/16936 )
export type SafeSupabaseClient = {
  from<T extends keyof definitions>(table: T): SupabaseQueryBuilder<definitions[T]>;
};

export const supabase: SafeSupabaseClient & Omit<SupabaseClient, "from"> = createClient(supabaseUrl, supabaseAnonKey);
