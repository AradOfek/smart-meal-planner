import { createClient } from '@supabase/supabase-js';

// Pulling secret keys from our .env.local environment setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in .env.local');
}

// Creating the connection machine
export const supabase = createClient(supabaseUrl, supabaseAnonKey);