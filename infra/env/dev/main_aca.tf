# ============================================
# DEV Environment - Azure Container Apps
# ============================================
# This file contains only ACA resources for the DEV environment
# No AKS resources are included to maintain environment isolation

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
# Container Apps Environment
# ============================================

resource "azurerm_container_app_environment" "this" {
  name                = "cae-therapy-engage-${var.tags.environment}-${random_string.unique_suffix.result}"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name

  tags = merge(var.tags, {
    Component = "container-apps-environment"
  })
}

# ============================================
# Backend Container App
# ============================================

resource "azurerm_container_app" "backend" {
  name                         = "ca-therapy-backend-${var.tags.environment}"
  container_app_environment_id = azurerm_container_app_environment.this.id
  resource_group_name          = azurerm_resource_group.this.name
  revision_mode                = "Single"

  template {
    container {
      name   = "backend"
      image  = var.backend_image
      cpu    = var.container_cpu
      memory = var.container_memory

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "3000"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = merge(var.tags, {
    Component = "backend-api"
    Service   = "nestjs"
  })
}

# ============================================
# Frontend Container App
# ============================================

resource "azurerm_container_app" "frontend" {
  name                         = "ca-therapy-frontend-${var.tags.environment}"
  container_app_environment_id = azurerm_container_app_environment.this.id
  resource_group_name          = azurerm_resource_group.this.name
  revision_mode                = "Single"

  template {
    container {
      name   = "frontend"
      image  = var.frontend_image
      cpu    = var.container_cpu
      memory = var.container_memory

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "3000"
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
      percentage      = 100
      latest_revision = true
    }
  }

  tags = merge(var.tags, {
    Component = "frontend-web"
    Service   = "nextjs"
  })
}
