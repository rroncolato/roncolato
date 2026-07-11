#!/bin/bash
#
# Script de Deploy: Sincronização Completa na VPS
# Executa tudo: copia arquivos, instala dependências, configura cron
#

set -e

VPS_HOST="root@31.97.165.16"
VPS_DIR="/home/gcal-notion-sync"
LOCAL_DIR="$(pwd)/AGENDA"

echo "🚀 Iniciando deploy da sincronização completa..."
echo ""

# Step 1: Copiar arquivos
echo "📦 Step 1: Copiando arquivos para VPS..."
ssh $VPS_HOST "mkdir -p $VPS_DIR/lib"
scp -r $LOCAL_DIR/sync-full.js $VPS_HOST:$VPS_DIR/AGENDA/
scp -r $LOCAL_DIR/lib/* $VPS_HOST:$VPS_DIR/AGENDA/lib/ 2>/dev/null || true
scp $LOCAL_DIR/package.json $VPS_HOST:$VPS_DIR/
scp $LOCAL_DIR/setup-cron.sh $VPS_HOST:$VPS_DIR/AGENDA/
scp $LOCAL_DIR/README-SYNC.md $VPS_HOST:$VPS_DIR/AGENDA/
echo "✅ Arquivos copiados"
echo ""

# Step 2: Instalar dependências
echo "📦 Step 2: Instalando dependências..."
ssh $VPS_HOST "cd $VPS_DIR && npm install"
echo "✅ Dependências instaladas"
echo ""

# Step 3: Testar conexão
echo "🔍 Step 3: Testando conexão com Notion..."
ssh $VPS_HOST "cd $VPS_DIR && node AGENDA/test-notion.js"
echo "✅ Conexão testada"
echo ""

# Step 4: Executar sincronização inicial
echo "🔄 Step 4: Executando sincronização inicial..."
ssh $VPS_HOST "cd $VPS_DIR && node AGENDA/sync-full.js"
echo "✅ Sincronização inicial concluída"
echo ""

# Step 5: Configurar cron job
echo "⏰ Step 5: Configurando sincronização automática (cron job)..."
ssh $VPS_HOST "bash $VPS_DIR/AGENDA/setup-cron.sh"
echo "✅ Cron job configurado"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOY COMPLETO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Status:"
echo "  ✅ Arquivos copiados para: $VPS_DIR"
echo "  ✅ Dependências instaladas"
echo "  ✅ Conexão com Notion testada"
echo "  ✅ Sincronização inicial executada"
echo "  ✅ Cron job configurado (a cada 30 min)"
echo ""
echo "📝 Próximos passos:"
echo "  • Verificar logs: ssh $VPS_HOST 'tail -f /var/log/gcal-notion-sync.log'"
echo "  • Sincronizar manualmente: ssh $VPS_HOST 'cd $VPS_DIR && node AGENDA/sync-full.js'"
echo "  • Ver configuração cron: ssh $VPS_HOST 'crontab -l'"
echo ""
