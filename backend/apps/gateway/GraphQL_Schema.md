# GraphQL Schema Documentation

## Media Upload Mutation

### uploadMedia

**Description**: Upload patient media (video/audio) with metadata including transcription and sentiment analysis.

**Mutation**:

```graphql
mutation uploadMedia($input: UploadMediaDto!) {
  uploadMedia(input: $input)
}
```

**Input Type**:

```graphql
input UploadMediaDto {
  patientId: String!
  videoUrl: String!
  mediaType: String! # "audio" | "video"
  transcription: String!
  sentiment: SentimentInput!
  createdAt: String! # ISO 8601 timestamp
}

input SentimentInput {
  label: String!
  confidence: Float!
  summary: String!
}
```

**Example Request**:

```graphql
mutation {
  uploadMedia(
    input: {
      patientId: "patient_123"
      videoUrl: "https://storage.azure.com/videos/session_456.mp4"
      mediaType: "video"
      transcription: "Patient discusses feeling more optimistic about therapy progress..."
      sentiment: {
        label: "positive"
        confidence: 0.85
        summary: "Patient shows improved emotional state and engagement"
      }
      createdAt: "2025-08-08T14:30:00.000Z"
    }
  )
}
```

**Response**:

```graphql
{
  "data": {
    "uploadMedia": true
  }
}
```

## Health Check Query

### cosmosHealthCheck

**Description**: Check if CosmosDB connection is healthy.

**Query**:

```graphql
query {
  cosmosHealthCheck
}
```

**Response**:

```graphql
{
  "data": {
    "cosmosHealthCheck": true
  }
}
```

## Environment Variables Required

```env
COSMOSDB_ENDPOINT=https://therapyengage-cosmosdb-dev.documents.azure.com:443/
COSMOSDB_DATABASE_NAME=therapyengage
COSMOSDB_CONTAINER_NAME=patient_videos
COSMOSDB_KEY=optional_if_using_managed_identity
```

## Data Structure in CosmosDB

The following document structure is stored in the `patient_videos` container:

```json
{
  "id": "patient_123-1691502600000",
  "patientId": "patient_123",
  "videoUrl": "https://storage.azure.com/videos/session_456.mp4",
  "mediaType": "video",
  "transcription": "Patient discusses feeling more optimistic...",
  "sentiment": {
    "label": "positive",
    "confidence": 0.85,
    "summary": "Patient shows improved emotional state"
  },
  "createdAt": "2025-08-08T14:30:00.000Z",
  "_ts": 1691502600
}
```

## Next Steps

1. Configure authentication for CosmosDB (managed identity or key-based)
2. Implement patient media retrieval queries for therapist dashboard
3. Add data validation and error handling
4. Implement real-time notifications for new uploads
5. Add sentiment analysis trending and longitudinal analysis
