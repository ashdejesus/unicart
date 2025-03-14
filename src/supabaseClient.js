import { createClient } from '@supabase/supabase-js'

// Replace with your Supabase Project URL & Anon Key
const SUPABASE_URL = "https://gsjvtxigubypbbwodumm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzanZ0eGlndWJ5cGJid29kdW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4Nzk4MjksImV4cCI6MjA1NzQ1NTgyOX0.3SM_CYEccqjEyJz5FuHrqsb9GfN__HNtoTXgpwFkSIA";

const SUPABASE = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default SUPABASE;