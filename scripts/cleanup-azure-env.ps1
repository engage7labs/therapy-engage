#!/usr/bin/env pwsh

# Therapy Engage - Environment Cleanup Script
# This script helps clean up Azure resources and reset the environment

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

Write-Host "🧹 Therapy Engage - Environment Cleanup" -ForegroundColor Red
Write-Host "=======================================" -ForegroundColor Red

if (-not $Force -and -not $DryRun) {
    Write-Host "⚠️  WARNING: This script will delete Azure resources!" -ForegroundColor Yellow
    Write-Host "Use -DryRun to see what would be deleted without actually deleting." -ForegroundColor Yellow
    Write-Host "Use -Force to skip confirmation prompts." -ForegroundColor Yellow
    Write-Host ""
    
    $confirmation = Read-Host "Are you sure you want to continue? (type 'DELETE' to confirm)"
    if ($confirmation -ne "DELETE") {
        Write-Host "❌ Cleanup cancelled." -ForegroundColor Green
        exit 0
    }
}

# Check if Azure CLI is installed and logged in
try {
    $account = az account show 2>$null | ConvertFrom-Json
    if (-not $account) {
        throw "Not logged in"
    }
    Write-Host "✅ Azure CLI authenticated as: $($account.user.name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Please login to Azure CLI first: az login" -ForegroundColor Red
    exit 1
}

# Load configuration if available
$configFile = "azure-config.json"
if (Test-Path $configFile) {
    Write-Host "📄 Loading configuration from: $configFile" -ForegroundColor Cyan
    $config = Get-Content $configFile | ConvertFrom-Json
    
    if (-not $ResourceGroupName) { $ResourceGroupName = $config.resourceGroup }
    if (-not $AppServiceName) { $AppServiceName = $config.appServiceName }
}

# Validate parameters
if (-not $ResourceGroupName) {
    Write-Host "❌ ResourceGroupName is required. Use -ResourceGroupName parameter or have azure-config.json file." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔍 Scanning for resources to cleanup..." -ForegroundColor Yellow

# Function to safely execute Azure CLI commands
function Invoke-AzCommand {
    param([string]$Command, [string]$Description)
    
    if ($DryRun) {
        Write-Host "   [DRY RUN] Would execute: $Command" -ForegroundColor Cyan
        return $true
    }
    
    try {
        Write-Host "   Executing: $Description" -ForegroundColor Yellow
        Invoke-Expression $Command
        Write-Host "   ✅ Success: $Description" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "   ❌ Failed: $Description - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# List resources in the resource group
Write-Host "📦 Resource Group: $ResourceGroupName" -ForegroundColor Cyan
try {
    $resources = az resource list --resource-group $ResourceGroupName 2>$null | ConvertFrom-Json
    
    if ($resources.Count -eq 0) {
        Write-Host "   ℹ️  No resources found in resource group" -ForegroundColor Yellow
    } else {
        Write-Host "   Found $($resources.Count) resources:" -ForegroundColor White
        foreach ($resource in $resources) {
            Write-Host "   - $($resource.name) ($($resource.type))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ❌ Resource group not found or access denied" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Cleanup App Service and related resources
if ($AppServiceName) {
    Write-Host "🌐 App Service Cleanup: $AppServiceName" -ForegroundColor Cyan
    
    # Stop the web app
    Invoke-AzCommand "az webapp stop --name $AppServiceName --resource-group $ResourceGroupName" "Stop Web App"
    
    # Delete deployment slots (if any)
    try {
        $slots = az webapp deployment slot list --name $AppServiceName --resource-group $ResourceGroupName 2>$null | ConvertFrom-Json
        foreach ($slot in $slots) {
            if ($slot.name -ne "production") {
                Invoke-AzCommand "az webapp deployment slot delete --name $AppServiceName --resource-group $ResourceGroupName --slot $($slot.name)" "Delete deployment slot: $($slot.name)"
            }
        }
    } catch {
        Write-Host "   ℹ️  No deployment slots found" -ForegroundColor Gray
    }
    
    # Delete the web app
    Invoke-AzCommand "az webapp delete --name $AppServiceName --resource-group $ResourceGroupName" "Delete Web App"
    
    # Delete the app service plan
    $appServicePlan = "$AppServiceName-plan"
    Invoke-AzCommand "az appservice plan delete --name $appServicePlan --resource-group $ResourceGroupName --yes" "Delete App Service Plan"
}

# Delete the entire resource group
Write-Host ""
Write-Host "💥 Resource Group Cleanup" -ForegroundColor Red

if ($DryRun) {
    Write-Host "   [DRY RUN] Would delete resource group: $ResourceGroupName" -ForegroundColor Cyan
} else {
    if (-not $Force) {
        Write-Host "⚠️  FINAL WARNING: This will delete the entire resource group and ALL resources in it!" -ForegroundColor Yellow
        $finalConfirmation = Read-Host "Type 'DELETE EVERYTHING' to confirm resource group deletion"
        if ($finalConfirmation -ne "DELETE EVERYTHING") {
            Write-Host "❌ Resource group deletion cancelled." -ForegroundColor Green
            exit 0
        }
    }
    
    Write-Host "   🔥 Deleting resource group: $ResourceGroupName" -ForegroundColor Red
    Write-Host "   This may take several minutes..." -ForegroundColor Yellow
    
    Invoke-AzCommand "az group delete --name $ResourceGroupName --yes --no-wait" "Delete Resource Group (async)"
}

# Cleanup local files
Write-Host ""
Write-Host "🧹 Local Cleanup" -ForegroundColor Cyan

$filesToClean = @(
    "azure-config.json",
    "deployment-verification-*.json"
)

foreach ($pattern in $filesToClean) {
    $files = Get-ChildItem -Path . -Name $pattern -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        if ($DryRun) {
            Write-Host "   [DRY RUN] Would delete: $file" -ForegroundColor Cyan
        } else {
            Remove-Item $file -Force
            Write-Host "   🗑️  Deleted: $file" -ForegroundColor Gray
        }
    }
}

# Summary
Write-Host ""
if ($DryRun) {
    Write-Host "🔍 DRY RUN COMPLETE" -ForegroundColor Blue
    Write-Host "==================" -ForegroundColor Blue
    Write-Host "This was a simulation. No resources were actually deleted." -ForegroundColor Cyan
    Write-Host "Run without -DryRun to perform actual cleanup." -ForegroundColor Cyan
} else {
    Write-Host "✅ CLEANUP COMPLETE" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Green
    Write-Host "Azure resources have been deleted or are being deleted." -ForegroundColor Green
    Write-Host "Local configuration files have been cleaned up." -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Wait for resource group deletion to complete (check Azure Portal)" -ForegroundColor White
    Write-Host "2. Remove GitHub Secrets if no longer needed:" -ForegroundColor White
    Write-Host "   - AZURE_WEBAPP_NAME" -ForegroundColor Gray
    Write-Host "   - AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor Gray
    Write-Host "3. Consider updating GitHub Actions workflow if needed" -ForegroundColor White
}

Write-Host ""
Write-Host "🏁 Cleanup script finished." -ForegroundColor Magenta
