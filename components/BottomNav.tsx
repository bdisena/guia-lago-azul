"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Início", icon: "🏠" },
  { href: "/orcamento", label: "Orçamento", icon: "📝" },
  { href: "/clube", label: "Vantagens", icon: "🎁" },
  { href: "/indicar", label: "Indicar", icon: "➕" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]" aria-label="Principal">
      <ul className="mx-auto grid max-w-2xl grid-cols-4">
        {items.map((it) => {
          const on = it.href === "/" ? path === "/" || path.startsWith("/c/") || path.startsWith("/p/") : path.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link href={it.href} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${on ? "text-lago-600" : "muted"}`}>
                <span className="text-xl leading-none" aria-hidden="true">{it.icon}</span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
