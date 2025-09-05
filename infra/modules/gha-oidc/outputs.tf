# modules/gha-oidc/outputs.tf

output "app_client_id" {
  description = "Client ID of the AAD application used by GitHub Actions OIDC"
  value       = azuread_application.github_actions.client_id
  sensitive   = false
}

output "service_principal_id" {
  description = "Object ID of the service principal"
  value       = azuread_service_principal.github_actions.object_id
  sensitive   = false
}

output "application_id" {
  description = "Application (client) ID"
  value       = azuread_application.github_actions.client_id
  sensitive   = false
}
