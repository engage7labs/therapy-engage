terraform {
  required_version = ">= 1.7"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = ">= 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0"
    }
  }
}

# Subscription comes from environment variable or GitHub secret
# Local: export ARM_SUBSCRIPTION_ID="your-sub-id"
# GitHub: Set as organization/repository secret
provider "azurerm" {
  features {}
  # subscription_id is read from ARM_SUBSCRIPTION_ID env var automatically
}

provider "azuread" {
  # tenant_id is read from ARM_TENANT_ID env var automatically
}

# Data sources for current Azure configuration
data "azurerm_client_config" "current" {}

# ============================================
# Random suffix for unique resource naming
# ============================================
resource "random_string" "unique_suffix" {
  length  = 6
  lower   = true
  upper   = false
  numeric = true
  special = false
}

# Note: Helm and Kubernetes providers configured after AKS is created
# This will be configured during apply phase

# Environment validation - ensures we're in the right environment
variable "expected_environment" {
  type        = string
  description = "Expected environment name for safety checks"
  default     = ""
}

locals {
  environment = var.tags.environment

  # Validation check
  environment_mismatch = var.expected_environment != "" && var.expected_environment != local.environment
}

# Safety check to prevent wrong environment deployments
resource "null_resource" "environment_check" {
  count = local.environment_mismatch ? 1 : 0

  provisioner "local-exec" {
    command = "echo 'ERROR: Expected environment ${var.expected_environment} but got ${local.environment}' && exit 1"
  }
}

# ❶ RG raiz
resource "azurerm_resource_group" "rg" {
  name     = "rg-therapy-${var.tags.environment}"
  location = var.location
  tags     = var.tags
}

module "networking" {
  source          = "./modules/networking"
  location        = var.location
  resource_group  = azurerm_resource_group.rg.name
  vnet_cidr       = var.vnet_cidr
  aks_subnet_cidr = var.aks_subnet_cidr
  db_subnet_cidr  = var.db_subnet_cidr
  tags            = var.tags
}

# Note: Backend IP (20.13.251.223) is managed by AKS LoadBalancer
# App Service domains will redirect to AKS Ingress

module "aks" {
  source         = "./modules/aks"
  resource_group = azurerm_resource_group.rg.name
  location       = var.location
  vnet_subnet_id = module.networking.aks_subnet_id
  node_size      = var.node_size
  node_count     = var.node_count
  tags           = var.tags
}

module "app_service" {
  source = "./modules/app_service"

  location       = var.location
  resource_group = azurerm_resource_group.rg.name
  environment    = var.tags.environment
  aks_ingress_ip = "20.13.251.223"
  tags           = var.tags
}

# CosmosDB for patient video storage and analytics
module "cosmosdb" {
  source              = "./modules/cosmosdb"
  name                = "therapyengage-cosmosdb-${var.tags.environment}"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  database_name       = "therapyengage"
  tags                = var.tags
}

# Azure OpenAI for sentiment analysis and AI features
module "azure_openai" {
  source              = "./modules/azure_openai"
  name                = "therapyengage-openai-${var.tags.environment}"
  location            = "North Europe" # Azure OpenAI availability
  resource_group_name = azurerm_resource_group.rg.name

  tags = merge(var.tags, {
    Component = "ai-services"
    Purpose   = "sentiment-analysis"
  })

  # Optional: Enable diagnostics if we have Log Analytics
  # enable_diagnostics          = true
  # log_analytics_workspace_id  = module.monitoring.log_analytics_workspace_id
}

# GitHub Actions OIDC Integration
module "gha_oidc" {
  source = "./modules/gha-oidc"

  project_name         = "therapy-engage"
  environment          = var.tags.environment
  github_repository    = "TherapyEngageOrg/therapy-engage"
  github_branch        = var.tags.environment == "dev" ? "dev" : "main"
  resource_group_id    = azurerm_resource_group.rg.id
  enable_pr_credential = var.tags.environment == "dev" ? true : false
}

# ============================================
# Container Apps Environment and Applications
# ============================================

# Container Apps Environment
resource "azurerm_container_app_environment" "dev_env" {
  name                       = "cae-therapy-engage-${var.tags.environment}-${random_string.unique_suffix.result}"
  location                   = var.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = null # Optional: Add Log Analytics if available

  tags = merge(var.tags, {
    Component = "container-apps-environment"
  })
}

# Backend Container App
resource "azurerm_container_app" "backend" {
  name                         = "ca-therapy-backend-${var.tags.environment}"
  container_app_environment_id = azurerm_container_app_environment.dev_env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "backend"
      image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest" # Placeholder
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    traffic_weight {
      percentage = 100
    }
  }

  tags = merge(var.tags, {
    Component = "backend-api"
    Service   = "nestjs"
  })
}

# Frontend Container App  
resource "azurerm_container_app" "frontend" {
  name                         = "ca-therapy-frontend-${var.tags.environment}"
  container_app_environment_id = azurerm_container_app_environment.dev_env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "frontend"
      image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest" # Placeholder
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "NEXT_PUBLIC_API_URL"
        value = "https://${azurerm_container_app.backend.latest_revision_fqdn}"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    traffic_weight {
      percentage = 100
    }
  }

  tags = merge(var.tags, {
    Component = "frontend-web"
    Service   = "nextjs"
  })
}