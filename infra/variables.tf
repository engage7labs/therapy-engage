variable "location" { type = string }
variable "vnet_cidr" { type = string }
variable "aks_subnet_cidr" { type = string }
variable "db_subnet_cidr" { type = string }
variable "node_size" { type = string default = "Standard_DS2_v2" }
variable "node_count" { type = number default = 2 }
variable "tags" { type = map(string) }
