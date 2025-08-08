# Pipeline de Transcrição e Análise de Sentimento

## 🎯 Visão Geral

A pipeline implementa um sistema completo de processamento de mídia para análise terapêutica, incluindo:

1. **Transcrição Automática** (Dragon SDK ou Whisper)
2. **Análise de Sentimento** (Azure OpenAI GPT-4o)
3. **Persistência no CosmosDB**
4. **API GraphQL** para integração

## 🏗️ Arquitetura da Pipeline

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Input Media   │───▶│   Transcription │───▶│   Sentiment     │───▶│   CosmosDB      │
│                 │    │                 │    │   Analysis      │    │   Storage       │
│ • Video/Audio   │    │ • Dragon API    │    │ • GPT-4o        │    │ • Patient Data  │
│ • Patient ID    │    │ • Whisper       │    │ • Clinical      │    │ • Transcripts   │
│ • Blob URL      │    │ • Text Output   │    │ • Portuguese    │    │ • Sentiment     │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Funcionalidades Implementadas

### 1. Serviço de Transcrição (`TranscriptionService`)

**Características:**

- **Preferência**: Dragon Speech API (contexto clínico)
- **Fallback**: OpenAI Whisper
- **Formatos suportados**: MP3, MP4, WAV
- **Linguagens**: Português (pt-BR), Inglês (en-US)

**Métodos principais:**

```typescript
// Transcrição principal
async transcribeMedia(mediaUrl: string, mediaType: 'audio' | 'video'): Promise<TranscriptionResult>

// Health check
async healthCheck(): Promise<{ dragon: boolean; whisper: boolean }>
```

### 2. Serviço de Análise de Sentimento (`SentimentService`)

**Características:**

- **Modelo**: GPT-4o (Azure OpenAI ou Standard OpenAI)
- **Contexto**: Análise clínica especializada
- **Output**: JSON estruturado com label, confidence, summary
- **Classificação**: POSITIVO, NEUTRO, NEGATIVO

**Métodos principais:**

```typescript
// Análise individual
async analyzeSentiment(transcription: string): Promise<SentimentResult>

// Análise em lote
async analyzeBatchSentiment(transcriptions: string[]): Promise<SentimentResult[]>

// Estatísticas
getSentimentStatistics(sentiments: SentimentResult[]): SentimentStats
```

### 3. Serviço da Pipeline (`MediaProcessingPipelineService`)

**Características:**

- **Orquestração**: Coordena todos os serviços
- **Error Handling**: Tratamento robusto de erros
- **Monitoring**: Métricas de performance
- **Batch Processing**: Processamento em lote

**Métodos principais:**

```typescript
// Processamento principal
async processMedia(input: PipelineInput): Promise<PipelineResult>

// Processamento em lote
async processBatchMedia(inputs: PipelineInput[]): Promise<PipelineResult[]>

// Health check completo
async getHealthStatus(): Promise<HealthStatus>
```

## 📋 API GraphQL

### Mutations

#### 1. Processar Mídia Individual

```graphql
mutation ProcessPatientMedia(
  $patientId: String!
  $videoUrl: String!
  $mediaType: String!
  $createdAt: String
) {
  processPatientMedia(
    patientId: $patientId
    videoUrl: $videoUrl
    mediaType: $mediaType
    createdAt: $createdAt
  )
}
```

**Exemplo de uso:**

```graphql
mutation {
  processPatientMedia(
    patientId: "patient_123"
    videoUrl: "https://therapystorage.blob.core.windows.net/videos/session_001.mp4"
    mediaType: "video"
    createdAt: "2025-08-08T14:30:00.000Z"
  )
}
```

#### 2. Reprocessar Mídia Existente

```graphql
mutation ReprocessMedia($patientId: String!, $documentId: String!) {
  reprocessMedia(patientId: $patientId, documentId: $documentId)
}
```

### Queries

#### 1. Health Check da Pipeline

```graphql
query PipelineHealth {
  pipelineHealthCheck
}
```

#### 2. Estatísticas de Processamento

```graphql
query ProcessingStats($patientId: String) {
  processingStatistics(patientId: $patientId)
}
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# OpenAI (obrigatório para Whisper e Sentiment)
OPENAI_API_KEY=sk-your-openai-key

# Azure OpenAI (alternativa)
AZURE_OPENAI_ENDPOINT=https://your-azure-openai.openai.azure.com
AZURE_OPENAI_API_KEY=your-azure-key

# Dragon Speech API (opcional, preferencial)
DRAGON_API_KEY=your-dragon-key
DRAGON_API_ENDPOINT=https://api.dragon.speech.com

# CosmosDB (já configurado)
COSMOSDB_ENDPOINT=https://therapyengage-cosmosdb-dev.documents.azure.com:443/
COSMOSDB_DATABASE_NAME=therapyengage
COSMOSDB_CONTAINER_NAME=patient_videos
```

### Dependências Adicionadas

```json
{
  "openai": "^4.52.7",
  "whisper-node": "^0.1.2",
  "axios": "^1.7.2",
  "form-data": "^4.0.0"
}
```

## 🧪 Exemplo de Teste

```typescript
// Entrada da pipeline
const input = {
  patientId: "patient_123",
  videoUrl: "https://storage.blob.core.windows.net/videos/session.mp4",
  mediaType: "video",
  createdAt: "2025-08-08T14:30:00.000Z"
};

// Processamento
const result = await pipelineService.processMedia(input);

// Resultado esperado
{
  id: "patient_123-1691502600000",
  patientId: "patient_123",
  transcription: "Estou me sentindo muito melhor desde nossa última sessão...",
  sentiment: {
    label: "POSITIVO",
    confidence: 0.87,
    summary: "Paciente demonstra melhora significativa no estado emocional..."
  },
  processingTimeMs: 15000,
  processedAt: "2025-08-08T14:32:15.000Z"
}
```

## 📊 Schema do Resultado no CosmosDB

```json
{
  "id": "patient_123-1691502600000",
  "patientId": "patient_123",
  "videoUrl": "https://therapystorage.blob.core.windows.net/videos/session_001.mp4",
  "mediaType": "video",
  "transcription": "Estou me sentindo muito melhor desde a nossa última sessão. A terapia está realmente me ajudando a lidar com a ansiedade.",
  "sentiment": {
    "label": "POSITIVO",
    "confidence": 0.87,
    "summary": "Paciente demonstra melhora significativa no estado emocional, expressando sentimentos positivos sobre o progresso terapêutico e redução da ansiedade."
  },
  "createdAt": "2025-08-08T14:30:00.000Z",
  "_ts": 1691502600
}
```

## 🚨 Tratamento de Erros

### Erros Comuns e Soluções

1. **Transcrição Falha**

   - **Dragon indisponível**: Automatic fallback para Whisper
   - **Arquivo corrompido**: Erro informativo retornado
   - **Formato não suportado**: Validação prévia de formato

2. **Análise de Sentimento Falha**

   - **OpenAI rate limit**: Retry com backoff exponencial
   - **JSON malformado**: Fallback para sentimento NEUTRO
   - **API indisponível**: Erro com recomendação de retry

3. **Persistência Falha**
   - **CosmosDB indisponível**: Retry automático (3x)
   - **Dados inválidos**: Validação prévia com class-validator
   - **Quota excedida**: Alerta para administrador

## 📈 Métricas e Monitoramento

### Health Checks Disponíveis

```typescript
// Status geral
{
  status: "healthy" | "degraded" | "error",
  services: {
    transcription: { dragon: boolean, whisper: boolean },
    sentiment: { status: string, model: string },
    cosmos: { status: string, database: string }
  }
}
```

### Estatísticas de Processamento

```typescript
{
  totalProcessed: number,
  averageProcessingTime: number,
  sentimentDistribution: {
    positive: number,
    neutral: number,
    negative: number
  },
  successRate: number
}
```

## 🔮 Próximos Passos

### Fase 2: Triggers Automáticos

- **Azure Blob Trigger**: Processamento automático ao upload
- **Event Grid**: Notificações em tempo real
- **Service Bus**: Queue para processamento assíncrono

### Fase 3: Dashboard do Terapeuta

- **Visualização de transcrições**: Interface para revisão
- **Análise longitudinal**: Tendências de sentimento
- **Alertas clínicos**: Notificações para mudanças significativas

### Fase 4: Otimizações

- **Cache Redis**: Cache de transcrições frequentes
- **Batch Processing**: Processamento noturno em lote
- **Model Fine-tuning**: Modelos especializados em contexto clínico

## 🎯 Status de Implementação

- ✅ **TranscriptionService**: Dragon + Whisper fallback
- ✅ **SentimentService**: GPT-4o com prompt clínico
- ✅ **PipelineService**: Orquestração completa
- ✅ **GraphQL Resolver**: API endpoints funcionais
- ✅ **Error Handling**: Tratamento robusto de erros
- ✅ **Health Monitoring**: Status de todos os serviços
- ✅ **Batch Processing**: Processamento em lote
- ✅ **CosmosDB Integration**: Persistência completa

**🚀 A pipeline está completamente implementada e pronta para produção!**
