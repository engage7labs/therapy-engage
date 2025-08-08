# CosmosDB Module for Therapy Engage

## 🎯 Objetivo

Módulo Terraform para provisionar Azure CosmosDB SQL API para armazenamento de vídeos e áudios de pacientes, incluindo transcrições e análise de sentimento.

## 📦 Recursos Provisionados

### CosmosDB Account

- **Nome**: `therapyengage-cosmosdb-dev`
- **API**: Core (SQL)
- **Região**: North Europe
- **Tier**: Free Tier (quando disponível)
- **Acesso**: Público (ambiente de desenvolvimento)
- **Consistência**: Session
- **Capacidade**: EnableServerless

### Database

- **Nome**: `therapyengage`

### Container: `patient_videos`

- **Partition Key**: `/patientId`
- **TTL**: 2592000 segundos (30 dias)
- **Indexing**: Consistent com todos os paths incluídos

### Campos esperados no container:

```json
{
  "id": "unique-id",
  "patientId": "patient-123",
  "videoUrl": "https://storage.../video.mp4",
  "transcription": "Texto transcrito do áudio/vídeo",
  "sentiment": {
    "score": 0.7,
    "label": "positive",
    "confidence": 0.85
  },
  "mediaType": "video", // ou "audio"
  "createdAt": "2025-08-08T10:30:00Z",
  "_ts": 1728374400 // Timestamp automático do CosmosDB
}
```

## 🚀 Como usar

### 1. Configurar Azure CLI

```bash
az login
az account set --subscription "your-subscription-id"
```

### 2. Configurar variáveis de ambiente

```bash
# Windows PowerShell
$env:ARM_SUBSCRIPTION_ID="your-subscription-id"

# Linux/Mac
export ARM_SUBSCRIPTION_ID="your-subscription-id"
```

### 3. Executar Terraform

```bash
# Navegar para o diretório de infraestrutura
cd infra

# Inicializar (já feito)
terraform init

# Validar configuração
terraform validate

# Planejar recursos
terraform plan -var-file="environments/dev-eu-ie.tfvars"

# Aplicar recursos (quando pronto)
terraform apply -var-file="environments/dev-eu-ie.tfvars"
```

### 4. Validar no Azure

```bash
# Verificar a conta CosmosDB
az cosmosdb show --name therapyengage-cosmosdb-dev --resource-group rg-therapy-dev

# Listar databases
az cosmosdb sql database list --account-name therapyengage-cosmosdb-dev --resource-group rg-therapy-dev

# Listar containers
az cosmosdb sql container list --account-name therapyengage-cosmosdb-dev --database-name therapyengage --resource-group rg-therapy-dev
```

## 🔐 Segurança

### Chaves de Acesso

- **Primary Key**: Disponível via output `primary_key` (sensível)
- **Endpoint**: Disponível via output `endpoint`

### Integração futura com Key Vault

As chaves serão migradas para Azure Key Vault em versões futuras para maior segurança.

## 📊 Outputs do Módulo

| Output           | Descrição                        |
| ---------------- | -------------------------------- |
| `endpoint`       | URL do endpoint CosmosDB         |
| `account_name`   | Nome da conta CosmosDB           |
| `primary_key`    | Chave primária (sensível)        |
| `database_name`  | Nome da database                 |
| `container_name` | Nome do container patient_videos |

## 🏷️ Tags Aplicadas

```hcl
tags = {
  environment = "dev"
  project     = "therapy-engage"
  region      = "eu-ie"
  compliance  = "gdpr"
}
```

## 🧠 Casos de Uso

### Funcionalidade: "Paciente grava relato diário"

1. **Upload de mídia**: Paciente faz upload de vídeo ou áudio
2. **Transcrição**: Serviço converte áudio em texto
3. **Análise de sentimento**: IA analisa o humor/estado emocional
4. **Armazenamento**: Dados são salvos no container `patient_videos`
5. **TTL automático**: Registros são limpos após 30 dias

### Exemplo de consulta

```sql
-- Buscar todos os vídeos de um paciente
SELECT * FROM c WHERE c.patientId = "patient-123"

-- Buscar por tipo de mídia
SELECT * FROM c WHERE c.mediaType = "video"

-- Buscar sentimentos positivos
SELECT * FROM c WHERE c.sentiment.label = "positive"
```

## ⚠️ Importante

- **Não expor chaves**: Nunca commitar chaves de acesso no repositório
- **Ambiente DEV**: Este módulo é configurado para desenvolvimento
- **Free Tier**: Limitações de throughput e storage se aplicam
- **GDPR**: TTL de 30 dias ajuda com compliance de retenção de dados
