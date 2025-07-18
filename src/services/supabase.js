import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function getUserId() {
  let id = localStorage.getItem('anonUserId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('anonUserId', id);
  }
  return id;
}
