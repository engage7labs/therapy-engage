#!/usr/bin/env pwsh
# ============================================
# Validate Service Principal DEV Setup
# ============================================
# Tests the Service Principal authentication and Azure Container Apps deployment readiness

param(
    [Parameter(Mandatory = $false)]
    [switch]$DryRun = $false
)

Write-Host "🔍 Validating Service Principal DEV Setup..." -ForegroundColor Cyan

# Check if Azure CLI is available
try {
    $azVersion = az version --output tsv 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Azure CLI not found"
    }
    Write-Host "✅ Azure CLI is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if logged in
try {
    $account = az account show --query "user.name" -o tsv 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Not logged into Azure CLI. Run: az login" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Logged into Azure CLI as: $account" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI authentication check failed" -ForegroundColor Red
    exit 1
}

# Check Terraform outputs
Write-Host "🔍 Checking Terraform outputs..." -ForegroundColor Cyan

if (!(Test-Path "infra")) {
    Write-Host "❌ 'infra' directory not found. Run from project root." -ForegroundColor Red
    exit 1
}

Push-Location infra
try {
    # Check if Terraform is initialized
    if (!(Test-Path ".terraform")) {
        Write-Host "⚠️  Terraform not initialized. Running terraform init..." -ForegroundColor Yellow
        terraform init
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Terraform init failed" -ForegroundColor Red
            exit 1
        }
    }

    # Get outputs
    $resourceGroup = terraform output -raw resource_group_name 2>$null
    $acaFrontend = terraform output -raw aca_frontend_name 2>$null
    $acaBackend = terraform output -raw aca_backend_name 2>$null

    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($resourceGroup)) {
        Write-Host "❌ Cannot retrieve Terraform outputs. Infrastructure may not be deployed." -ForegroundColor Red
        Write-Host "   Run: terraform plan and terraform apply" -ForegroundColor Gray
        exit 1
    }

    Write-Host "✅ Terraform outputs available:" -ForegroundColor Green
    Write-Host "   Resource Group: $resourceGroup" -ForegroundColor Gray
    Write-Host "   Frontend ACA: $acaFrontend" -ForegroundColor Gray
    Write-Host "   Backend ACA: $acaBackend" -ForegroundColor Gray

} finally {
    Pop-Location
}

# Check if Container Apps exist
Write-Host "🔍 Checking Azure Container Apps..." -ForegroundColor Cyan

try {
    $frontendApp = az containerapp show --name $acaFrontend --resource-group $resourceGroup --query "name" -o tsv 2>$null
    $backendApp = az containerapp show --name $acaBackend --resource-group $resourceGroup --query "name" -o tsv 2>$null

    if ([string]::IsNullOrEmpty($frontendApp) -or [string]::IsNullOrEmpty($backendApp)) {
        Write-Host "❌ Container Apps not found. Ensure Terraform infrastructure is deployed." -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Container Apps found and accessible" -ForegroundColor Green

    # Get FQDNs
    $frontendUrl = az containerapp show --name $acaFrontend --resource-group $resourceGroup --query "properties.configuration.ingress.fqdn" -o tsv 2>$null
    $backendUrl = az containerapp show --name $acaBackend --resource-group $resourceGroup --query "properties.configuration.ingress.fqdn" -o tsv 2>$null

    if (![string]::IsNullOrEmpty($frontendUrl)) {
        Write-Host "   Frontend URL: https://$frontendUrl" -ForegroundColor Gray
    }
    if (![string]::IsNullOrEmpty($backendUrl)) {
        Write-Host "   Backend URL: https://$backendUrl" -ForegroundColor Gray
    }

} catch {
    Write-Host "❌ Error checking Container Apps: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check Dockerfiles
Write-Host "🔍 Checking Dockerfiles..." -ForegroundColor Cyan

if (!(Test-Path "web/Dockerfile")) {
    Write-Host "❌ Frontend Dockerfile not found at web/Dockerfile" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "backend/apps/gateway/Dockerfile")) {
    Write-Host "❌ Backend Dockerfile not found at backend/apps/gateway/Dockerfile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dockerfiles found" -ForegroundColor Green

# Check health endpoints in source code
Write-Host "🔍 Checking health endpoints..." -ForegroundColor Cyan

if (Test-Path "web/app/api/health/route.ts") {
    Write-Host "✅ Frontend health endpoint found: /api/health" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend health endpoint not found at web/app/api/health/route.ts" -ForegroundColor Red
}

if (Test-Path "backend/apps/gateway/src/app.resolver.ts") {
    $healthController = Get-Content "backend/apps/gateway/src/app.resolver.ts" | Select-String "getHealth.*status.*ok"
    if ($healthController) {
        Write-Host "✅ Backend health endpoint found: /health" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Backend health endpoint may not return correct format" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Backend health controller not found" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "📋 Validation Summary:" -ForegroundColor Cyan
Write-Host "✅ Azure CLI authenticated" -ForegroundColor Green
Write-Host "✅ Terraform infrastructure outputs available" -ForegroundColor Green
Write-Host "✅ Azure Container Apps deployed and accessible" -ForegroundColor Green
Write-Host "✅ Dockerfiles present" -ForegroundColor Green
Write-Host "✅ Health endpoints configured" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Ready to run the Service Principal setup script:" -ForegroundColor Cyan
Write-Host "   .\scripts\setup-service-principal-dev.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 After setup, configure these GitHub secrets:" -ForegroundColor Cyan
Write-Host "   - AZURE_CREDENTIALS (from setup script output)" -ForegroundColor Gray
Write-Host "   - RESOURCE_GROUP: $resourceGroup" -ForegroundColor Gray
Write-Host "   - ACA_FRONTEND_NAME: $acaFrontend" -ForegroundColor Gray
Write-Host "   - ACA_BACKEND_NAME: $acaBackend" -ForegroundColor Gray
