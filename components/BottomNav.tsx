"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconPlus, IconQuote, IconStar } from "./Icons";

const items = [
  { href: "/", label: "Guia", Icon: IconHome },
  { href: "/orcamento", label: "Orçamento", Icon: IconQuote },
  { href: "/clube", label: "Privilégios", Icon: IconStar },
  { href: "/indicar", label: "Indicar", Icon: IconPlus },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[var(--ink)] pb-[env(safe-area-inset-bottom)] text-white" aria-label="Principal">
      <ul className="mx-auto grid max-w-2xl grid-cols-4">
        {items.map(({ href, label, Icon }) => {
          const on = href === "/" ? path === "/" || path.startsWith("/c/") || path.startsWith("/p/") : path.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={on ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 pb-2.5 pt-3 text-[9.5px] font-semibold uppercase tracking-[0.18em] transition ${on ? "text-white" : "text-white/45 hover:text-white/75"}`}>
                {on && <span className="absolute inset-x-6 top-0 h-px bg-white" />}
                <Icon className="h-[22px] w-[22px]" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
