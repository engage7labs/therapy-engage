# modules/gha-oidc/main.tf
# GitHub Actions OIDC Integration with Azure

terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

data "azuread_client_config" "current" {}

# Azure AD Application for GitHub Actions
resource "azuread_application" "github_actions" {
  display_name = "GitHub Actions - ${var.project_name}"
  owners       = [data.azuread_client_config.current.object_id]

  tags = ["github-actions", "oidc", var.environment]
}

# Service Principal for the application
resource "azuread_service_principal" "github_actions" {
  client_id                    = azuread_application.github_actions.client_id
  app_role_assignment_required = false
  owners                       = [data.azuread_client_config.current.object_id]

  tags = ["github-actions", "oidc", var.environment]
}

# Federated credential for GitHub Actions OIDC
resource "azuread_application_federated_identity_credential" "github_main" {
  application_id = azuread_application.github_actions.id
  display_name   = "GitHub Actions - ${var.environment} branch"
  description    = "GitHub Actions OIDC for ${var.environment} branch"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"
}

# Optional: Federated credential for pull requests
resource "azuread_application_federated_identity_credential" "github_pr" {
  count = var.enable_pr_credential ? 1 : 0

  application_id = azuread_application.github_actions.id
  display_name   = "GitHub Actions - PR"
  description    = "GitHub Actions OIDC for Pull Requests"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_repository}:pull_request"
}

# Role assignment: Contributor on the resource group
resource "azurerm_role_assignment" "github_actions_contributor" {
  scope                = var.resource_group_id
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.github_actions.object_id
}
