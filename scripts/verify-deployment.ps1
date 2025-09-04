#!/usr/bin/env pwsh

# Therapy Engage - Post-Deployment Verification Script
# This script verifies that the application is running correctly after deployment

param(
    [Parameter(Mandatory=$false)]
    [string]$AppUrl = "https://therapy-engage-dev.azurewebsites.net",
    
    [Parameter(Mandatory=$false)]
    [int]$TimeoutSeconds = 30,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose
)

Write-Host "🔍 Therapy Engage - Post-Deployment Verification" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

$tests = @()
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [int]$ExpectedStatusCode = 200,
        [string]$ExpectedContent = $null
    )
    
    Write-Host "🧪 Testing: $Name" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec $TimeoutSeconds -ErrorAction Stop
        
        if ($response.StatusCode -eq $ExpectedStatusCode) {
            if ($ExpectedContent -and $response.Content -notmatch $ExpectedContent) {
                throw "Content validation failed. Expected content containing: $ExpectedContent"
            }
            
            Write-Host "   ✅ PASS - Status: $($response.StatusCode)" -ForegroundColor Green
            if ($Verbose) {
                Write-Host "   📄 Response length: $($response.Content.Length) chars" -ForegroundColor Cyan
            }
            return $true
        } else {
            throw "Unexpected status code: $($response.StatusCode)"
        }
    } catch {
        Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test 1: Main Application
Write-Host ""
if (Test-Endpoint -Name "Main Application" -Url $AppUrl) {
    $passed++
} else {
    $failed++
}

# Test 2: Health Check Endpoint
Write-Host ""
if (Test-Endpoint -Name "Health Check Endpoint" -Url "$AppUrl/api/health" -ExpectedContent "healthy") {
    $passed++
} else {
    $failed++
}

# Test 3: Static Assets (favicon)
Write-Host ""
if (Test-Endpoint -Name "Static Assets" -Url "$AppUrl/favicon.ico") {
    $passed++
} else {
    $failed++
}

# Test 4: API Routes (if exists)
Write-Host ""
if (Test-Endpoint -Name "API Routes" -Url "$AppUrl/api/health" -ExpectedContent "timestamp") {
    $passed++
} else {
    $failed++
}

# Test 5: Response Time Check
Write-Host ""
Write-Host "🧪 Testing: Response Time" -ForegroundColor Yellow
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $AppUrl -Method GET -TimeoutSec $TimeoutSeconds
    $stopwatch.Stop()
    
    $responseTime = $stopwatch.ElapsedMilliseconds
    if ($responseTime -lt 5000) {  # Less than 5 seconds
        Write-Host "   ✅ PASS - Response time: ${responseTime}ms" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "   ⚠️  WARN - Slow response time: ${responseTime}ms" -ForegroundColor Yellow
        $passed++
    }
} catch {
    Write-Host "   ❌ FAIL - Response time test failed: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Health Check Details
Write-Host ""
Write-Host "🏥 Detailed Health Check" -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$AppUrl/api/health" -Method GET -TimeoutSec $TimeoutSeconds
    Write-Host "   Status: $($healthResponse.status)" -ForegroundColor Cyan
    Write-Host "   Timestamp: $($healthResponse.timestamp)" -ForegroundColor Cyan
    Write-Host "   Uptime: $($healthResponse.uptime)" -ForegroundColor Cyan
    
    if ($healthResponse.memory) {
        Write-Host "   Memory Usage: $([math]::Round($healthResponse.memory.used / 1MB, 2)) MB" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ⚠️  Could not retrieve detailed health information" -ForegroundColor Yellow
}

# SSL Certificate Check
Write-Host ""
Write-Host "🧪 Testing: SSL Certificate" -ForegroundColor Yellow
if ($AppUrl.StartsWith("https://")) {
    try {
        $uri = [System.Uri]$AppUrl
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect($uri.Host, 443)
        $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream())
        $sslStream.AuthenticateAsClient($uri.Host)
        
        $cert = $sslStream.RemoteCertificate
        $expiryDate = [DateTime]$cert.GetExpirationDateString()
        
        if ($expiryDate -gt (Get-Date).AddDays(30)) {
            Write-Host "   ✅ PASS - SSL Certificate valid until: $($expiryDate.ToString('yyyy-MM-dd'))" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "   ⚠️  WARN - SSL Certificate expires soon: $($expiryDate.ToString('yyyy-MM-dd'))" -ForegroundColor Yellow
            $passed++
        }
        
        $sslStream.Close()
        $tcpClient.Close()
    } catch {
        Write-Host "   ❌ FAIL - SSL Certificate check failed: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host "   ⚠️  SKIP - Application not using HTTPS" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "📊 Test Summary" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "Total: $($passed + $failed)" -ForegroundColor Cyan

# Recommendations
if ($failed -gt 0) {
    Write-Host ""
    Write-Host "🔧 Recommendations:" -ForegroundColor Yellow
    Write-Host "1. Check Azure App Service logs for errors"
    Write-Host "2. Verify all environment variables are configured"
    Write-Host "3. Ensure the application started successfully"
    Write-Host "4. Check for any deployment issues in GitHub Actions"
}

# Generate JSON report
$report = @{
    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    appUrl = $AppUrl
    summary = @{
        passed = $passed
        failed = $failed
        total = $passed + $failed
        success_rate = [math]::Round(($passed / ($passed + $failed)) * 100, 2)
    }
    status = if ($failed -eq 0) { "HEALTHY" } else { "UNHEALTHY" }
}

$reportFile = "deployment-verification-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$report | ConvertTo-Json -Depth 3 | Out-File $reportFile
Write-Host ""
Write-Host "📄 Report saved to: $reportFile" -ForegroundColor Cyan

# Exit with appropriate code
if ($failed -gt 0) {
    Write-Host ""
    Write-Host "💥 Some tests failed. Please investigate." -ForegroundColor Red
    exit 1
} else {
    Write-Host ""
    Write-Host "🎉 All tests passed! Application is healthy." -ForegroundColor Green
    exit 0
}
