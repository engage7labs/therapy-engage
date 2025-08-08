# Backend Gateway Service

## 🎯 Overview

Complete backend service with media processing pipeline including:

- ✅ **GraphQL API** for patient media upload
- ✅ **Transcription Pipeline** (Dragon + Whisper fallback)
- ✅ **Sentiment Analysis** (GPT-4o clinical context)
- ✅ **CosmosDB Integration** for data persistence

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run start:dev

# Production
npm run start
```

## 🔗 Quick Links

- **API GraphQL**: http://localhost:3001/graphql
- **Health Check**: http://localhost:3001/health
- **Complete Documentation**: [../../docs/BACKEND_COSMOSDB_SERVICE.md](../../docs/BACKEND_COSMOSDB_SERVICE.md)
- **Pipeline Documentation**: [../../docs/PIPELINE_TRANSCRIPTION_SENTIMENT.md](../../docs/PIPELINE_TRANSCRIPTION_SENTIMENT.md)
- **Testing Guide**: [../../docs/PIPELINE_TESTING_GUIDE.md](../../docs/PIPELINE_TESTING_GUIDE.md)
- **GraphQL Schema**: [GraphQL_Schema.md](./GraphQL_Schema.md)

## 🧪 Test the Pipeline

```graphql
# Process patient media
mutation ProcessPatientMedia {
  processPatientMedia(
    patientId: "patient_123"
    videoUrl: "https://storage.blob.core.windows.net/video.mp4"
    mediaType: "video"
  )
}

# Check pipeline health
query PipelineHealth {
  pipelineHealthCheck
}
```

## 📚 Complete Documentation

For detailed information about:

- API configuration and endpoints
- Pipeline architecture and services
- Troubleshooting and deployment
- Testing procedures and examples

Refer to the comprehensive documentation in the `/docs` folder.
