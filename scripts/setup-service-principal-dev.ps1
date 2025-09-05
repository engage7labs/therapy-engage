#!/usr/bin/env pwsh
# ============================================
# Service Principal Setup for DEV Environment
# ============================================
# Creates Service Principal with Contributor role scoped to DEV Resource Group
# Generates AZURE_CREDENTIALS JSON for GitHub Actions Service Principal authentication

param(
    [Parameter(Mandatory = $false)]
    [string]$SubscriptionId = "",
    
    [Parameter(Mandatory = $false)]
    [string]$ResourceGroupName = "",
    
    [Parameter(Mandatory = $false)]
    [string]$ServicePrincipalName = "therapy-engage-dev-sp"
)

Write-Host "🔐 Setting up Service Principal for DEV environment..." -ForegroundColor Cyan

# Check if Azure CLI is logged in
$accountInfo = az account show 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Please login to Azure CLI first: az login" -ForegroundColor Red
    exit 1
}

# Get subscription ID if not provided
if ([string]::IsNullOrEmpty($SubscriptionId)) {
    $SubscriptionId = (az account show --query "id" -o tsv)
    Write-Host "📋 Using current subscription: $SubscriptionId" -ForegroundColor Yellow
}

# Get resource group name from Terraform if not provided
if ([string]::IsNullOrEmpty($ResourceGroupName)) {
    if (Test-Path "infra") {
        Push-Location infra
        try {
            $ResourceGroupName = terraform output -raw resource_group_name 2>$null
            if ($LASTEXITCODE -eq 0 -and ![string]::IsNullOrEmpty($ResourceGroupName)) {
                Write-Host "📋 Using Terraform output for resource group: $ResourceGroupName" -ForegroundColor Yellow
            } else {
                Write-Host "❌ Could not get resource group from Terraform. Please provide -ResourceGroupName parameter" -ForegroundColor Red
                exit 1
            }
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "❌ Please provide -ResourceGroupName parameter" -ForegroundColor Red
        exit 1
    }
}

# Build the scope for the resource group
$scope = "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName"

Write-Host "🎯 Creating Service Principal with scope: $scope" -ForegroundColor Green
Write-Host "   Service Principal Name: $ServicePrincipalName" -ForegroundColor Gray

# Create Service Principal with Contributor role scoped to Resource Group
$spJson = az ad sp create-for-rbac `
    --name $ServicePrincipalName `
    --role contributor `
    --scopes $scope `
    --sdk-auth

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Service Principal" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Service Principal created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Add the following secrets to GitHub Actions:" -ForegroundColor Cyan
Write-Host "   Repository > Settings > Secrets and variables > Actions" -ForegroundColor Gray
Write-Host ""
Write-Host "🔑 AZURE_CREDENTIALS:" -ForegroundColor Yellow
Write-Host $spJson -ForegroundColor White
Write-Host ""
Write-Host "🔑 RESOURCE_GROUP:" -ForegroundColor Yellow
Write-Host $ResourceGroupName -ForegroundColor White
Write-Host ""

# Get ACA names from Terraform if available
if (Test-Path "infra") {
    Push-Location infra
    try {
        $acaFrontend = terraform output -raw aca_frontend_name 2>$null
        $acaBackend = terraform output -raw aca_backend_name 2>$null
        
        if ($LASTEXITCODE -eq 0 -and ![string]::IsNullOrEmpty($acaFrontend)) {
            Write-Host "🔑 ACA_FRONTEND_NAME:" -ForegroundColor Yellow
            Write-Host $acaFrontend -ForegroundColor White
            Write-Host ""
        }
        
        if ($LASTEXITCODE -eq 0 -and ![string]::IsNullOrEmpty($acaBackend)) {
            Write-Host "🔑 ACA_BACKEND_NAME:" -ForegroundColor Yellow
            Write-Host $acaBackend -ForegroundColor White
            Write-Host ""
        }
    } finally {
        Pop-Location
    }
}

Write-Host "⚠️  Store these values securely and delete this output." -ForegroundColor Red
Write-Host "🔒 The Service Principal has Contributor access only to the DEV resource group." -ForegroundColor Green
