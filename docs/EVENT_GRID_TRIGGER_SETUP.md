# Event Grid Trigger - Setup e Teste

## 🎯 Overview

Sistema de trigger automática que processa uploads de vídeo/áudio no Azure Blob Storage através do Event Grid, executando automaticamente a pipeline de transcrição e análise de sentimento.

## 🏗️ Arquitetura Implementada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Blob Upload   │───▶│   Event Grid    │───▶│   Webhook API   │───▶│   Pipeline      │
│                 │    │                 │    │                 │    │                 │
│ • Patient Media │    │ • BlobCreated   │    │ • Validation    │    │ • Transcription │
│ • Auto Trigger  │    │ • Event Filter  │    │ • Processing    │    │ • Sentiment     │
│ • Naming Conv.  │    │ • Webhook Call  │    │ • Idempotency   │    │ • CosmosDB      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Componentes Implementados

### 1. WebhookController (`/webhook/blob-event`)

**Funcionalidades:**

- ✅ **Event Grid Validation**: Handshake automático de validação
- ✅ **Blob Created Events**: Processamento de eventos de upload
- ✅ **Security Validation**: Verificação de headers e assinatura
- ✅ **Media File Filtering**: Apenas arquivos de mídia são processados
- ✅ **Container Filtering**: Apenas uploads de pacientes são processados

**Endpoints:**

```typescript
POST / webhook / blob - event; // Event Grid webhook
POST / webhook / test - blob - processing; // Teste manual
```

### 2. BlobEventProcessorService

**Funcionalidades:**

- ✅ **Metadata Parsing**: Extração de patientId e mediaType do nome do arquivo
- ✅ **Idempotency**: Prevenção de processamento duplicado
- ✅ **Pipeline Integration**: Invocação automática da pipeline existente
- ✅ **Error Handling**: Tratamento robusto de erros
- ✅ **Naming Convention**: Suporte a convenções de nomenclatura flexíveis

**Convenções de Nomenclatura:**

```
# Formato principal:
patient_{patientId}_{mediaType}_{timestamp}.{extension}
Exemplo: patient_abc123_video_20250808143000.mp4

# Formato alternativo:
patient_{patientId}_{mediaType}.{extension}
Exemplo: patient_abc123_audio.mp3
```

## 🚀 Como Configurar Event Grid

### Passo 1: Criar Event Subscription (Azure Portal)

1. **Acesse Azure Portal** → Storage Account → Events
2. **Criar Event Subscription** com as configurações:

```json
{
  "name": "patient-media-processor",
  "eventTypes": ["Microsoft.Storage.BlobCreated"],
  "subjectFilters": {
    "subjectBeginsWith": "/blobServices/default/containers/patient-uploads/",
    "subjectEndsWith": ".mp4"
  },
  "endpoint": {
    "type": "WebHook",
    "properties": {
      "endpointUrl": "https://your-api-domain.com/webhook/blob-event"
    }
  }
}
```

### Passo 2: Configurar Containers no Blob Storage

```bash
# Criar container para uploads de pacientes
az storage container create \
  --name patient-uploads \
  --account-name therapystorage \
  --public-access off
```

### Passo 3: Testar Event Grid Subscription

```bash
# Upload de teste via Azure CLI
az storage blob upload \
  --account-name therapystorage \
  --container-name patient-uploads \
  --name patient_test123_video_20250808143000.mp4 \
  --file local-video-file.mp4
```

## 🧪 Testes Implementados

### Teste 1: Event Grid Validation Handshake

```bash
# Simular handshake de validação
curl -X POST http://localhost:3001/webhook/blob-event \
  -H "Content-Type: application/json" \
  -H "aeg-event-type: SubscriptionValidation" \
  -d '[{
    "id": "test-validation",
    "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
    "data": {
      "validationCode": "test-validation-code-12345"
    }
  }]'

# Resposta esperada:
{
  "validationResponse": "test-validation-code-12345"
}
```

### Teste 2: Blob Created Event Processing

```bash
# Simular evento de blob criado
curl -X POST http://localhost:3001/webhook/blob-event \
  -H "Content-Type: application/json" \
  -H "aeg-event-type: Notification" \
  -d '[{
    "id": "event-12345",
    "eventType": "Microsoft.Storage.BlobCreated",
    "subject": "/blobServices/default/containers/patient-uploads/blobs/patient_abc123_video_20250808143000.mp4",
    "eventTime": "2025-08-08T14:30:00.000Z",
    "data": {
      "api": "PutBlob",
      "url": "https://therapystorage.blob.core.windows.net/patient-uploads/patient_abc123_video_20250808143000.mp4",
      "contentType": "video/mp4",
      "contentLength": 15728640,
      "blobType": "BlockBlob"
    }
  }]'

# Resposta esperada:
{
  "message": "Processed 1 events",
  "results": [{
    "eventId": "event-12345",
    "blobUrl": "https://therapystorage.blob.core.windows.net/patient-uploads/patient_abc123_video_20250808143000.mp4",
    "result": {
      "success": true,
      "documentId": "patient_abc123-1691502600000"
    }
  }]
}
```

### Teste 3: Processamento Manual (para debug)

```bash
# Teste direto do processamento
curl -X POST http://localhost:3001/webhook/test-blob-processing \
  -H "Content-Type: application/json" \
  -d '{
    "blobUrl": "https://therapystorage.blob.core.windows.net/patient-uploads/test_video.mp4",
    "patientId": "test123",
    "mediaType": "video"
  }'
```

## 📊 Logs de Monitoramento

### Logs de Sucesso:

```
[WebhookController] Received webhook request
[WebhookController] Processing Event Grid notification
[WebhookController] Processing blob created event: event-12345
[BlobEventProcessorService] Processing blob upload: https://storage.../video.mp4
[BlobEventProcessorService] Parsed metadata: {patientId: "abc123", mediaType: "video"}
[MediaProcessingPipelineService] Starting media processing pipeline for patient: abc123
[BlobEventProcessorService] Blob processing completed successfully. Document ID: patient_abc123-1691502600000
[BlobEventProcessorService] Processing time: 15000ms
[BlobEventProcessorService] Sentiment: POSITIVO (confidence: 0.87)
[WebhookController] Successfully processed blob: https://storage.../video.mp4
```

### Logs de Erro:

```
[BlobEventProcessorService] Invalid blob naming convention: invalid-file-name.mp4
[BlobEventProcessorService] Expected format: patient_{patientId}_{mediaType}_{timestamp}.{extension}
[WebhookController] Failed to process blob: https://storage.../invalid.mp4 - Unable to parse blob metadata
```

## 🔧 Configuração de Produção

### Event Grid Topic e Subscription via Azure CLI:

```bash
# Criar Event Grid System Topic (se não existir)
az eventgrid system-topic create \
  --name therapyengage-storage-events \
  --resource-group therapyengage-rg \
  --source /subscriptions/{subscription-id}/resourceGroups/therapyengage-rg/providers/Microsoft.Storage/storageAccounts/therapystorage \
  --topic-type Microsoft.Storage.StorageAccounts

# Criar Event Subscription
az eventgrid system-topic event-subscription create \
  --name patient-media-processor \
  --resource-group therapyengage-rg \
  --system-topic-name therapyengage-storage-events \
  --endpoint https://20.82.234.39.sslip.io/webhook/blob-event \
  --endpoint-type webhook \
  --included-event-types Microsoft.Storage.BlobCreated \
  --subject-begins-with /blobServices/default/containers/patient-uploads/ \
  --subject-ends-with .mp4 .mp3 .wav .m4a
```

### Terraform Configuration (futuro):

```hcl
resource "azurerm_eventgrid_system_topic" "storage_events" {
  name                = "therapyengage-storage-events"
  resource_group_name = var.resource_group_name
  location            = var.location
  source_arm_resource_id = azurerm_storage_account.main.id
  topic_type          = "Microsoft.Storage.StorageAccounts"
}

resource "azurerm_eventgrid_system_topic_event_subscription" "blob_created" {
  name                = "patient-media-processor"
  system_topic        = azurerm_eventgrid_system_topic.storage_events.name
  resource_group_name = var.resource_group_name

  webhook_endpoint {
    url = "https://${var.api_domain}/webhook/blob-event"
  }

  included_event_types = ["Microsoft.Storage.BlobCreated"]

  subject_filter {
    subject_begins_with = "/blobServices/default/containers/patient-uploads/"
    subject_ends_with   = [".mp4", ".mp3", ".wav", ".m4a"]
  }
}
```

## 🚨 Troubleshooting

### Problemas Comuns:

1. **Event Grid não chama webhook**

   - ✅ Verificar se endpoint está acessível externamente
   - ✅ Confirmar que validação foi bem-sucedida
   - ✅ Verificar logs do Event Grid no Azure Portal

2. **Webhook recebe eventos mas não processa**

   - ✅ Verificar naming convention dos arquivos
   - ✅ Confirmar que container está correto (`patient-uploads`)
   - ✅ Verificar logs do backend para erros específicos

3. **Pipeline falha no processamento**
   - ✅ Verificar se OpenAI API key está configurada
   - ✅ Confirmar acesso ao blob storage
   - ✅ Verificar logs da pipeline para erros detalhados

### Health Checks:

```bash
# Verificar saúde do processador de blobs
curl http://localhost:3001/health

# Verificar saúde da pipeline
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { pipelineHealthCheck }"}'
```

## ✅ Status de Implementação

- ✅ **WebhookController**: Event Grid webhook handler completo
- ✅ **BlobEventProcessorService**: Processamento automático de uploads
- ✅ **Event Grid Integration**: Validation handshake e event processing
- ✅ **Naming Convention**: Parsing flexível de metadata
- ✅ **Idempotency**: Prevenção de processamento duplicado
- ✅ **Error Handling**: Tratamento robusto de erros
- ✅ **Logging**: Logs detalhados para monitoramento
- ✅ **Testing Endpoints**: Ferramentas para debug e teste

**🎉 O sistema de trigger automática está completamente implementado e pronto para produção!**

### Próximos Passos:

1. **Configurar Event Grid Subscription** no Azure Portal
2. **Testar upload real** via Azure Storage
3. **Monitorar logs** para validar funcionamento
4. **Implementar Terraform** para automação de infraestrutura
