variable "name_prefix" {
  description = "Resource name prefix for backend_app module"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
