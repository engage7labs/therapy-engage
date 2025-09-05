# ============================================
# Variables for PROD Environment (AKS)
# ============================================

variable "location" {
  description = "Azure region for PROD resources"
  type        = string
  default     = "North Europe"
}

variable "tags" {
  description = "Tags to apply to all PROD resources"
  type        = map(string)
  default = {
    environment = "prod"
    project     = "therapy-engage"
    managed_by  = "terraform"
  }
}

# Networking Configuration
variable "vnet_cidr" {
  description = "CIDR block for the virtual network"
  type        = string
  default     = "10.0.0.0/16"
}

variable "aks_subnet_cidr" {
  description = "CIDR block for the AKS subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "db_subnet_cidr" {
  description = "CIDR block for the database subnet"
  type        = string
  default     = "10.0.2.0/24"
}

# AKS Configuration
variable "node_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_DS2_v2"
}

variable "node_count" {
  description = "Number of AKS nodes"
  type        = number
  default     = 2
}

# GitHub Integration
variable "github_repository" {
  description = "GitHub repository for OIDC integration"
  type        = string
  default     = "TherapyEngageOrg/therapy-engage"
}

variable "github_branch" {
  description = "GitHub branch for OIDC integration"
  type        = string
  default     = "main"
}
