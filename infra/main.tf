terraform {
  required_version = ">= 1.7"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0"
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

output "portal_public_ip" {
  value = module.networking.portal_public_ip
}

# Note: Backend IP (4.207.239.129) is managed by AKS LoadBalancer

module "aks" {
  source            = "./modules/aks"
  resource_group    = azurerm_resource_group.rg.name
  location          = var.location
  vnet_subnet_id    = module.networking.aks_subnet_id
  node_size         = var.node_size
  node_count        = var.node_count
  tags              = var.tags
}