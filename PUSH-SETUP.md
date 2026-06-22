# Notificações (Web Push) — guia de configuração

Ordem: (1) atualizar os arquivos no repositório, (2) configurar as variáveis no Render, (3) testar, (4) ligar o "despertador" diário.

## 1) Arquivos no repositório (GitHub)
Substitua/baixe e suba:
- `index.html`  (já tem o botão "Ativar avisos")
- `server.js`   (já tem o push)
- `package.json` (já inclui a biblioteca web-push)

E o service worker:
- Abra o seu `sw.js` no GitHub, clique no lápis (editar) e **cole o conteúdo de `sw-push-trecho.js` no final do arquivo** (sem apagar o que já existe). Commit.
- Se você ainda não tem um `sw.js` no repositório, me avise que eu te entrego um completo.

> Importante: o `sw.js`, o `manifest.json` e o `icon-192.png` precisam estar no repositório para os avisos (e o ícone da notificação) funcionarem.

## 2) Variáveis de ambiente no Render
No Render → seu Web Service → **Environment** → adicione:

| Key            | Value                                                        |
|----------------|--------------------------------------------------------------|
| VAPID_PUBLIC   | (a chave pública que recebi no chat)                         |
| VAPID_PRIVATE  | (a chave privada — só aqui, NUNCA no GitHub)                 |
| PUSH_CONTACT   | mailto:seu-email@exemplo.com                                 |
| PUSH_TOKEN     | uma senha secreta inventada por você (ex.: avisos-9f3k2x)    |

Clique **Save Changes**. O Render reinstala tudo (incluindo o web-push) e reinicia.

## 3) Testar
- Abra `.../api/health` → deve mostrar `"push":true`.
- No site, na seção de feiras, vai aparecer o botão **🔔 Ativar avisos**. Clique e permita as notificações no navegador. O botão vira "Avisos ativados ✓".
- Dispare um teste abrindo no navegador (troque SEU_TOKEN):
  ```
  .../api/push/run?token=SEU_TOKEN&test=1
  ```
  Deve chegar uma notificação "Teste de notificação ✓". A resposta na tela mostra `{"sent":1,...}`.

## 4) Despertador diário (gratuito) — para avisos automáticos
Como o Render free "dorme", use um cron externo grátis:
1. Crie conta em **cron-job.org** (gratuito).
2. **Create cronjob** → URL:
   ```
   https://SEU-SITE.onrender.com/api/push/run?token=SEU_TOKEN
   ```
3. Agende para 1x por dia (ex.: 09:00). Salve.

Todo dia ele acorda o site e dispara avisos das feiras que começam em **7 dias** e em **1 dia**.

## Manutenção e detalhes
- As datas das feiras para os avisos ficam na lista `PUSH_FAIRS`, dentro do `server.js`. Quando atualizar as feiras, atualize essa lista também.
- No plano free do Render o disco é efêmero: a cada deploy as inscrições podem zerar e as pessoas precisam clicar de novo em "Ativar avisos". Para durar, use um Render Disk (aponte `DATA_DIR`) ou um banco.
- iPhone: o push só funciona se a pessoa **adicionar o site à Tela de Início** (instalar como app) e estiver no iOS 16.4+. No Android e no computador funciona direto pelo navegador.
- Quer mudar os prazos (ex.: avisar com 30 e 3 dias)? É a lista `milestones` no `server.js`.
