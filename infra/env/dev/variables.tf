# ============================================
# Variables for DEV Environment (ACA)
# ============================================

variable "location" {
  description = "Azure region for DEV resources"
  type        = string
  default     = "North Europe"
}

variable "tags" {
  description = "Tags to apply to all DEV resources"
  type        = map(string)
  default = {
    environment = "dev"
    project     = "therapy-engage"
    managed_by  = "terraform"
  }
}

variable "github_repository" {
  description = "GitHub repository for OIDC integration (optional for DEV)"
  type        = string
  default     = "TherapyEngageOrg/therapy-engage"
}

variable "github_branch" {
  description = "GitHub branch for OIDC integration"
  type        = string
  default     = "dev"
}

# Container Apps Configuration
variable "frontend_image" {
  description = "Frontend container image"
  type        = string
  default     = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}

variable "backend_image" {
  description = "Backend container image"
  type        = string
  default     = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}

variable "container_cpu" {
  description = "CPU allocation for containers"
  type        = number
  default     = 0.25
}

variable "container_memory" {
  description = "Memory allocation for containers"
  type        = string
  default     = "0.5Gi"
}
