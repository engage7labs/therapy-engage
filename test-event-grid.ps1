# Test Event Grid Integration
# Simula eventos do Azure Event Grid para testar a integração com blob uploads

param(
    [string]$ApiBaseUrl = "http://localhost:3001",
    [string]$StorageAccount = "therapystorage",
    [string]$Container = "patient-uploads",
    [switch]$TestValidation,
    [switch]$TestBlobEvent,
    [switch]$TestManualProcessing,
    [switch]$All
)

# Helper function to make HTTP requests
function Invoke-WebhookTest {
    param(
        [string]$Url,
        [hashtable]$Headers,
        [object]$Body,
        [string]$Description
    )
    
    Write-Host "🧪 Testing: $Description" -ForegroundColor Cyan
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $jsonBody = $Body | ConvertTo-Json -Depth 10
        Write-Host "Request Body:" -ForegroundColor Gray
        Write-Host $jsonBody -ForegroundColor DarkGray
        
        $response = Invoke-RestMethod -Uri $Url -Method POST -Headers $Headers -Body $jsonBody -ContentType "application/json"
        
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Gray
        Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor DarkGray
        return $true
    }
    catch {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    Write-Host ""
}

function Test-EventGridValidation {
    Write-Host "`n🔄 Testing Event Grid Validation Handshake..." -ForegroundColor Yellow
    
    $headers = @{
        "aeg-event-type" = "SubscriptionValidation"
    }
    
    $body = @(
        @{
            id = "validation-$(Get-Random)"
            eventType = "Microsoft.EventGrid.SubscriptionValidationEvent"
            subject = ""
            eventTime = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            dataVersion = "1.0"
            metadataVersion = "1"
            topic = "/subscriptions/fake-sub/resourceGroups/rg/providers/Microsoft.EventGrid/topics/test"
            data = @{
                validationCode = "test-validation-code-$(Get-Random)"
                validationUrl = "https://rp-eastus2.eventgrid.azure.net:553/eventsubscriptions/test/validate?id=test&t=2018-04-26T20:30:54.4538837Z&apiVersion=2018-05-01-preview&token=test"
            }
        }
    )
    
    return Invoke-WebhookTest -Url "$ApiBaseUrl/webhook/blob-event" -Headers $headers -Body $body -Description "Event Grid Validation Handshake"
}

function Test-BlobCreatedEvent {
    Write-Host "`n🔄 Testing Blob Created Event Processing..." -ForegroundColor Yellow
    
    $headers = @{
        "aeg-event-type" = "Notification"
    }
    
    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $fileName = "patient_test123_video_$timestamp.mp4"
    
    $body = @(
        @{
            id = "blob-event-$(Get-Random)"
            eventType = "Microsoft.Storage.BlobCreated"
            subject = "/blobServices/default/containers/$Container/blobs/$fileName"
            eventTime = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            dataVersion = "1.0"
            metadataVersion = "1"
            topic = "/subscriptions/fake-sub/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/$StorageAccount"
            data = @{
                api = "PutBlob"
                clientRequestId = "test-request-$(Get-Random)"
                requestId = "test-request-$(Get-Random)"
                eTag = "0x8D123456789ABCD"
                contentType = "video/mp4"
                contentLength = 15728640
                blobType = "BlockBlob"
                url = "https://$StorageAccount.blob.core.windows.net/$Container/$fileName"
                sequencer = "000000000000000000000000000000000000000000000000000000000"
                storageDiagnostics = @{
                    batchId = "batch-$(Get-Random)"
                }
            }
        }
    )
    
    return Invoke-WebhookTest -Url "$ApiBaseUrl/webhook/blob-event" -Headers $headers -Body $body -Description "Blob Created Event"
}

function Test-ManualBlobProcessing {
    Write-Host "`n🔄 Testing Manual Blob Processing..." -ForegroundColor Yellow
    
    $headers = @{}
    
    $body = @{
        blobUrl = "https://$StorageAccount.blob.core.windows.net/$Container/patient_manual123_audio_20250808064500.mp3"
        patientId = "manual123"
        mediaType = "audio"
    }
    
    return Invoke-WebhookTest -Url "$ApiBaseUrl/webhook/test-blob-processing" -Headers $headers -Body $body -Description "Manual Blob Processing"
}

function Test-PipelineHealth {
    Write-Host "`n🔄 Testing Pipeline Health..." -ForegroundColor Yellow
    
    try {
        $healthResponse = Invoke-RestMethod -Uri "$ApiBaseUrl/health" -Method GET
        Write-Host "✅ Health Check Passed" -ForegroundColor Green
        Write-Host ($healthResponse | ConvertTo-Json -Depth 3) -ForegroundColor DarkGray
        return $true
    }
    catch {
        Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-GraphQLPipelineHealth {
    Write-Host "`n🔄 Testing GraphQL Pipeline Health..." -ForegroundColor Yellow
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $body = @{
        query = "query { pipelineHealthCheck }"
    }
    
    return Invoke-WebhookTest -Url "$ApiBaseUrl/graphql" -Headers $headers -Body $body -Description "GraphQL Pipeline Health Check"
}

# Main execution
Write-Host "🚀 Event Grid Integration Test Suite" -ForegroundColor Magenta
Write-Host "API Base URL: $ApiBaseUrl" -ForegroundColor Gray
Write-Host "Storage Account: $StorageAccount" -ForegroundColor Gray
Write-Host "Container: $Container" -ForegroundColor Gray
Write-Host ""

$results = @{
    HealthCheck = $false
    GraphQLHealth = $false
    EventGridValidation = $false
    BlobCreatedEvent = $false
    ManualProcessing = $false
}

# Test pipeline health first
$results.HealthCheck = Test-PipelineHealth
$results.GraphQLHealth = Test-GraphQLPipelineHealth

if ($TestValidation -or $All) {
    $results.EventGridValidation = Test-EventGridValidation
}

if ($TestBlobEvent -or $All) {
    $results.BlobCreatedEvent = Test-BlobCreatedEvent
}

if ($TestManualProcessing -or $All) {
    $results.ManualProcessing = Test-ManualBlobProcessing
}

if (-not $TestValidation -and -not $TestBlobEvent -and -not $TestManualProcessing -and -not $All) {
    # Default: test all
    $results.EventGridValidation = Test-EventGridValidation
    $results.BlobCreatedEvent = Test-BlobCreatedEvent
    $results.ManualProcessing = Test-ManualBlobProcessing
}

# Summary
Write-Host "`n📊 Test Results Summary:" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Magenta

foreach ($test in $results.GetEnumerator()) {
    $status = if ($test.Value) { "✅ PASS" } else { "❌ FAIL" }
    $color = if ($test.Value) { "Green" } else { "Red" }
    Write-Host "$($test.Name): $status" -ForegroundColor $color
}

$passedTests = ($results.Values | Where-Object { $_ }).Count
$totalTests = $results.Values.Count

Write-Host "`nOverall: $passedTests/$totalTests tests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

if ($passedTests -eq $totalTests) {
    Write-Host "`n🎉 All tests passed! Event Grid integration is working correctly." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check the logs above for details." -ForegroundColor Yellow
}

Write-Host "`n📝 Usage Examples:" -ForegroundColor Cyan
Write-Host "  .\test-event-grid.ps1 -All                    # Run all tests"
Write-Host "  .\test-event-grid.ps1 -TestValidation        # Test only validation handshake"
Write-Host "  .\test-event-grid.ps1 -TestBlobEvent         # Test only blob event processing"
Write-Host "  .\test-event-grid.ps1 -TestManualProcessing  # Test only manual processing"
Write-Host "  .\test-event-grid.ps1 -ApiBaseUrl 'https://20.82.234.39.sslip.io'"
