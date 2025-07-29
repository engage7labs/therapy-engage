resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-therapy"
  location            = var.location
  resource_group_name = var.resource_group
  dns_prefix          = "therapyaks"

  default_node_pool {
    name       = "system"
    vm_size    = var.node_size
    node_count = var.node_count
    vnet_subnet_id = var.vnet_subnet_id
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}
