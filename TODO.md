# TODO - Infrastructure as Code Improvements

**Date:** 31 July 2025  
**Project:** Therapy Engage Platform  
**Context:** Manual steps that need to be automated in Terraform

---

## 🎯 High Priority - HTTPS/SSL Automation

### 1. NGINX Ingress Controller
**Current:** Manual HELM installation  
**Target:** Terraform HELM provider  
```hcl
# TODO: Add to infra/modules/ingress/
resource "helm_release" "nginx_ingress" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-nginx"
  create_namespace = true
}
```

### 2. cert-manager
**Current:** Manual HELM installation  
**Target:** Terraform HELM provider  
```hcl
# TODO: Add to infra/modules/cert_manager/
resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  namespace  = "cert-manager"
  create_namespace = true
  set {
    name  = "installCRDs"
    value = "true"
  }
}
```

### 3. Let's Encrypt ClusterIssuers
**Current:** Manual kubectl apply  
**Target:** Terraform kubernetes provider  
```hcl
# TODO: Add to infra/modules/cert_manager/
resource "kubernetes_manifest" "letsencrypt_prod" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata = {
      name = "letsencrypt-prod"
    }
    spec = {
      acme = {
        server = "https://acme-v02.api.letsencrypt.org/directory"
        email  = var.letsencrypt_email
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
}
```

### 4. Network Security Group Rules
**Current:** Manual Azure CLI commands  
**Target:** Terraform azurerm provider  
```hcl
# TODO: Add to infra/modules/networking/
resource "azurerm_network_security_rule" "allow_http" {
  name                        = "Allow-HTTP-Inbound"
  priority                    = 1000
  direction                   = "Inbound"
  access                     = "Allow"
  protocol                   = "Tcp"
  source_port_range          = "*"
  destination_port_range     = "80"
  source_address_prefix      = "*"
  destination_address_prefix = "*"
  resource_group_name        = data.azurerm_resource_group.aks_nodes.name
  network_security_group_name = data.azurerm_network_security_group.aks_nodes.name
}

resource "azurerm_network_security_rule" "allow_https" {
  name                        = "Allow-HTTPS-Inbound"
  priority                    = 1001
  direction                   = "Inbound"
  access                     = "Allow"
  protocol                   = "Tcp"
  source_port_range          = "*"
  destination_port_range     = "443"
  source_address_prefix      = "*"
  destination_address_prefix = "*"
  resource_group_name        = data.azurerm_resource_group.aks_nodes.name
  network_security_group_name = data.azurerm_network_security_group.aks_nodes.name
}
```

### 5. Ingress Resource
**Current:** Manual kubectl apply  
**Target:** Terraform kubernetes provider  
```hcl
# TODO: Add to infra/modules/ingress/
resource "kubernetes_ingress_v1" "backend_api" {
  metadata {
    name      = "backend-api-ingress"
    namespace = "default"
    annotations = {
      "cert-manager.io/cluster-issuer" = "letsencrypt-prod"
      "acme.cert-manager.io/http01-edit-in-place" = "true"
    }
  }
  spec {
    ingress_class_name = "nginx"
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
              name = "backend-app-service"
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 🔧 Medium Priority - Infrastructure Improvements

### 6. DNS Management
**Current:** Using sslip.io for development  
**Target:** Azure DNS Zone with proper domain  
```hcl
# TODO: Add to infra/modules/dns/
resource "azurerm_dns_zone" "main" {
  name                = var.domain_name
  resource_group_name = var.resource_group_name
}

resource "azurerm_dns_a_record" "api" {
  name                = "api"
  zone_name           = azurerm_dns_zone.main.name
  resource_group_name = var.resource_group_name
  ttl                 = 300
  records             = [var.api_ip_address]
}
```

### 7. Monitoring and Logging
**Current:** Basic Azure Monitor  
**Target:** Comprehensive observability stack  
```hcl
# TODO: Add to infra/modules/monitoring/
resource "helm_release" "prometheus" {
  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = "monitoring"
  create_namespace = true
}
```

### 8. Secret Management
**Current:** Manual secret creation  
**Target:** Azure Key Vault integration  
```hcl
# TODO: Add to infra/modules/secrets/
resource "azurerm_key_vault" "main" {
  name                = "kv-therapy-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"
}
```

---

## 🚫 Infrastructure Cleanup - App Service Removal

### 12. Remove Unused App Service Module
**Current:** App Service creating unnecessary azurewebsites.net domains  
**Issue:** Portal will be hosted on AKS, not App Service  
**Target:** Remove app_service module completely  

**Files to modify:**
```hcl
# infra/main.tf - REMOVE these blocks:
module "app_service" {
  source = "./modules/app_service"
  # ... entire block to be removed
}

# Remove outputs:
output "api_domain" { ... }
output "portal_domain" { ... }
output "api_url" { ... }
```

**Files to DELETE:**
- `infra/modules/app_service/main.tf`
- `infra/modules/app_service/outputs.tf`  
- `infra/modules/app_service/variables.tf`
- Entire `infra/modules/app_service/` directory

**Reasoning:**
- ✅ Portal will run as **containerized Next.js in AKS**
- ✅ Ingress NGINX will handle routing directly
- ✅ No need for App Service proxy/redirect
- ✅ **Cost savings**: Remove F1 App Service Plan
- ✅ **Simpler architecture**: Direct AKS hosting

**Implementation:**
1. Remove app_service module from main.tf
2. Delete app_service directory  
3. Update any references to app_service outputs
4. Test terraform plan (should remove 3 resources)
5. Apply to cleanup Azure resources

**Priority:** Medium (after Frontend Power Sprint)  
**Timeline:** Sprint 3 or during IaC cleanup phase  
**Savings:** ~$10-15/month App Service Plan cost

---

## 📋 Low Priority - Nice to Have

### 9. GitOps with ArgoCD
**Current:** Manual deployments  
**Target:** GitOps workflow  

### 10. External DNS
**Current:** Manual DNS management  
**Target:** Automatic DNS record creation  

### 11. Backup and Disaster Recovery
**Current:** Basic Azure backups  
**Target:** Automated backup policies  

---

## 🚫 Files to Clean Up

### Temporary YAML Files (DELETE)
- `backend-ingress.yaml` - Old version
- `backend-ingress-real.yaml` - Test version  
- `backend-ingress-https.yaml` - Intermediate version
- `backend-ingress-sslip.yaml` - Old sslip version
- `backend-ingress-direct.yaml` - Test version
- `backend-ingress-staging.yaml` - Staging only

### Files to Keep
- `backend-ingress-final.yaml` - Current production ingress
- `letsencrypt-staging.yaml` - Development ClusterIssuer
- `letsencrypt-prod.yaml` - Production ClusterIssuer (if created)
- `charts/backend-app/*.yaml` - HELM chart templates

---

## 📝 Implementation Notes

### Phase 1: Core HTTPS (Priority 1-5)
Timeline: Next sprint  
Goal: Automate current manual HTTPS setup  

### Phase 2: Infrastructure Hardening (Priority 6-8)  
Timeline: Following sprint  
Goal: Production-ready infrastructure  

### Phase 3: Advanced Features (Priority 9-11)
Timeline: Future releases  
Goal: Enterprise-grade platform  

---

## 🎯 Success Criteria

- [ ] Zero manual steps for HTTPS setup
- [ ] Complete infrastructure reproducibility  
- [ ] Terraform state manages all resources
- [ ] Documentation updated with IaC approach
- [ ] CI/CD pipeline validates infrastructure

---

*This TODO serves as a roadmap for converting manual infrastructure steps into proper Infrastructure as Code using Terraform.*