import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function make() {
  try {
    return url && key ? createClient(url, key) : null;
  } catch {
    return null; // invalid URL or key: run on sample data instead of crashing
  }
}

// null when env vars are missing or invalid, so the app still runs on sample data.
export const supabase = make();