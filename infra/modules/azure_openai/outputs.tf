output "azure_openai_endpoint" {
  description = "Endpoint do Azure OpenAI"
  value       = azurerm_cognitive_account.this.endpoint
}

output "azure_openai_id" {
  description = "ID do recurso Azure OpenAI"
  value       = azurerm_cognitive_account.this.id
}

output "azure_openai_name" {
  description = "Nome do recurso Azure OpenAI"
  value       = azurerm_cognitive_account.this.name
}

output "azure_openai_location" {
  description = "Localização do Azure OpenAI"
  value       = azurerm_cognitive_account.this.location
}

output "azure_openai_primary_access_key" {
  description = "Chave primária de acesso do Azure OpenAI"
  value       = azurerm_cognitive_account.this.primary_access_key
  sensitive   = true
}

output "azure_openai_secondary_access_key" {
  description = "Chave secundária de acesso do Azure OpenAI"
  value       = azurerm_cognitive_account.this.secondary_access_key
  sensitive   = true
}

output "azure_openai_custom_subdomain" {
  description = "Subdomínio customizado do Azure OpenAI"
  value       = azurerm_cognitive_account.this.custom_subdomain_name
}

# Outputs formatados para uso em aplicações
output "azure_openai_config" {
  description = "Configuração completa do Azure OpenAI para aplicações"
  value = {
    endpoint         = azurerm_cognitive_account.this.endpoint
    resource_name    = azurerm_cognitive_account.this.name
    deployment_name  = "gpt-4" # Nome padrão do deployment (deve ser configurado manualmente)
    api_version      = "2024-02-15-preview"
    custom_subdomain = azurerm_cognitive_account.this.custom_subdomain_name
  }
  sensitive = false
}

# Output para variáveis de ambiente
output "environment_variables" {
  description = "Variáveis de ambiente para configuração da aplicação"
  value = {
    AZURE_OPENAI_ENDPOINT    = azurerm_cognitive_account.this.endpoint
    AZURE_OPENAI_RESOURCE    = azurerm_cognitive_account.this.name
    AZURE_OPENAI_DEPLOYMENT  = "gpt-4"
    AZURE_OPENAI_API_VERSION = "2024-02-15-preview"
  }
  sensitive = false
}
