# ============================================
# PROD Environment Outputs (AKS-only)
# ============================================
# Outputs for PROD environment using AKS

# Resource Group
output "resource_group" {
  description = "Resource Group name for PROD environment"
  value       = azurerm_resource_group.this.name
  sensitive   = false
}

# AKS Cluster Information (when module is uncommented)
# output "aks_cluster_name" {
#   description = "Name of the AKS cluster"
#   value       = module.aks.cluster_name
#   sensitive   = false
# }

# output "aks_cluster_id" {
#   description = "ID of the AKS cluster"
#   value       = module.aks.cluster_id
#   sensitive   = false
# }

# Networking Information (when module is uncommented)
# output "vnet_name" {
#   description = "Name of the virtual network"
#   value       = module.networking.vnet_name
#   sensitive   = false
# }

# Azure Context
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

# Deployment Summary
output "deployment_summary" {
  description = "Summary of deployed PROD resources"
  value = {
    environment      = var.tags.environment
    resource_group   = azurerm_resource_group.this.name
    location         = var.location
    # aks_cluster      = module.aks.cluster_name  # Uncomment when AKS module is enabled
  }
  sensitive = false
}
