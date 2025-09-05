terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

resource "azurerm_cognitive_account" "this" {
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  kind                = "OpenAI"
  sku_name            = "S0"

  public_network_access_enabled = true

  # Configurações de rede e segurança
  network_acls {
    default_action = "Allow"
  }

  # Configurações específicas do OpenAI
  custom_subdomain_name = var.custom_subdomain_name != null ? var.custom_subdomain_name : var.name

  tags = var.tags

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      # Ignorar mudanças em configurações que podem ser alteradas externamente
      custom_subdomain_name,
    ]
  }
}

# Access to the cognitive account primary key
# Note: The primary_access_key is available directly from the azurerm_cognitive_account resource

# Configuração de diagnóstico (opcional, mas recomendado)
resource "azurerm_monitor_diagnostic_setting" "this" {
  count = var.enable_diagnostics ? 1 : 0

  name                       = "${var.name}-diagnostics"
  target_resource_id         = azurerm_cognitive_account.this.id
  log_analytics_workspace_id = var.log_analytics_workspace_id

  enabled_log {
    category = "Audit"
  }

  enabled_log {
    category = "RequestResponse"
  }

  metric {
    category = "AllMetrics"
  }
}
