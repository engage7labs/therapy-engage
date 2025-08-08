output "endpoint" {
  description = "CosmosDB endpoint URL"
  value       = azurerm_cosmosdb_account.this.endpoint
}

output "account_name" {
  description = "CosmosDB account name"
  value       = azurerm_cosmosdb_account.this.name
}

output "primary_key" {
  description = "CosmosDB primary key (sensitive)"
  value       = azurerm_cosmosdb_account.this.primary_key
  sensitive   = true
}

output "database_name" {
  description = "Name of the created database"
  value       = azurerm_cosmosdb_sql_database.this.name
}

output "container_name" {
  description = "Name of the patient videos container"
  value       = azurerm_cosmosdb_sql_container.patient_videos.name
}
