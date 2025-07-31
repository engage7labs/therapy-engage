# NGINX Ingress Controller via Terraform
# Therapy Engage Platform - Ingress Module

# NGINX Ingress Controller
resource "helm_release" "ingress_nginx" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.10.1"
  namespace        = "ingress-nginx"
  create_namespace = true

  values = [
    <<EOF
controller:
  service:
    type: LoadBalancer
    loadBalancerIP: "${var.backend_public_ip}"
    annotations:
      service.beta.kubernetes.io/azure-load-balancer-resource-group: "${var.resource_group}"
  ingressClassResource:
    default: true
  metrics:
    enabled: true
EOF
  ]

  depends_on = [var.kubernetes_cluster_id]
}

# cert-manager for automatic SSL certificates
resource "helm_release" "cert_manager" {
  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = "v1.15.1"
  namespace        = "cert-manager"
  create_namespace = true

  values = [
    <<EOF
installCRDs: true
EOF
  ]

  depends_on = [helm_release.ingress_nginx]
}

# ClusterIssuer for Let's Encrypt
resource "kubernetes_manifest" "letsencrypt_issuer" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata = {
      name = "letsencrypt-prod"
    }
    spec = {
      acme = {
        server = "https://acme-v02.api.letsencrypt.org/directory"
        email  = var.ssl_email
        privateKeySecretRef = {
          name = "letsencrypt-prod-key"
        }
        solvers = [{
          http01 = {
            ingress = {
              ingressClassName = "nginx"
            }
          }
        }]
      }
    }
  }

  depends_on = [helm_release.cert_manager]
}

# Backend API Ingress
resource "kubernetes_ingress_v1" "backend_api" {
  metadata {
    name      = "backend-api-ingress"
    namespace = var.backend_namespace
    annotations = {
      "kubernetes.io/ingress.class"              = "nginx"
      "cert-manager.io/cluster-issuer"           = "letsencrypt-prod"
      "nginx.ingress.kubernetes.io/ssl-redirect" = "true"
    }
  }

  spec {
    tls {
      hosts       = [var.api_domain]
      secret_name = "backend-api-tls"
    }

    rule {
      host = var.api_domain
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = var.backend_service_name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }

  depends_on = [kubernetes_manifest.letsencrypt_issuer]
}

# Portal Web Ingress (for future use)
resource "kubernetes_ingress_v1" "portal_web" {
  count = var.enable_portal_ingress ? 1 : 0

  metadata {
    name      = "portal-web-ingress"
    namespace = var.portal_namespace
    annotations = {
      "kubernetes.io/ingress.class"              = "nginx"
      "cert-manager.io/cluster-issuer"           = "letsencrypt-prod"
      "nginx.ingress.kubernetes.io/ssl-redirect" = "true"
    }
  }

  spec {
    tls {
      hosts       = [var.portal_domain]
      secret_name = "portal-web-tls"
    }

    rule {
      host = var.portal_domain
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = var.portal_service_name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }

  depends_on = [kubernetes_manifest.letsencrypt_issuer]
}