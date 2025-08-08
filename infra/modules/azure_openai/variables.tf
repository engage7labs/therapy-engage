variable "name" {
  description = "Nome do recurso Azure OpenAI"
  type        = string
  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.name))
    error_message = "O nome deve conter apenas letras minúsculas, números e hífens."
  }
}

variable "location" {
  description = "Localização do recurso Azure"
  type        = string
  default     = "North Europe"
}

variable "resource_group_name" {
  description = "Nome do grupo de recursos onde o Azure OpenAI será criado"
  type        = string
}

variable "tags" {
  description = "Tags para aplicar ao recurso"
  type        = map(string)
  default     = {}
}

variable "enable_diagnostics" {
  description = "Habilitar configurações de diagnóstico"
  type        = bool
  default     = false
}

variable "log_analytics_workspace_id" {
  description = "ID do workspace do Log Analytics para diagnósticos"
  type        = string
  default     = null
}

variable "sku_name" {
  description = "SKU do Azure OpenAI"
  type        = string
  default     = "S0"
  validation {
    condition     = contains(["S0"], var.sku_name)
    error_message = "SKU deve ser S0 para Azure OpenAI."
  }
}

variable "public_network_access_enabled" {
  description = "Permitir acesso público à rede"
  type        = bool
  default     = true
}

variable "custom_subdomain_name" {
  description = "Nome do subdomínio customizado (se não especificado, usa o nome do recurso)"
  type        = string
  default     = null
}
