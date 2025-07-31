output "api_domain" {
  description = "API domain name"
  value       = azurerm_linux_web_app.api.default_hostname
}

output "portal_domain" {
  description = "Portal domain name"
  value       = azurerm_linux_web_app.portal.default_hostname
}

output "api_url" {
  description = "Full API URL"
  value       = "https://${azurerm_linux_web_app.api.default_hostname}"
}

output "portal_url" {
  description = "Full Portal URL"
  value       = "https://${azurerm_linux_web_app.portal.default_hostname}"
}