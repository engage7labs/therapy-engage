##############################
# modules/networking/variables.tf
##############################

# Região e RG onde o VNet/Subnets serão criados
variable "location" {
  description = "Azure region for networking resources"
  type        = string
}

variable "resource_group" {
  description = "Name of the existing resource group"
  type        = string
}

# CIDRs
variable "vnet_cidr" {
  description = "CIDR block for the virtual network"
  type        = string
}

variable "aks_subnet_cidr" {
  description = "CIDR block for the AKS node-pool subnet"
  type        = string
}

variable "db_subnet_cidr" {
  description = "CIDR block for the database / private-link subnet"
  type        = string
}

# Tags opcionais
variable "tags" {
  description = "Common tags applied to networking resources"
  type        = map(string)
  default     = {}
}
variable "site_public_ip_name" {
  description = "Nome do IP fixo para o portal Web/Ingress"
  type        = string
  default     = "pip-portal"
}