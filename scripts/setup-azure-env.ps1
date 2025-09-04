#!/usr/bin/env pwsh

# Therapy Engage - Azure Environment Setup Script
# This script helps configure the Azure environment and GitHub secrets for deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$AppServiceName,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US",
    
    [Parameter(Mandatory=$false)]
    [string]$PricingTier = "F1"  # Free tier
)

Write-Host "🚀 Therapy Engage - Azure Environment Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if Azure CLI is installed
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

# Login to Azure
Write-Host "🔐 Logging into Azure..." -ForegroundColor Yellow
az login

# Create Resource Group
Write-Host "📦 Creating Resource Group: $ResourceGroupName" -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

# Create App Service Plan
$appServicePlanName = "$AppServiceName-plan"
Write-Host "📋 Creating App Service Plan: $appServicePlanName" -ForegroundColor Yellow
az appservice plan create --name $appServicePlanName --resource-group $ResourceGroupName --sku $PricingTier

# Create Web App
Write-Host "🌐 Creating Web App: $AppServiceName" -ForegroundColor Yellow
az webapp create --resource-group $ResourceGroupName --plan $appServicePlanName --name $AppServiceName --runtime "NODE|18-lts"

# Configure Web App Settings
Write-Host "⚙️ Configuring Web App settings..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $ResourceGroupName --name $AppServiceName --settings `
    NODE_ENV=production `
    WEBSITE_NODE_DEFAULT_VERSION=18.17.0 `
    SCM_DO_BUILD_DURING_DEPLOYMENT=true `
    WEBSITE_HEALTHCHECK_MAXPINGFAILURES=3

# Create Staging Slot (if not Free tier)
if ($PricingTier -ne "F1") {
    Write-Host "🎭 Creating Staging Slot..." -ForegroundColor Yellow
    az webapp deployment slot create --resource-group $ResourceGroupName --name $AppServiceName --slot staging
}

# Get Publish Profile
Write-Host "📄 Getting Publish Profile..." -ForegroundColor Yellow
$publishProfile = az webapp deployment list-publishing-profiles --resource-group $ResourceGroupName --name $AppServiceName --xml

# Display setup summary
Write-Host ""
Write-Host "🎉 Azure Environment Setup Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Cyan
Write-Host "App Service: $AppServiceName" -ForegroundColor Cyan
Write-Host "URL: https://$AppServiceName.azurewebsites.net" -ForegroundColor Cyan

# GitHub Secrets Instructions
Write-Host ""
Write-Host "📝 GitHub Secrets Setup Required:" -ForegroundColor Yellow
Write-Host "1. Go to your GitHub repository"
Write-Host "2. Navigate to Settings → Secrets and variables → Actions"
Write-Host "3. Add the following secrets:"
Write-Host ""
Write-Host "   AZURE_WEBAPP_NAME = $AppServiceName" -ForegroundColor White
Write-Host "   AZURE_WEBAPP_PUBLISH_PROFILE = [Download from Azure Portal]" -ForegroundColor White
Write-Host ""
Write-Host "4. To get the Publish Profile:"
Write-Host "   - Go to Azure Portal"
Write-Host "   - Navigate to your App Service: $AppServiceName"
Write-Host "   - Click 'Get publish profile'"
Write-Host "   - Copy the entire XML content"
Write-Host ""

# Save configuration to file
$configFile = "azure-config.json"
$config = @{
    resourceGroup = $ResourceGroupName
    appServiceName = $AppServiceName
    appServicePlan = $appServicePlanName
    location = $Location
    pricingTier = $PricingTier
    url = "https://$AppServiceName.azurewebsites.net"
    healthCheck = "https://$AppServiceName.azurewebsites.net/api/health"
    created = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}

$config | ConvertTo-Json -Depth 3 | Out-File $configFile
Write-Host "💾 Configuration saved to: $configFile" -ForegroundColor Green

# Optional: Open Azure Portal
$openPortal = Read-Host "Open Azure Portal to configure Publish Profile? (y/N)"
if ($openPortal -eq "y" -or $openPortal -eq "Y") {
    $portalUrl = "https://portal.azure.com/#@/resource/subscriptions/$((az account show --query id -o tsv))/resourcegroups/$ResourceGroupName/providers/Microsoft.Web/sites/$AppServiceName"
    Start-Process $portalUrl
}

Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Green
Write-Host "1. Configure GitHub Secrets (see instructions above)"
Write-Host "2. Push your code to trigger the CI/CD pipeline"
Write-Host "3. Monitor deployment at: https://github.com/your-username/therapy-engage/actions"
Write-Host ""
Write-Host "✨ Happy Deploying!" -ForegroundColor Magenta
