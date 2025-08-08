# Therapy Engage - CosmosDB Media Upload Service

## 🎯 Overview

This service implements the backend functionality for patient media upload with sentiment analysis and transcription storage using Azure CosmosDB.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   NestJS API    │    │   CosmosDB      │
│   (React)       │───▶│   Gateway       │───▶│   Database      │
│                 │    │                 │    │                 │
│ - Video Upload  │    │ - GraphQL API   │    │ - patient_videos│
│ - Sentiment UI  │    │ - Media Storage │    │ - Serverless    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features Implemented

- ✅ **CosmosDB Service**: Full integration with Azure CosmosDB
- ✅ **GraphQL Resolver**: `uploadMedia()` mutation
- ✅ **Data Validation**: DTOs with class-validator
- ✅ **Environment Configuration**: Secure config management
- ✅ **Error Handling**: Comprehensive logging and error management
- ✅ **Health Checks**: CosmosDB connectivity validation

## 📋 API Documentation

### uploadMedia Mutation

```graphql
mutation uploadMedia($input: UploadMediaDto!) {
  uploadMedia(input: $input)
}
```

**Input Schema**:

```typescript
{
  patientId: string; // Unique patient identifier
  videoUrl: string; // Azure Blob Storage URL
  mediaType: "audio" | "video";
  transcription: string; // AI-generated transcription
  sentiment: {
    label: string; // "positive" | "negative" | "neutral"
    confidence: number; // 0.0 - 1.0
    summary: string; // AI-generated summary
  }
  createdAt: string; // ISO 8601 timestamp
}
```

### Example Usage

```graphql
mutation {
  uploadMedia(
    input: {
      patientId: "patient_123"
      videoUrl: "https://therapystorage.blob.core.windows.net/videos/session_001.mp4"
      mediaType: "video"
      transcription: "I've been feeling much better since our last session..."
      sentiment: {
        label: "positive"
        confidence: 0.89
        summary: "Patient shows significant improvement in mood and outlook"
      }
      createdAt: "2025-08-08T14:30:00.000Z"
    }
  )
}
```

## 🔧 Configuration

### Environment Variables

```env
# CosmosDB Configuration
COSMOSDB_ENDPOINT=https://therapyengage-cosmosdb-dev.documents.azure.com:443/
COSMOSDB_DATABASE_NAME=therapyengage
COSMOSDB_CONTAINER_NAME=patient_videos

# Optional: For key-based authentication
COSMOSDB_KEY=your_cosmosdb_primary_key

# Application
PORT=3001
NODE_ENV=development
```

### CosmosDB Container Schema

```json
{
  "id": "patient_123-1691502600000",
  "patientId": "patient_123",
  "videoUrl": "https://storage.azure.com/videos/session.mp4",
  "mediaType": "video",
  "transcription": "Session transcript...",
  "sentiment": {
    "label": "positive",
    "confidence": 0.89,
    "summary": "Patient improvement noted"
  },
  "createdAt": "2025-08-08T14:30:00.000Z",
  "_ts": 1691502600
}
```

## 🛠️ Development

### Installation

```bash
cd backend/apps/gateway
npm install
```

### Running the Service

```bash
# Development mode
npm run start:dev

# Production mode
npm run start
```

### Testing the API

1. **GraphQL Playground**: http://localhost:3001/graphql
2. **Health Check**: http://localhost:3001/health

## 📊 CosmosDB Details

- **Account**: `therapyengage-cosmosdb-dev`
- **Database**: `therapyengage`
- **Container**: `patient_videos`
- **Partition Key**: `/patientId`
- **TTL**: 30 days (2,592,000 seconds)
- **Throughput**: Serverless (cost-optimized)

## 🔒 Security Considerations

- **Managed Identity**: Preferred authentication method
- **HTTPS Only**: All connections encrypted
- **GDPR Compliance**: 30-day data retention
- **Input Validation**: All fields validated with class-validator
- **Error Sanitization**: Sensitive data not exposed in errors

## 📈 Next Steps

### Phase 1: Core Functionality ✅

- [x] CosmosDB service implementation
- [x] GraphQL resolver for media upload
- [x] Data validation and error handling

### Phase 2: Enhanced Features

- [ ] Patient media retrieval queries
- [ ] Sentiment analysis trending
- [ ] Real-time notifications
- [ ] Batch upload support

### Phase 3: Analytics & Reporting

- [ ] Longitudinal sentiment analysis
- [ ] Clinical insights dashboard
- [ ] Automated alert triggers
- [ ] Therapist analytics panel

## 🚨 Troubleshooting

### Common Issues

1. **CosmosDB Connection Failed**

   - Verify `COSMOSDB_ENDPOINT` is correct
   - Check network connectivity
   - Validate authentication credentials

2. **GraphQL Schema Errors**

   - Ensure all DTOs are properly imported
   - Check class-validator decorators
   - Verify GraphQL decorators

3. **Build Failures**
   - Run `npm install` to ensure dependencies
   - Check TypeScript version compatibility
   - Validate import paths

### Health Check Endpoints

```bash
# API Health
curl http://localhost:3001/health

# CosmosDB Health
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { cosmosHealthCheck }"}'
```

## 📞 Support

For technical issues or questions about this implementation, please refer to:

- GraphQL Schema documentation in `GraphQL_Schema.md`
- CosmosDB module documentation in `infra/modules/cosmosdb/README.md`
- Environment configuration in `.env.example`
