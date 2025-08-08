# ============================================
# Terraform Outputs - TherapyEngage Platform
# ============================================
# This file consolidates all critical outputs from the infrastructure modules
# These outputs are essential for:
# - Application configuration
# - CI/CD pipeline integration
# - Helm chart deployments
# - Monitoring and observability
# - External service integrations

# ============================================
# Resource Group Information
# ============================================

output "resource_group_name" {
  description = "Name of the primary resource group containing all resources"
  value       = azurerm_resource_group.rg.name
  sensitive   = false
}

output "resource_group_location" {
  description = "Azure region where resources are deployed"
  value       = var.location
  sensitive   = false
}

output "resource_group_id" {
  description = "Full resource ID of the resource group"
  value       = azurerm_resource_group.rg.id
  sensitive   = false
}

# ============================================
# Azure OpenAI Service
# ============================================

output "azure_openai_endpoint" {
  description = "HTTPS endpoint URL for Azure OpenAI service"
  value       = module.azure_openai.azure_openai_endpoint
  sensitive   = false
}

output "azure_openai_name" {
  description = "Name of the Azure OpenAI service instance"
  value       = module.azure_openai.azure_openai_name
  sensitive   = false
}

output "azure_openai_config" {
  description = "Azure OpenAI configuration for applications"
  value       = module.azure_openai.azure_openai_config
  sensitive   = false
}

output "azure_openai_environment_variables" {
  description = "Environment variables for Azure OpenAI integration"
  value       = module.azure_openai.environment_variables
  sensitive   = true
}

# ============================================
# Azure Kubernetes Service (AKS)
# ============================================

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = module.aks.cluster_name
  sensitive   = false
}

output "aks_cluster_id" {
  description = "Full resource ID of the AKS cluster"
  value       = module.aks.cluster_id
  sensitive   = false
}

output "aks_cluster_fqdn" {
  description = "FQDN of the AKS cluster API server"
  value       = module.aks.cluster_fqdn
  sensitive   = false
}

output "aks_node_resource_group" {
  description = "Resource group containing AKS node resources"
  value       = module.aks.node_resource_group
  sensitive   = false
}

output "aks_kubelet_identity_client_id" {
  description = "Client ID of the kubelet managed identity"
  value       = module.aks.kubelet_identity_client_id
  sensitive   = false
}

output "aks_kubelet_identity_object_id" {
  description = "Object ID of the kubelet managed identity"
  value       = module.aks.kubelet_identity_object_id
  sensitive   = false
}

output "aks_oidc_issuer_url" {
  description = "OIDC issuer URL for workload identity federation"
  value       = module.aks.oidc_issuer_url
  sensitive   = false
}

# ============================================
# Azure Container Registry (ACR)
# ============================================

output "acr_name" {
  description = "Name of the Azure Container Registry"
  value       = module.aks.acr_name
  sensitive   = false
}

output "acr_login_server" {
  description = "Login server URL for the Azure Container Registry"
  value       = module.aks.acr_login_server
  sensitive   = false
}

output "acr_admin_username" {
  description = "Admin username for ACR (if admin access enabled)"
  value       = module.aks.acr_admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "Admin password for ACR (if admin access enabled)"
  value       = module.aks.acr_admin_password
  sensitive   = true
}

# ============================================
# Cosmos DB
# ============================================

output "cosmosdb_account_name" {
  description = "Name of the Cosmos DB account"
  value       = module.cosmosdb.account_name
  sensitive   = false
}

output "cosmosdb_endpoint" {
  description = "HTTPS endpoint URL for Cosmos DB"
  value       = module.cosmosdb.endpoint
  sensitive   = false
}

output "cosmosdb_database_name" {
  description = "Name of the Cosmos DB database"
  value       = module.cosmosdb.database_name
  sensitive   = false
}

output "cosmosdb_primary_key" {
  description = "Primary access key for Cosmos DB"
  value       = module.cosmosdb.primary_key
  sensitive   = true
}

output "cosmosdb_secondary_key" {
  description = "Secondary access key for Cosmos DB"
  value       = module.cosmosdb.secondary_key
  sensitive   = true
}

output "cosmosdb_connection_string" {
  description = "Primary connection string for Cosmos DB"
  value       = module.cosmosdb.connection_string
  sensitive   = true
}

# ============================================
# Virtual Network & Networking
# ============================================

output "vnet_name" {
  description = "Name of the virtual network"
  value       = module.networking.vnet_name
  sensitive   = false
}

output "vnet_id" {
  description = "Resource ID of the virtual network"
  value       = module.networking.vnet_id
  sensitive   = false
}

output "aks_subnet_id" {
  description = "Resource ID of the AKS subnet"
  value       = module.networking.aks_subnet_id
  sensitive   = false
}

output "db_subnet_id" {
  description = "Resource ID of the database subnet"
  value       = module.networking.db_subnet_id
  sensitive   = false
}

output "portal_public_ip" {
  description = "Public IP address for the portal"
  value       = module.networking.portal_public_ip
  sensitive   = false
}

# ============================================
# App Service / Backend Application
# ============================================

output "api_domain" {
  description = "Domain name for the API"
  value       = module.app_service.api_domain
  sensitive   = false
}

output "portal_domain" {
  description = "Domain name for the portal"
  value       = module.app_service.portal_domain
  sensitive   = false
}

output "api_url" {
  description = "Full URL for the API"
  value       = module.app_service.api_url
  sensitive   = false
}

# ============================================
# Backend Environment Configuration
# ============================================

output "backend_environment_variables" {
  description = "Environment variables for backend configuration"
  value = merge(
    module.azure_openai.environment_variables,
    {
      COSMOSDB_ENDPOINT      = module.cosmosdb.endpoint
      COSMOSDB_DATABASE_NAME = module.cosmosdb.database_name
    }
  )
  sensitive = true
}

# ============================================
# Environment Configuration
# ============================================

output "environment_name" {
  description = "Name of the deployment environment"
  value       = var.tags.environment
  sensitive   = false
}

output "environment_tags" {
  description = "Common tags applied to all resources"
  value       = var.tags
  sensitive   = false
}

# ============================================
# Kubernetes Configuration
# ============================================

output "kubeconfig" {
  description = "Kubernetes configuration for cluster access"
  value       = module.aks.kubeconfig
  sensitive   = true
}

output "kubernetes_cluster_ca_certificate" {
  description = "Base64 encoded CA certificate for the Kubernetes cluster"
  value       = module.aks.cluster_ca_certificate
  sensitive   = true
}

output "kubernetes_host" {
  description = "Kubernetes API server endpoint"
  value       = module.aks.host
  sensitive   = false
}

# ============================================
# Summary Information
# ============================================

output "deployment_summary" {
  description = "High-level summary of the deployed infrastructure"
  value = {
    environment         = var.tags.environment
    region             = var.location
    resource_group     = azurerm_resource_group.rg.name
    aks_cluster        = module.aks.cluster_name
    cosmosdb_account   = module.cosmosdb.account_name
    azure_openai       = module.azure_openai.azure_openai_name
    api_domain         = module.app_service.api_domain
    portal_domain      = module.app_service.portal_domain
    deployment_time    = timestamp()
  }
  sensitive = false
}

# ============================================
# Integration Endpoints
# ============================================

output "integration_endpoints" {
  description = "Map of all service endpoints for easy reference"
  value = {
    azure_openai     = module.azure_openai.azure_openai_endpoint
    cosmosdb         = module.cosmosdb.endpoint
    api_service      = module.app_service.api_url
    kubernetes_api   = module.aks.host
    container_registry = module.aks.acr_login_server
  }
  sensitive = false
}
