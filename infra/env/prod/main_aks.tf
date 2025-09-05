# ============================================
# PROD Environment - Azure Kubernetes Service
# ============================================
# This file contains AKS and related resources for the PROD environment
# No ACA resources are included to maintain environment isolation

# Data sources for current Azure configuration
data "azurerm_client_config" "current" {}

# Random suffix for unique resource naming
resource "random_string" "unique_suffix" {
  length  = 6
  lower   = true
  upper   = false
  numeric = true
  special = false
}

# ============================================
# Resource Group
# ============================================

resource "azurerm_resource_group" "this" {
  name     = "rg-therapy-engage-${var.tags.environment}"
  location = var.location
  tags     = var.tags
}

# ============================================
# Shared Modules (when needed for PROD)
# ============================================

# Networking Module
module "networking" {
  source          = "../../modules/networking"
  location        = var.location
  resource_group  = azurerm_resource_group.this.name
  vnet_cidr       = var.vnet_cidr
  aks_subnet_cidr = var.aks_subnet_cidr
  db_subnet_cidr  = var.db_subnet_cidr
  tags            = var.tags
}

# AKS Module
module "aks" {
  source         = "../../modules/aks"
  resource_group = azurerm_resource_group.this.name
  location       = var.location
  vnet_subnet_id = module.networking.aks_subnet_id
  node_size      = var.node_size
  node_count     = var.node_count
  tags           = var.tags
}

# CosmosDB Module (if needed for PROD)
# module "cosmosdb" {
#   source              = "../../modules/cosmosdb"
#   location            = var.location
#   resource_group_name = azurerm_resource_group.this.name
#   database_name       = "therapyengage"
#   tags                = var.tags
# }

# Azure OpenAI Module (if needed for PROD)
# module "azure_openai" {
#   source              = "../../modules/azure_openai"
#   name                = "therapyengage-openai-${var.tags.environment}"
#   location            = "North Europe"
#   resource_group_name = azurerm_resource_group.this.name
#   tags = merge(var.tags, {
#     Component = "ai-services"
#     Purpose   = "sentiment-analysis"
#   })
# }

# GitHub Actions OIDC Integration (for PROD)
# module "gha_oidc" {
#   source = "../../modules/gha-oidc"
#   
#   project_name         = "therapy-engage"
#   environment          = var.tags.environment
#   github_repository    = var.github_repository
#   github_branch        = var.github_branch
#   resource_group_id    = azurerm_resource_group.this.id
#   enable_pr_credential = false  # PROD should not allow PR deployments
# }
