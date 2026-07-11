# 🚀 Sincronização Bidirecional: Google Calendar ↔ Notion

Sincronização **completa**, **automática** e **bidirecional** entre Google Calendar e Notion.

Baseado nas melhores práticas dos repositórios:
- [nathan-dykstra/gcal-notion-integration](https://github.com/nathan-dykstra/gcal-notion-integration)
- [akarri2001/Notion-and-Google-Calendar-2-Way-Sync](https://github.com/akarri2001/Notion-and-Google-Calendar-2-Way-Sync)

---

## ✨ Funcionalidades

✅ **Sincronização Bidirecional**
- Mudanças no Notion → refletem no Google Calendar
- Mudanças no Google Calendar → refletem no Notion

✅ **Importação de Eventos Existentes**
- Sincroniza todos os eventos dos últimos 60 dias
- Evita duplicatas automaticamente

✅ **Links de Referência**
- Cada evento no Google Calendar contém link para o Notion
- Cada página do Notion contém ID do evento no Google Calendar

✅ **Exclusão Automática**
- Marcar como "Done" no Notion → deleta do Google Calendar

✅ **Sincronização Automática**
- Executa a cada 30 minutos via Cron Job
- Logs detalhados de todas as operações

---

## 📋 Instalação

### 1. Copiar Arquivos para VPS

```bash
# Via SCP
scp -r AGENDA/ root@31.97.165.16:/home/gcal-notion-sync/
```

### 2. Configurar .env

Na VPS, editar `.env`:

```bash
ssh root@31.97.165.16
cd /home/gcal-notion-sync

nano .env
```

**Conteúdo necessário:**
```
NOTION_TOKEN=ntn_...
NOTION_AGENDA_DB_ID=8c237fea-14d3-4104-bf88-23b4f3d04e94
GOOGLE_PROJECT_ID=agenda-roncolato
GOOGLE_SERVICE_ACCOUNT_EMAIL=agendamento-app@...
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN...
GOOGLE_CALENDAR_ID=rodrigo@rroncolato.com
```

### 3. Instalar Dependências

```bash
npm install
```

---

## 🚀 Uso

### Sincronização Manual (Uma Vez)

```bash
node AGENDA/sync-full.js
```

### Sincronização Automática (Cron Job)

```bash
bash AGENDA/setup-cron.sh
```

Isso configura:
- ✅ Execução automática a cada 30 minutos
- ✅ Logs em `/var/log/gcal-notion-sync.log`
- ✅ Sincronização em background

### Ver Logs

```bash
tail -f /var/log/gcal-notion-sync.log
```

---

## 📊 O que é Sincronizado

### Google Calendar → Notion
- ✅ Nome do evento
- ✅ Data e hora
- ✅ Descrição
- ✅ Link para o Google Calendar
- ✅ ID do evento (para referência)

### Notion → Google Calendar
- ✅ Nome da página
- ✅ Status (automaticamente como "Agendado")
- ✅ Link para a página do Notion
- ✅ Horário padrão: 10:00 AM (configurável)

---

## 🔧 Estrutura de Arquivos

```
AGENDA/
├── sync-full.js              # Script principal de sincronização
├── sync-agenda.js            # Sincronização simples (legacy)
├── test-notion.js            # Teste de conexão
├── setup-cron.sh             # Configurar cron job
├── lib/
│   ├── sync-manager.js       # Orquestrador de sincronização
│   ├── notion-manager.js     # API do Notion
│   └── google-manager.js     # API do Google Calendar
├── README-SYNC.md            # Este arquivo
└── package.json              # Dependências
```

---

## 🔍 Fluxo de Sincronização

### Fase 1: Sincronizar Deletions
- Se uma página está marcada como "Done" no Notion
- Deleta automaticamente do Google Calendar

### Fase 2: Notion → Google Calendar
- Importa eventos do Notion para o Google Calendar
- Cria links de referência

### Fase 3: Google Calendar → Notion
- Importa eventos do Google Calendar para o Notion
- Evita duplicatas

### Fase 4: Atualizar Mudanças (Notion)
- Detecta mudanças em páginas existentes
- Atualiza eventos correspondentes no Google Calendar

### Fase 5: Atualizar Mudanças (Calendar)
- Detecta mudanças em eventos existentes
- Atualiza páginas correspondentes no Notion

---

## ⚙️ Configuração Personalizada

### Alterar Intervalo de Sincronização

Editar `setup-cron.sh`:

```bash
# Mudar de 30 minutos para 15 minutos
CRON_CMD="*/15 * * * * cd $PROJECT_DIR && node AGENDA/sync-full.js >> $LOG_FILE 2>&1"
```

### Sincronizar Período Diferentes

```bash
# Sincronizar últimos 90 dias
node AGENDA/sync-full.js --periodo=90
```

---

## 🐛 Troubleshooting

### "Variáveis de ambiente faltando"
```bash
# Verificar .env
cat .env

# Deve ter: NOTION_TOKEN, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, etc
```

### "Erro ao conectar com Notion"
```bash
# Testar conexão
node AGENDA/test-notion.js
```

### "Erro ao buscar eventos do Google Calendar"
```bash
# Verificar permissões do Service Account
# Deve ter "Calendar" API habilitada no Google Cloud Console
```

### Ver Logs Detalhados
```bash
tail -50 /var/log/gcal-notion-sync.log
```

---

## 📝 Logs

Todos os eventos de sincronização são registrados em:
- **VPS:** `/var/log/gcal-notion-sync.log`
- **Local:** `/tmp/gcal-notion-sync.log`

Exemplo de log:
```
[2025-03-26T01:30:00.000Z] [INFO] 🚀 Iniciando sincronização bidirecional
[2025-03-26T01:30:00.000Z] [INFO] 📤 Sincronizando Notion → Google Calendar...
[2025-03-26T01:30:01.000Z] [INFO] ✅ [NOVO] "Reunião com cliente" criado no Google Calendar
[2025-03-26T01:30:05.000Z] [INFO] ✅ Sincronização completa!
```

---

## 🚨 Limites e Considerações

- **Google Calendar API:** 10,000 requisições/dia (limite free tier)
- **Notion API:** Rate limit de ~3 requisições/segundo
- **Sincronização:** A cada 30 minutos por padrão
- **Retenção:** Sincroniza eventos dos últimos 60 dias por padrão

---

## 📞 Suporte

Para problemas:
1. Verificar `.env` está completo
2. Rodar `test-notion.js` para testar conexão
3. Verificar logs em `/var/log/gcal-notion-sync.log`
4. Consultar documentação das APIs:
   - [Google Calendar API](https://developers.google.com/calendar/api)
   - [Notion API](https://developers.notion.com/)
