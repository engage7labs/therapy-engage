output "nginx_ingress_ip" {
  description = "NGINX Ingress Controller IP"
  value       = var.backend_public_ip
}

output "api_url" {
  description = "Backend API URL"
  value       = "https://${var.api_domain}"
}

output "portal_url" {
  description = "Portal Web URL"
  value       = "https://${var.portal_domain}"
}

output "ingress_namespace" {
  description = "NGINX Ingress namespace"
  value       = helm_release.ingress_nginx.namespace
}

output "cert_manager_namespace" {
  description = "cert-manager namespace"
  value       = helm_release.cert_manager.namespace
}