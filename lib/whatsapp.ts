export const APP_NAME = "Guia dos Condomínios";

export function waLink(phone: string, text?: string): string {
  const base = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function primeiroNome(nome: string): string {
  // "Mateus Pesce Eletricista" -> "Mateus"; "5S HIGIENIZAÇÃO" -> "5S HIGIENIZAÇÃO"
  const limpo = nome.replace(/[•()\-–/].*$/, "").trim();
  const partes = limpo.split(/\s+/);
  return partes.length > 2 ? partes[0] : limpo || nome;
}

export function mensagemPrestador(nomePrestador: string, condominio?: string | null): string {
  const local = condominio ? `para o ${condominio}` : "para o meu condomínio";
  return `Olá ${primeiroNome(nomePrestador)}, vi seu contato no ${APP_NAME} e gostaria de solicitar um orçamento ${local}.`;
}

export function mensagemLead(o: { nome: string; condominio: string; categoria?: string | null; descricao: string; whatsapp: string }): string {
  return [
    `*Novo pedido de orçamento — ${APP_NAME}*`,
    o.categoria ? `Serviço: ${o.categoria}` : null,
    `Condomínio: ${o.condominio}`,
    `Morador(a): ${o.nome}`,
    `WhatsApp: +${o.whatsapp}`,
    "",
    o.descricao,
    "",
    "Por favor, entre em contato diretamente com o(a) morador(a).",
  ].filter((l) => l !== null).join("\n");
}
