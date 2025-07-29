terraform {
  required_version = ">= 1.7"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# ❶ RG raiz
resource "azurerm_resource_group" "rg" {
  name     = "rg-therapy-${var.tags.environment}"
  location = var.location
  tags     = var.tags
}

module "networking" {
  source           = "./modules/networking"
  location         = var.location
  resource_group   = azurerm_resource_group.rg.name
  vnet_cidr        = var.vnet_cidr
  aks_subnet_cidr  = var.aks_subnet_cidr
  db_subnet_cidr   = var.db_subnet_cidr
  tags             = var.tags
}
output "portal_public_ip" {
  value = module.networking.portal_public_ip
}
module "aks" {
  source            = "./modules/aks"
  resource_group    = azurerm_resource_group.rg.name
  location          = var.location
  vnet_subnet_id    = module.networking.aks_subnet_id
  node_size         = var.node_size
  node_count        = var.node_count
  tags              = var.tags
}
