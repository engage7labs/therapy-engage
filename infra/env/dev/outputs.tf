# ============================================
# DEV Environment Outputs (ACA-only)
# ============================================
# Minimal outputs required for CI/CD pipeline

# Resource Group
output "resource_group" {
  description = "Resource Group name for ACA environment"
  value       = azurerm_resource_group.this.name
  sensitive   = false
}

# Container Apps - logical app names used by CI/CD
output "aca_frontend_name" {
  description = "Azure Container App name for the frontend"
  value       = azurerm_container_app.frontend.name
  sensitive   = false
}

output "aca_backend_name" {
  description = "Azure Container App name for the backend"
  value       = azurerm_container_app.backend.name
  sensitive   = false
}

# Container Apps Additional Information
output "aca_environment_name" {
  description = "Container Apps Environment name"
  value       = azurerm_container_app_environment.this.name
  sensitive   = false
}

output "backend_url" {
  description = "Backend Container App public URL"
  value       = "https://${azurerm_container_app.backend.latest_revision_fqdn}"
  sensitive   = false
}

output "frontend_url" {
  description = "Frontend Container App public URL"
  value       = "https://${azurerm_container_app.frontend.latest_revision_fqdn}"
  sensitive   = false
}

# Azure Context (helpful for diagnostics and CI/CD)
output "azure_tenant_id" {
  description = "Azure AD Tenant ID"
  value       = data.azurerm_client_config.current.tenant_id
  sensitive   = false
}

output "azure_subscription_id" {
  description = "Azure Subscription ID"
  value       = data.azurerm_client_config.current.subscription_id
  sensitive   = false
}
