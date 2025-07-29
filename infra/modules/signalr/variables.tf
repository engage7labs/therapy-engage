variable "name_prefix" {
  description = "Resource name prefix for signalr module"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
