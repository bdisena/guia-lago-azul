import { CondoProvider } from "@/components/CondoProvider";
import { CondoWelcome } from "@/components/CondoPicker";
import { BottomNav } from "@/components/BottomNav";
import { PwaSupport } from "@/components/PwaSupport";
import { getCatalogo } from "@/lib/data";

// dados vêm do Supabase com cache de 5 min (unstable_cache); render sob demanda
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { condominios } = await getCatalogo();
  return (
    <CondoProvider condominios={condominios}>
      <div className="mx-auto min-h-screen max-w-2xl pb-24">{children}</div>
      <BottomNav />
      <CondoWelcome />
      <PwaSupport />
    </CondoProvider>
  );
}
