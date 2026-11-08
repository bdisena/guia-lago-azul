# Guia dos Condomínios

PWA hiperlocal de prestadores de serviço indicados pelos moradores do Lago Azul, Lagoa Bonita, Portal do Lago, Recanto dos Pássaros e Jacarandá. É gratuito para o morador. A receita vem dos prestadores (Destaque, Selo Verificado, banners e leads).

**Stack:** Next.js 15 (App Router) · Tailwind CSS 4 · Supabase (Postgres, Auth e Storage) · Vercel.

## Rodando localmente
```bash
cp .env.example .env.local   # preencha URL e chave publishable do Supabase
npm install
npm run dev
```

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | projeto Supabase (chave publishable/anon) |
| `NEXT_PUBLIC_SITE_URL` | URL pública, usada nos QR codes |
| `NEXT_PUBLIC_CONTATO_WHATSAPP` | (opcional) WhatsApp da curadoria, ex.: `5519999999999`, nas páginas Anuncie e Sobre |

## Banco de dados
- `supabase/migrations/`: schema, RLS e RPCs. Já estão aplicadas no projeto Supabase.
- `supabase/seed.sql`: os 79 prestadores da planilha original. Para regerar: `npx tsx scripts/import-xlsx.ts planilha.xlsx`.
- Escritas públicas só acontecem por RPC validada (`enviar_orcamento`, `enviar_indicacao`, `registrar_evento`). Todo o resto exige admin.
- Admin: entre em `/admin/login` com um e-mail da tabela `admin_emails` (link mágico). Para adicionar outro admin: `insert into admin_emails values ('email@x.com');` antes do primeiro login.

## Estrutura
- `app/(public)`: app do morador. Inclui busca, categorias, perfil com botão de WhatsApp, Orçamento Express, Indicar, Clube, QR codes (`/qr`), Anuncie e Sobre/LGPD.
- `app/admin`: painel com prestadores (plano Free/Destaque/Suspenso, selos, fotos), indicações, orçamentos (envio para até 3 parceiros via WhatsApp, cada envio conta 1 lead), banners, clube e métricas com exportação CSV.
- `lib/`: clientes Supabase, telefone, mensagens de WhatsApp, tracking.
