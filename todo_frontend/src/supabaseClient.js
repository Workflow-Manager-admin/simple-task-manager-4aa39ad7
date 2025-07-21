import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
// Returns a Supabase client instance, using values from the .env file loaded in React app
export function getSupabaseClient() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase credentials are not set. Please define REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in your .env file.'
    );
  }
  return createClient(url, key);
}
