variable "name" {
  description = "Name of the CosmosDB account"
  type        = string
}

variable "location" {
  description = "Azure region for the CosmosDB account"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "database_name" {
  description = "Name of the database to create"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
