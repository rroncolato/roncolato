#!/bin/bash
#
# Loop de Sincronização Contínua: Reuniões
# Executa sincronização a cada 60 segundos
#

PROJECT_DIR="/home/gcal-notion-sync"
LOG_FILE="/var/log/gcal-notion-sync-reunioes.log"

# Criar diretório de logs se não existir
mkdir -p /var/log

echo "🚀 Iniciando loop de sincronização (60 segundos)..."
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 Loop iniciado" >> $LOG_FILE

while true; do
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Iniciando sincronização de Reuniões..." >> $LOG_FILE
  cd $PROJECT_DIR && node AGENDA/sync-reunioes-completo.js >> $LOG_FILE 2>&1
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Sincronização concluída. Próxima em 60 segundos..." >> $LOG_FILE
  sleep 60
done
