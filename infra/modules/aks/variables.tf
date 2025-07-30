variable "resource_group" { type = string }
variable "location" { type = string }
variable "vnet_subnet_id" { type = string }
variable "node_size" { type = string }
variable "node_count" { type = number }
variable "tags" { type = map(string) }
