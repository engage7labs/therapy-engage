location         = "northeurope"
vnet_cidr        = "10.10.0.0/16"
aks_subnet_cidr  = "10.10.1.0/24"
db_subnet_cidr   = "10.10.2.0/24"
node_size        = "Standard_DS2_v2"
node_count       = 2
tags = {
  environment = "dev"
  project     = "therapy-engage"
}
