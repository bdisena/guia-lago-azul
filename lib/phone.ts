/** Normaliza telefone brasileiro para dígitos E.164 sem "+" (ex.: 5519997735520). 0800 fica como 0800XXXXXXX. */
export function normalizePhone(raw: string): string | null {
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("55800") || d.startsWith("0800") || d.startsWith("800")) {
    return "0800" + d.replace(/^(55)?0?800/, "");
  }
  if (d.startsWith("0")) d = d.replace(/^0+/, "");
  if (!d.startsWith("55") || d.length <= 11) d = d.length <= 11 ? "55" + d : d;
  if (d.length < 12 || d.length > 13) return null;
  return d;
}

export function isMobile(e164: string): boolean {
  // 55 + DDD(2) + 9XXXXXXXX
  return /^55\d{2}9\d{8}$/.test(e164) || /^55\d{2}9\d{7}$/.test(e164);
}

/** Escolhe o melhor número para WhatsApp: primeiro celular; senão primeiro fixo (WhatsApp Business); 0800 não serve. */
export function pickWhatsapp(phones: string[]): string | null {
  const valid = phones.filter((p) => !p.startsWith("0800"));
  return valid.find(isMobile) ?? valid[0] ?? null;
}

export function formatPhone(e164: string): string {
  if (e164.startsWith("0800")) return `0800 ${e164.slice(4, 7)} ${e164.slice(7)}`;
  const d = e164.replace(/^55/, "");
  const ddd = d.slice(0, 2), n = d.slice(2);
  if (n.length === 9) return `(${ddd}) ${n.slice(0, 5)}-${n.slice(5)}`;
  return `(${ddd}) ${n.slice(0, 4)}-${n.slice(4)}`;
}
