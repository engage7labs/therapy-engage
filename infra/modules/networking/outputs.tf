# Network resources
output "vnet_id" {
  value = azurerm_virtual_network.vnet.id
}

output "aks_subnet_id" {
  value = azurerm_subnet.aks.id
}

output "db_subnet_id" {
  value = azurerm_subnet.db.id
}

# Public IPs - for LoadBalancer services
output "portal_public_ip" {
  value       = azurerm_public_ip.portal.ip_address
  description = "Static IP for portal ingress/LoadBalancer"
}

# Public IP resource names - for LoadBalancer annotations
output "portal_public_ip_name" {
  value       = azurerm_public_ip.portal.name
  description = "Name of portal public IP resource"
}
