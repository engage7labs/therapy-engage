variable "resource_group" {
  description = "Azure resource group name"
  type        = string
}

variable "backend_public_ip" {
  description = "Public IP for backend LoadBalancer"
  type        = string
}

variable "kubernetes_cluster_id" {
  description = "AKS cluster ID for dependency"
  type        = string
}

variable "ssl_email" {
  description = "Email for Let's Encrypt SSL certificates"
  type        = string
  default     = "x24130664@student.ncirl.ie"
}

variable "api_domain" {
  description = "Domain for backend API"
  type        = string
  default     = "therapyengage-api.azurewebsites.net"
}

variable "portal_domain" {
  description = "Domain for web portal"
  type        = string
  default     = "therapyengage-portal.azurewebsites.net"
}

variable "backend_namespace" {
  description = "Kubernetes namespace for backend"
  type        = string
  default     = "default"
}

variable "portal_namespace" {
  description = "Kubernetes namespace for portal"
  type        = string
  default     = "default"
}

variable "backend_service_name" {
  description = "Backend service name"
  type        = string
  default     = "backend-app-service"
}

variable "portal_service_name" {
  description = "Portal service name"
  type        = string
  default     = "portal-service"
}

variable "enable_portal_ingress" {
  description = "Enable portal ingress (set false until portal is deployed)"
  type        = bool
  default     = false
}