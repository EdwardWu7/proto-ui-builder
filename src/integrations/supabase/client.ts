
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nuxtdlzxucytwysnevla.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eHRkbHp4dWN5dHd5c25ldmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4ODA3NjEsImV4cCI6MjA2MDQ1Njc2MX0.wOs-S27IVPcQCbTwNIOEU6sztSgg6xLYnDoeMsC-uIo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
