# modules/gha-oidc/variables.tf

variable "project_name" {
  description = "Name of the project/application"
  type        = string
  default     = "therapy-engage"
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "github_repository" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
  default     = "TherapyEngageOrg/therapy-engage"
}

variable "github_branch" {
  description = "GitHub branch for OIDC federation"
  type        = string
  default     = "dev"
}

variable "resource_group_id" {
  description = "Resource group ID to grant permissions to"
  type        = string
}

variable "enable_pr_credential" {
  description = "Enable federated credential for pull requests"
  type        = bool
  default     = false
}
