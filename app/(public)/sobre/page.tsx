import { Header } from "@/components/Header";
import { PageIntro } from "@/components/PageIntro";
import { waLink } from "@/lib/whatsapp";

export const metadata = { title: "Sobre e privacidade" };
const CONTATO = process.env.NEXT_PUBLIC_CONTATO_WHATSAPP ?? "";

export default function SobrePage() {
  return (
    <>
      <Header back="/" />
      <PageIntro eyebrow="Sobre" title={<>Curadoria feita<br />pelos vizinhos.</>} />
      <article className="space-y-9 px-4 pt-8 text-[15px] leading-relaxed">
        <section>
          <p>O Guia dos Condomínios reúne prestadores de serviço indicados pelos próprios moradores nos grupos de WhatsApp dos condomínios Lago Azul, Lagoa Bonita, Portal do Lago, Recanto dos Pássaros e Jacarandá. O uso é sempre gratuito para moradores.</p>
        </section>
        <section>
          <h2 className="border-b border-[var(--ink)] pb-2 font-display text-[24px] leading-none">Como funcionam os selos</h2>
          <ul className="mt-4 space-y-2.5">
            <li><b>Mais recomendado</b>: recebeu elogios explícitos de moradores.</li>
            <li><b>✓ Verificado</b>: passou por checagem cadastral, de antecedentes e de referências com vizinhos.</li>
            <li><b>Parceiro do Guia</b>: prestador com plano Destaque. O selo indica patrocínio, não avaliação.</li>
          </ul>
        </section>
        <section>
          <h2 className="border-b border-[var(--ink)] pb-2 font-display text-[24px] leading-none">Aviso</h2>
          <p className="mt-4">As indicações refletem experiências de moradores e não são garantia de qualidade, preço, disponibilidade ou situação profissional. Combine valores e condições diretamente com o prestador.</p>
        </section>
        <section id="privacidade">
          <h2 className="border-b border-[var(--ink)] pb-2 font-display text-[24px] leading-none">Privacidade (LGPD)</h2>
          <p className="mt-4">Não exibimos nomes de moradores que fizeram indicações. Os dados do Orçamento Express (nome, condomínio e WhatsApp) são usados só para encaminhar o seu pedido a até 3 prestadores parceiros. Para estatísticas, registramos cliques e visualizações sem identificar você.</p>
        </section>
        <section id="prestador" className="bg-[var(--ink)] p-6 text-white">
          <h2 className="font-display text-[26px] leading-tight">É um profissional listado no Guia?</h2>
          <p className="mt-3 text-white/70">Você pode atualizar seus dados, pedir o Selo Verificado ou solicitar a remoção do seu cadastro a qualquer momento.</p>
          {CONTATO && (
            <a className="btn btn-light mt-5 w-full" target="_blank" rel="noopener noreferrer"
              href={waLink(CONTATO, "Olá! Sou prestador listado no Guia dos Condomínios e gostaria de atualizar/remover meu cadastro.")}>
              Falar com a curadoria
            </a>
          )}
        </section>
      </article>
    </>
  );
}
