#!/usr/bin/env pwsh
# ============================================
# Terraform State Migration Script
# ============================================
# Migrates existing Terraform state to new environment-isolated structure
# Run this script BEFORE applying the new structure to avoid resource recreation

param(
    [Parameter(Mandatory = $false)]
    [switch]$DryRun = $true,
    
    [Parameter(Mandatory = $false)]
    [string]$Environment = "dev"
)

Write-Host "🔄 Terraform State Migration for Environment Isolation" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Dry Run: $DryRun" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "ℹ️  DRY RUN MODE - No actual state changes will be made" -ForegroundColor Blue
    Write-Host "   Run with -DryRun:`$false to execute the migration" -ForegroundColor Gray
}

# Check if we're in the right directory
if (!(Test-Path "infra/main.tf")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# State move commands for DEV environment
$devStateMoves = @(
    # Resource Group
    @{
        From = "azurerm_resource_group.rg"
        To   = "azurerm_resource_group.this"
        Description = "Resource Group"
    }
    
    # Random String
    @{
        From = "random_string.unique_suffix"
        To   = "random_string.unique_suffix"
        Description = "Unique Suffix (no change needed)"
    }
    
    # Container Apps Environment
    @{
        From = "azurerm_container_app_environment.dev_env"
        To   = "azurerm_container_app_environment.this"
        Description = "Container Apps Environment"
    }
    
    # Container Apps
    @{
        From = "azurerm_container_app.backend"
        To   = "azurerm_container_app.backend"
        Description = "Backend Container App (no change needed)"
    }
    
    @{
        From = "azurerm_container_app.frontend"
        To   = "azurerm_container_app.frontend"
        Description = "Frontend Container App (no change needed)"
    }
)

Write-Host ""
Write-Host "📋 Planned State Moves for $Environment environment:" -ForegroundColor Cyan

foreach ($move in $devStateMoves) {
    Write-Host "  $($move.Description):" -ForegroundColor Gray
    Write-Host "    FROM: $($move.From)" -ForegroundColor Red
    Write-Host "    TO:   $($move.To)" -ForegroundColor Green
    
    if ($move.From -eq $move.To) {
        Write-Host "    ✅ No migration needed" -ForegroundColor Green
    } else {
        Write-Host "    🔄 Migration required" -ForegroundColor Yellow
    }
    Write-Host ""
}

if (!$DryRun) {
    Write-Host "🚨 EXECUTING STATE MIGRATION..." -ForegroundColor Red
    Write-Host "⚠️  Make sure you have a backup of your current state!" -ForegroundColor Yellow
    
    Push-Location infra
    try {
        foreach ($move in $devStateMoves) {
            if ($move.From -ne $move.To) {
                Write-Host "Moving: $($move.From) → $($move.To)" -ForegroundColor Cyan
                
                $command = "terraform state mv '$($move.From)' '$($move.To)'"
                Write-Host "Executing: $command" -ForegroundColor Gray
                
                Invoke-Expression $command
                
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "❌ State move failed for $($move.Description)" -ForegroundColor Red
                    Write-Host "   You may need to run this manually or check if the resource exists" -ForegroundColor Gray
                } else {
                    Write-Host "✅ Successfully moved $($move.Description)" -ForegroundColor Green
                }
            }
        }
    } finally {
        Pop-Location
    }
    
    Write-Host ""
    Write-Host "✅ State migration completed!" -ForegroundColor Green
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Run: make plan-dev" -ForegroundColor Gray
    Write-Host "   2. Verify no resources are marked for replacement" -ForegroundColor Gray
    Write-Host "   3. If plan looks good, run: make apply-dev" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "📝 To execute this migration:" -ForegroundColor Cyan
    Write-Host "   .\scripts\migrate-terraform-state.ps1 -DryRun:`$false" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  Important notes:" -ForegroundColor Yellow
    Write-Host "   - Backup your current terraform state before running" -ForegroundColor Gray
    Write-Host "   - Resources that don't need migration will be skipped" -ForegroundColor Gray
    Write-Host "   - After migration, run 'make plan-dev' to verify" -ForegroundColor Gray
}
