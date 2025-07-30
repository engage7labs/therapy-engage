resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-therapy"
  address_space       = [var.vnet_cidr]
  location            = var.location
  resource_group_name = var.resource_group
  tags                = var.tags
}

resource "azurerm_subnet" "aks" {
  name                 = "snet-aks"
  resource_group_name  = var.resource_group
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.aks_subnet_cidr]
}

resource "azurerm_subnet" "db" {
  name                 = "snet-db"
  resource_group_name  = var.resource_group
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.db_subnet_cidr]
}

# IP público para o portal web
resource "azurerm_public_ip" "portal" {
  name                = var.site_public_ip_name # Mantém o nome original
  location            = var.location
  resource_group_name = var.resource_group
  allocation_method   = "Static"
  sku                 = "Standard"
  tags                = merge(var.tags, { role = "portal-ingress" })

  lifecycle {
    prevent_destroy = true # Protege contra destroy acidental
  }
}
