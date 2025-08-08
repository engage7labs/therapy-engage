# Azure OpenAI Model Deployment Script (PowerShell)
# Este script deploya os modelos necessários no Azure OpenAI após a criação do recurso via Terraform

param(
    [string]$SubscriptionId = $env:AZURE_SUBSCRIPTION_ID,
    [string]$ResourceGroup = "therapyengage-dev",
    [string]$AzureOpenAIName = "therapyengage-openai-dev"
)

# Verificar parâmetros
if (-not $SubscriptionId) {
    Write-Error "SubscriptionId é obrigatório. Defina AZURE_SUBSCRIPTION_ID ou passe como parâmetro."
    exit 1
}

Write-Host "🚀 Iniciando deployment de modelos Azure OpenAI..." -ForegroundColor Green

# Verificar se Azure CLI está instalado
try {
    az --version | Out-Null
} catch {
    Write-Error "Azure CLI não está instalado. Instale via: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

# Verificar login
try {
    az account show | Out-Null
} catch {
    Write-Error "Não está logado no Azure. Execute 'az login' primeiro."
    exit 1
}

# Definir subscription
az account set --subscription $SubscriptionId
Write-Host "✅ Usando subscription: $SubscriptionId" -ForegroundColor Green

# Verificar se o recurso existe
try {
    az cognitiveservices account show --name $AzureOpenAIName --resource-group $ResourceGroup | Out-Null
    Write-Host "✅ Recurso Azure OpenAI encontrado: $AzureOpenAIName" -ForegroundColor Green
} catch {
    Write-Error "Recurso Azure OpenAI '$AzureOpenAIName' não encontrado no grupo '$ResourceGroup'."
    Write-Error "Execute 'terraform apply' primeiro para criar o recurso."
    exit 1
}

# Função para deployar modelo
function Deploy-Model {
    param(
        [string]$ModelName,
        [string]$DeploymentName,
        [string]$ModelVersion,
        [int]$SkuCapacity
    )
    
    Write-Host "📦 Deployando modelo: $ModelName ($DeploymentName)" -ForegroundColor Cyan
    
    # Verificar se já existe
    try {
        az cognitiveservices account deployment show `
            --name $AzureOpenAIName `
            --resource-group $ResourceGroup `
            --deployment-name $DeploymentName | Out-Null
        Write-Host "⚠️  Deployment '$DeploymentName' já existe. Pulando..." -ForegroundColor Yellow
        return $true
    } catch {
        # Deployment não existe, prosseguir
    }
    
    # Criar deployment
    try {
        az cognitiveservices account deployment create `
            --name $AzureOpenAIName `
            --resource-group $ResourceGroup `
            --deployment-name $DeploymentName `
            --model-name $ModelName `
            --model-version $ModelVersion `
            --model-format "OpenAI" `
            --sku-name "Standard" `
            --sku-capacity $SkuCapacity | Out-Null
        Write-Host "✅ Deployment '$DeploymentName' criado com sucesso" -ForegroundColor Green
        return $true
    } catch {
        Write-Error "❌ Falha ao criar deployment '$DeploymentName': $($_.Exception.Message)"
        return $false
    }
}

# Deployar modelos
Write-Host "`n🤖 Iniciando deployment dos modelos..." -ForegroundColor Blue

# GPT-4 para análise de sentimentos
Deploy-Model -ModelName "gpt-4" -DeploymentName "gpt-4" -ModelVersion "0613" -SkuCapacity 1

# GPT-4 Turbo (opcional)
Deploy-Model -ModelName "gpt-4" -DeploymentName "gpt-4-turbo" -ModelVersion "turbo-2024-04-09" -SkuCapacity 1

# GPT-3.5 Turbo como fallback
Deploy-Model -ModelName "gpt-35-turbo" -DeploymentName "gpt-35-turbo" -ModelVersion "0125" -SkuCapacity 1

# Verificar se Whisper está disponível
$availableModels = az cognitiveservices account model list `
    --name $AzureOpenAIName `
    --resource-group $ResourceGroup `
    --query "[?name=='whisper-1']" -o tsv

if ($availableModels -match "whisper-1") {
    Write-Host "🎙️  Modelo Whisper disponível, deployando..." -ForegroundColor Cyan
    Deploy-Model -ModelName "whisper-1" -DeploymentName "whisper-1" -ModelVersion "001" -SkuCapacity 1
} else {
    Write-Host "⚠️  Modelo Whisper não disponível nesta região. Use OpenAI.com para transcrição." -ForegroundColor Yellow
}

Write-Host "`n🎉 Deployment de modelos concluído!" -ForegroundColor Green

# Mostrar deployments
Write-Host "`n📋 Deployments disponíveis:" -ForegroundColor Blue
az cognitiveservices account deployment list `
    --name $AzureOpenAIName `
    --resource-group $ResourceGroup `
    --query "[].{Name:name, Model:properties.model.name, Version:properties.model.version, Status:properties.provisioningState}" `
    --output table

# Obter configurações
$endpoint = az cognitiveservices account show `
    --name $AzureOpenAIName `
    --resource-group $ResourceGroup `
    --query "properties.endpoint" `
    --output tsv

Write-Host "`n🔧 Configuração para o backend:" -ForegroundColor Blue
Write-Host "AZURE_OPENAI_ENDPOINT=$endpoint" -ForegroundColor White
Write-Host "AZURE_OPENAI_DEPLOYMENT=gpt-4" -ForegroundColor White
Write-Host "AZURE_OPENAI_API_VERSION=2024-02-15-preview" -ForegroundColor White
Write-Host "# AZURE_OPENAI_API_KEY=<obtido do Azure Portal ou via Azure CLI>" -ForegroundColor Gray

Write-Host "`n🔑 Para obter a API key, execute:" -ForegroundColor Blue
Write-Host "az cognitiveservices account keys list --name $AzureOpenAIName --resource-group $ResourceGroup" -ForegroundColor White

Write-Host "`n✨ Script concluído com sucesso!" -ForegroundColor Green
