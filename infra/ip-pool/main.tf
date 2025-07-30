# infra/ip-pool/main.tf - ONE module, TWO IPs
terraform {
  required_version = ">=1.7"
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = ">=3.0" }
  }
  backend "azurerm" {
    resource_group_name  = "rg-tfstate"
    storage_account_name = "sttfdev"
    container_name       = "tfstate"
    key                  = "ip-pool.tfstate" # independent file
  }
}

provider "azurerm" {
  features {}
}

variable "location" {
  type    = string
  default = "northeurope"
}

variable "resource_group" {
  type    = string
  default = "rg-therapy-dev"
}

variable "tags" {
  type = map(string)
  default = {
    environment = "dev"
    project     = "therapy-engage"
  }
}

# IP for BACKEND ingress
resource "azurerm_public_ip" "backend" {
  name                = "pip-backend"
  location            = var.location
  resource_group_name = var.resource_group
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = merge(var.tags, { role = "backend-ingress" })

  lifecycle {
    prevent_destroy = true # <<< survives destroy
  }
}

# IP for WEB portal ingress
resource "azurerm_public_ip" "portal" {
  name                = "pip-portal"
  location            = var.location
  resource_group_name = var.resource_group
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = merge(var.tags, { role = "portal-ingress" })

  lifecycle {
    prevent_destroy = true # <<< survives destroy
  }
}

output "backend_ip" {
  value = azurerm_public_ip.backend.ip_address
}

output "portal_ip" {
  value = azurerm_public_ip.portal.ip_address
}