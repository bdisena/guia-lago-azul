import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cliente com sessão do usuário (admin) via cookies. */
export async function serverClient() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* chamado de Server Component: o middleware cuida do refresh */
        }
      },
    },
  });
}
