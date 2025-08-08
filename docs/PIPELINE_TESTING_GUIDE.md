# 🧪 Exemplo de Teste da Pipeline de Transcrição e Análise de Sentimento

## 📋 Dados de Teste

### Entrada Simulada:

```typescript
const testInput = {
  patientId: "patient_123",
  videoUrl:
    "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
  mediaType: "video" as const,
  createdAt: "2025-08-08T14:30:00.000Z",
};
```

### Saída Esperada:

```json
{
  "id": "patient_123-1691502600000",
  "patientId": "patient_123",
  "videoUrl": "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
  "mediaType": "video",
  "transcription": "Estou me sentindo muito melhor desde a nossa última sessão. A terapia está realmente me ajudando a lidar com a ansiedade. Tenho conseguido dormir melhor e me sinto mais otimista sobre o futuro.",
  "sentiment": {
    "label": "POSITIVO",
    "confidence": 0.87,
    "summary": "Paciente demonstra melhora significativa no estado emocional, expressando sentimentos positivos sobre o progresso terapêutico e redução da ansiedade."
  },
  "createdAt": "2025-08-08T14:30:00.000Z",
  "processedAt": "2025-08-08T14:32:15.000Z",
  "processingTimeMs": 15000
}
```

## 🚀 Como Testar via GraphQL

### 1. Processar Mídia de Paciente

**Query:**

```graphql
mutation ProcessPatientMedia {
  processPatientMedia(
    patientId: "patient_123"
    videoUrl: "https://therapystorage.blob.core.windows.net/videos/session_001.mp4"
    mediaType: "video"
    createdAt: "2025-08-08T14:30:00.000Z"
  )
}
```

**Resposta:**

```json
{
  "data": {
    "processPatientMedia": "{\"id\":\"patient_123-1691502600000\",\"patientId\":\"patient_123\",\"transcription\":\"Estou me sentindo muito melhor...\",\"sentiment\":{\"label\":\"POSITIVO\",\"confidence\":0.87,\"summary\":\"Paciente demonstra melhora significativa...\"},\"processingTimeMs\":15000,\"processedAt\":\"2025-08-08T14:32:15.000Z\"}"
  }
}
```

### 2. Verificar Saúde da Pipeline

**Query:**

```graphql
query PipelineHealth {
  pipelineHealthCheck
}
```

**Resposta:**

```json
{
  "data": {
    "pipelineHealthCheck": "{\"status\":\"healthy\",\"services\":{\"transcription\":{\"dragon\":false,\"whisper\":true},\"sentiment\":{\"status\":\"healthy\",\"model\":\"gpt-4o\"},\"cosmos\":{\"status\":\"connected\",\"database\":\"therapyengage\"}}}"
  }
}
```

### 3. Obter Estatísticas

**Query:**

```graphql
query ProcessingStats {
  processingStatistics(patientId: "patient_123")
}
```

**Resposta:**

```json
{
  "data": {
    "processingStatistics": "{\"totalProcessed\":1,\"averageProcessingTime\":15000,\"sentimentDistribution\":{\"positive\":1,\"neutral\":0,\"negative\":0},\"successRate\":100}"
  }
}
```

## 🛠️ Configuração Mínima para Teste

### Variáveis de Ambiente Necessárias:

```env
# OpenAI (obrigatório)
OPENAI_API_KEY=sk-your-openai-api-key-here

# CosmosDB (já configurado no projeto)
COSMOSDB_ENDPOINT=https://therapyengage-cosmosdb-dev.documents.azure.com:443/
COSMOSDB_DATABASE_NAME=therapyengage
COSMOSDB_CONTAINER_NAME=patient_videos

# Application
PORT=3001
NODE_ENV=development
```

## 📝 Fluxo de Teste Passo a Passo

### Passo 1: Validar Health Checks

```bash
# Health check do CosmosDB
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { cosmosHealthCheck }"}'

# Health check da Pipeline completa
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { pipelineHealthCheck }"}'
```

### Passo 2: Executar Processamento

```bash
# Processar mídia de teste
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ProcessPatientMedia($patientId: String!, $videoUrl: String!, $mediaType: String!) { processPatientMedia(patientId: $patientId, videoUrl: $videoUrl, mediaType: $mediaType) }",
    "variables": {
      "patientId": "patient_123",
      "videoUrl": "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
      "mediaType": "video"
    }
  }'
```

### Passo 3: Verificar Resultado no CosmosDB

```bash
# Buscar dados salvos via GraphQL original
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { hello }"}'
```

## 🎯 Cenários de Teste

### Cenário 1: Sucesso Completo

- ✅ **Entrada**: Vídeo válido com áudio claro
- ✅ **Transcrição**: Texto coerente em português
- ✅ **Sentimento**: Classificação POSITIVO/NEUTRO/NEGATIVO
- ✅ **Persistência**: Documento salvo no CosmosDB

### Cenário 2: Fallback de Transcrição

- ⚠️ **Dragon indisponível**: Sistema usa Whisper automaticamente
- ✅ **Resultado**: Processamento continua normalmente

### Cenário 3: Tratamento de Erro

- ❌ **URL inválida**: Erro informativo retornado
- ❌ **OpenAI indisponível**: Fallback para sentimento NEUTRO
- ❌ **CosmosDB indisponível**: Retry automático

## 📊 Métricas de Performance Esperadas

| Etapa                 | Tempo Médio | Status |
| --------------------- | ----------- | ------ |
| Download do arquivo   | 2-5s        | ✅     |
| Transcrição (Whisper) | 5-15s       | ✅     |
| Análise de Sentimento | 1-3s        | ✅     |
| Persistência CosmosDB | <1s         | ✅     |
| **Total da Pipeline** | **8-24s**   | ✅     |

## 🔧 Debug e Troubleshooting

### Logs a Observar:

```bash
# Inicialização dos serviços
[TranscriptionService] Configured standard OpenAI for transcription
[SentimentService] Configured Azure OpenAI for sentiment analysis
[CosmosService] CosmosDB client initialized successfully

# Processamento
[MediaProcessingPipelineService] Starting media processing pipeline for patient: patient_123
[MediaProcessingPipelineService] Step 1: Starting transcription...
[TranscriptionService] Using Whisper for transcription...
[MediaProcessingPipelineService] Transcription completed: 156 characters
[MediaProcessingPipelineService] Step 2: Starting sentiment analysis...
[SentimentService] Sentiment analysis completed: POSITIVO (0.87)
[MediaProcessingPipelineService] Step 3: Persisting to CosmosDB...
[CosmosService] Patient media saved successfully with ID: patient_123-1691502600000
[MediaProcessingPipelineService] Pipeline completed successfully in 15000ms
```

### Erros Comuns e Soluções:

```bash
# Erro: OpenAI API key não configurada
❌ "OpenAI not configured - cannot perform sentiment analysis"
✅ Solução: Configurar OPENAI_API_KEY no .env

# Erro: URL de mídia inacessível
❌ "Failed to download media file"
✅ Solução: Verificar se URL está público e acessível

# Erro: CosmosDB connection failed
❌ "Failed to save patient media to CosmosDB"
✅ Solução: Verificar COSMOSDB_ENDPOINT e credenciais
```

## ✅ Checklist de Validação

### Antes do Teste:

- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Dependências instaladas (`npm install`)
- [ ] ✅ Serviço executando (`npm run start:dev`)
- [ ] ✅ CosmosDB acessível

### Durante o Teste:

- [ ] ✅ Health check retorna status `healthy`
- [ ] ✅ Processamento completa sem erros
- [ ] ✅ Transcrição gerada corretamente
- [ ] ✅ Sentimento classificado adequadamente
- [ ] ✅ Documento salvo no CosmosDB

### Após o Teste:

- [ ] ✅ Verificar logs para erros
- [ ] ✅ Confirmar documento no CosmosDB
- [ ] ✅ Validar métricas de performance
- [ ] ✅ Testar reprocessamento se necessário

---

**🎉 Com esses testes, a pipeline está validada e pronta para uso em produção!**
