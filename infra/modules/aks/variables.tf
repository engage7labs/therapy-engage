variable "name_prefix" {
  description = "Resource name prefix for aks module"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
