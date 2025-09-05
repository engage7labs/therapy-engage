#!/usr/bin/env pwsh

# Terraform Outputs to GitHub Secrets Bridge
# This script synchronizes Terraform outputs to GitHub repository secrets

param(
    [Parameter(Mandatory=$false)]
    [string]$TerraformDir = "./infra",
    
    [Parameter(Mandatory=$false)]
    [string]$Repository = "TherapyEngageOrg/therapy-engage",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

Write-Host "🔐 Terraform Outputs → GitHub Secrets Sync" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check prerequisites
try {
    gh --version | Out-Null
    Write-Host "✅ GitHub CLI is available" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory and terraform is available
if (-not (Test-Path "$TerraformDir/main.tf")) {
    Write-Host "❌ Terraform directory not found: $TerraformDir" -ForegroundColor Red
    exit 1
}

try {
    terraform --version | Out-Null
    Write-Host "✅ Terraform is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Terraform is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Change to terraform directory
Push-Location $TerraformDir

Write-Host ""
Write-Host "📋 Extracting Terraform outputs..." -ForegroundColor Yellow

# Extract outputs using terraform output
$outputs = @{}
$secrets_to_set = @(
    "azure_client_id",
    "azure_tenant_id", 
    "azure_subscription_id",
    "resource_group",
    "aca_frontend_name",
    "aca_backend_name"
)

foreach ($output_name in $secrets_to_set) {
    try {
        $value = terraform output -raw $output_name 2>$null
        if ($LASTEXITCODE -eq 0 -and $value) {
            $outputs[$output_name] = $value
            Write-Host "   ✅ $output_name = $value" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $output_name = (not available)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ Failed to get $output_name" -ForegroundColor Red
    }
}

Pop-Location

if ($outputs.Count -eq 0) {
    Write-Host ""
    Write-Host "❌ No outputs available. Make sure Terraform has been applied." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔄 Setting GitHub Secrets..." -ForegroundColor Yellow

# Set GitHub secrets
foreach ($key in $outputs.Keys) {
    $secret_name = $key.ToUpper()
    $secret_value = $outputs[$key]
    
    if ($DryRun) {
        Write-Host "   [DRY RUN] Would set: $secret_name = $secret_value" -ForegroundColor Cyan
    } else {
        try {
            gh secret set $secret_name --body $secret_value --repo $Repository
            Write-Host "   ✅ Set: $secret_name" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Failed to set: $secret_name - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
if ($DryRun) {
    Write-Host "🔍 DRY RUN COMPLETE" -ForegroundColor Blue
    Write-Host "No secrets were actually set. Run without -DryRun to apply changes." -ForegroundColor Cyan
} else {
    Write-Host "✅ SYNC COMPLETE" -ForegroundColor Green
    Write-Host "Terraform outputs have been synchronized to GitHub repository secrets." -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Verify secrets in GitHub: https://github.com/$Repository/settings/secrets/actions" -ForegroundColor White
Write-Host "2. Trigger CI/CD pipeline to test OIDC authentication" -ForegroundColor White
Write-Host "3. Monitor deployment logs for successful Azure authentication" -ForegroundColor White

Write-Host ""
Write-Host "🔐 Security Note:" -ForegroundColor Magenta
Write-Host "Keep this script secure and run only from trusted environments." -ForegroundColor White
