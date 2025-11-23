import { createClient } from '@supabase/supabase-js';
import { IS_DEMO_MODE } from '../constants';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// We export a null client if in demo mode to prevent runtime crashes
export const supabase = !IS_DEMO_MODE && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;