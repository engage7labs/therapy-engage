#!/bin/bash

# Azure OpenAI Model Deployment Script
# Este script deploya os modelos necessários no Azure OpenAI após a criação do recurso via Terraform

set -e

# Configurações
RESOURCE_GROUP="therapyengage-dev"
AZURE_OPENAI_NAME="therapyengage-openai-dev"
SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID}"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está logado no Azure
if ! az account show &> /dev/null; then
    error "Você não está logado no Azure. Execute 'az login' primeiro."
    exit 1
fi

# Verificar se a subscription está definida
if [ -z "$SUBSCRIPTION_ID" ]; then
    error "AZURE_SUBSCRIPTION_ID não está definido. Defina a variável de ambiente ou passe como parâmetro."
    exit 1
fi

# Definir subscription
az account set --subscription "$SUBSCRIPTION_ID"
log "Usando subscription: $SUBSCRIPTION_ID"

# Verificar se o recurso Azure OpenAI existe
if ! az cognitiveservices account show --name "$AZURE_OPENAI_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    error "Recurso Azure OpenAI '$AZURE_OPENAI_NAME' não encontrado no grupo '$RESOURCE_GROUP'."
    error "Execute 'terraform apply' primeiro para criar o recurso."
    exit 1
fi

log "Recurso Azure OpenAI encontrado: $AZURE_OPENAI_NAME"

# Função para deployar modelo
deploy_model() {
    local model_name=$1
    local deployment_name=$2
    local model_version=$3
    local sku_capacity=$4
    
    log "Deployando modelo: $model_name ($deployment_name)"
    
    # Verificar se o deployment já existe
    if az cognitiveservices account deployment show \
        --name "$AZURE_OPENAI_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --deployment-name "$deployment_name" &> /dev/null; then
        warn "Deployment '$deployment_name' já existe. Pulando..."
        return 0
    fi
    
    # Criar o deployment
    if az cognitiveservices account deployment create \
        --name "$AZURE_OPENAI_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --deployment-name "$deployment_name" \
        --model-name "$model_name" \
        --model-version "$model_version" \
        --model-format "OpenAI" \
        --sku-name "Standard" \
        --sku-capacity "$sku_capacity"; then
        log "✅ Deployment '$deployment_name' criado com sucesso"
    else
        error "❌ Falha ao criar deployment '$deployment_name'"
        return 1
    fi
}

# Deployar modelos necessários
log "Iniciando deployment dos modelos..."

# GPT-4 para análise de sentimentos
deploy_model "gpt-4" "gpt-4" "0613" 1

# GPT-4 Turbo (opcional, mais rápido)
deploy_model "gpt-4" "gpt-4-turbo" "turbo-2024-04-09" 1

# GPT-3.5 Turbo como fallback
deploy_model "gpt-35-turbo" "gpt-35-turbo" "0125" 1

# Whisper para transcrição (se disponível)
if az cognitiveservices account model list \
    --name "$AZURE_OPENAI_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "[?name=='whisper-1']" -o tsv | grep -q whisper-1; then
    log "Modelo Whisper disponível, deployando..."
    deploy_model "whisper-1" "whisper-1" "001" 1
else
    warn "Modelo Whisper não disponível nesta região. Use OpenAI.com para transcrição."
fi

log "🎉 Deployment de modelos concluído!"

# Mostrar deployments criados
log "Deployments disponíveis:"
az cognitiveservices account deployment list \
    --name "$AZURE_OPENAI_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "[].{Name:name, Model:properties.model.name, Version:properties.model.version, Status:properties.provisioningState}" \
    --output table

# Obter endpoint e chaves
ENDPOINT=$(az cognitiveservices account show \
    --name "$AZURE_OPENAI_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.endpoint" \
    --output tsv)

log "🔧 Configuração para o backend:"
echo
echo "AZURE_OPENAI_ENDPOINT=$ENDPOINT"
echo "AZURE_OPENAI_DEPLOYMENT=gpt-4"
echo "AZURE_OPENAI_API_VERSION=2024-02-15-preview"
echo "# AZURE_OPENAI_API_KEY=<obtido do Azure Portal ou via Azure CLI>"
echo

log "Para obter a API key, execute:"
echo "az cognitiveservices account keys list --name $AZURE_OPENAI_NAME --resource-group $RESOURCE_GROUP"
