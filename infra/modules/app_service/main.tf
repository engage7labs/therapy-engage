# App Service for DNS generation
# This creates azurewebsites.net domains we can use

# App Service Plan (cheapest tier)
resource "azurerm_service_plan" "main" {
  name                = "plan-therapy-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group
  os_type             = "Linux"
  sku_name            = "F1" # Free tier
  tags                = var.tags
}

# App Service for API domain
resource "azurerm_linux_web_app" "api" {
  name                = "therapyengage-api-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = false # Required for F1 tier

    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "~18"
    "REDIRECT_URL"                 = "http://${var.aks_ingress_ip}/graphql"
  }

  tags = var.tags
}

# App Service for Portal domain (future)
resource "azurerm_linux_web_app" "portal" {
  name                = "therapyengage-portal-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = false # Required for F1 tier

    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "~18"
    "REDIRECT_URL"                 = "http://${var.aks_ingress_ip}/"
  }

  tags = var.tags
}