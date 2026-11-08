import { createClient } from "@supabase/supabase-js";

/** Cliente anônimo sem cookies: leituras públicas cacheáveis (ISR) e RPCs públicas. */
export function publicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
