import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://biubjswsubgjvafvdloy.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdWJqc3dzdWJnanZhZnZkbG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxOTAwOTEsImV4cCI6MjA0Nzc2NjA5MX0.o5UHSeNFlHlqr0W00BsflFSr42O2fJ19pH9yAG0jaFQ";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});