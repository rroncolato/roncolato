#!/bin/bash
#
# Setup de Sincronização Automática (Cron Job)
# Executa sincronização a cada 30 minutos
#

PROJECT_DIR="/home/gcal-notion-sync"
LOG_FILE="/var/log/gcal-notion-sync.log"

# Criar diretório de logs se não existir
mkdir -p /var/log

# Função para sincronizar
sync_agenda() {
  cd $PROJECT_DIR
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Iniciando sincronização..." >> $LOG_FILE
  node AGENDA/sync-full.js >> $LOG_FILE 2>&1
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Sincronização concluída" >> $LOG_FILE
}

# Adicionar cron job (executar a cada 30 minutos)
CRON_CMD="*/30 * * * * cd $PROJECT_DIR && node AGENDA/sync-full.js >> $LOG_FILE 2>&1"

# Verificar se já existe
if crontab -l 2>/dev/null | grep -q "AGENDA/sync-full.js"; then
  echo "✅ Cron job já configurado"
else
  # Adicionar novo cron job
  (crontab -l 2>/dev/null || true; echo "$CRON_CMD") | crontab -
  echo "✅ Cron job configurado para executar a cada 30 minutos"
  echo "📝 Log: $LOG_FILE"
fi

# Executar sincronização uma vez imediatamente
echo "🚀 Executando sincronização inicial..."
sync_agenda

echo "✅ Setup concluído!"
