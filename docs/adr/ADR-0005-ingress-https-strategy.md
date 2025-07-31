# ADR-0005: NGINX Ingress and HTTPS Strategy

**File:** `docs/adr/ADR-0005-ingress-https-strategy.md`  
**Status:** Accepted  
**Date:** 31 July 2025

## Context

The Therapy Engage Platform requires secure HTTPS communication for healthcare data protection and compliance with GDPR/LGPD regulations. Current setup uses Azure LoadBalancer services, but production requires:

### Current State:
- **Backend API:** Direct LoadBalancer exposure on `4.207.239.129:80`
- **No SSL/TLS:** HTTP only (insecure for healthcare)
- **No domain names:** IP-based access only
- **No certificate management:** Manual SSL would be required

### Requirements:
- **Healthcare Security:** HTTPS mandatory for PHI (Protected Health Information)
- **Professional URLs:** Domain-based access for academic/professional demos
- **Automatic SSL:** Let's Encrypt integration for cost efficiency
- **Scalability:** Support for multiple services (API + Portal)

## Decision

Implement **NGINX Ingress Controller** with **automatic HTTPS** via cert-manager and Let's Encrypt.

### Architecture:
```
Internet → NGINX Ingress (4.207.239.129:443) → Internal Services
```

### Components:
1. **NGINX Ingress Controller** - Traffic routing and SSL termination
2. **cert-manager** - Automatic SSL certificate provisioning
3. **Let's Encrypt** - Free SSL certificates with auto-renewal
4. **Azure domains** - Cost-free domain strategy

### Domains:
- **Backend API:** `therapyengage-api.azurewebsites.net`
- **Web Portal:** `therapyengage-portal.azurewebsites.net`

## Options Considered

### Option 1: Azure Application Gateway (Rejected)
- **Pros:** Native Azure integration, WAF capabilities
- **Cons:** ~€200/month cost, overkill for student project

### Option 2: LoadBalancer + Manual SSL (Rejected)
- **Pros:** Simple architecture
- **Cons:** Manual certificate management, no auto-renewal, single service

### Option 3: NGINX Ingress + cert-manager (Chosen)
- **Pros:** Industry standard, automatic SSL, multi-service support, cost-effective
- **Cons:** Additional complexity, learning curve

### Option 4: Cloudflare Proxy (Rejected)
- **Pros:** Free SSL, DDoS protection
- **Cons:** External dependency, academic project should demonstrate cloud-native skills

## Implementation Strategy

### Phase 1: Infrastructure as Code (Base)
```hcl
# Terraform manages base infrastructure
module "networking" {
  # Static IPs and VNet
}

module "aks" {
  # Kubernetes cluster
}
```

### Phase 2: Ingress via kubectl (Pragmatic)
```yaml
# NGINX Ingress Controller via kubectl
# More reliable for complex Kubernetes resources
apiVersion: networking.k8s.io/v1
kind: Ingress
```

### Phase 3: Service Migration
- Migrate from LoadBalancer to ClusterIP services
- Route traffic through Ingress rules
- Enable SSL termination at Ingress level

### Rationale for Hybrid Approach:
- **Terraform:** Excellent for Azure resources (VNet, AKS, IPs)
- **kubectl:** More reliable for complex Kubernetes manifests
- **Provider Issues:** helm/kubernetes providers have configuration complexity
- **Academic Value:** Demonstrates practical problem-solving over theoretical perfection

## Security Benefits

### HTTPS Enforcement:
- **All traffic encrypted** in transit
- **Certificate auto-renewal** (90-day Let's Encrypt)
- **HSTS headers** for browser security
- **SSL redirect** from HTTP to HTTPS

### Compliance Alignment:
- **GDPR Article 32:** Technical measures for data security
- **LGPD Article 46:** Security and data protection measures
- **Healthcare Standards:** PHI encryption requirements

## Academic Value

### Technical Demonstration:
- **Cloud-native patterns** - Ingress controllers and cert-manager
- **Security best practices** - HTTPS enforcement and auto-renewal
- **Infrastructure as Code** - Terraform module for ingress
- **Industry standards** - NGINX as production-grade solution

### Professional Portfolio:
- **Production-ready architecture** demonstrating real-world skills
- **Security-first approach** for healthcare applications
- **Cost optimization** using free SSL certificates
- **Scalable design** supporting multiple services

## Consequences

### Positive:
- **Security Compliance:** HTTPS mandatory for healthcare applications
- **Professional Presentation:** Proper domains for academic evaluation
- **Cost Efficiency:** Free SSL certificates vs paid alternatives
- **Scalability:** Easy to add new services (portal, mobile API)
- **Industry Standard:** NGINX + cert-manager widely adopted

### Negative:
- **Complexity Increase:** Additional components to manage
- **Learning Curve:** NGINX configuration and cert-manager
- **Dependency Risk:** Let's Encrypt rate limits (rarely hit in practice)

### Neutral:
- **Migration Required:** Existing LoadBalancer services need conversion
- **DNS Setup:** Manual domain configuration (one-time)
- **Monitoring Needed:** SSL certificate expiration (automated but monitored)

## Migration Plan

### Step 1: Deploy Ingress (IaC)
```bash
terraform apply # Deploy ingress module
```

### Step 2: Service Conversion
- Convert LoadBalancer → ClusterIP
- Update service definitions
- Test internal connectivity

### Step 3: DNS Configuration
- Point domains to `4.207.239.129`
- Verify certificate issuance
- Test HTTPS endpoints

### Step 4: Validation
- Functional testing of all endpoints
- SSL certificate verification
- Performance testing

## Monitoring and Maintenance

### Automatic Processes:
- **Certificate Renewal:** cert-manager handles 30-day renewal
- **Health Checks:** NGINX ingress controller monitoring
- **Certificate Alerts:** Monitor certificate expiration

### Manual Verification:
- **Monthly SSL checks:** Verify certificate validity
- **Performance monitoring:** Response time and availability
- **Security scanning:** SSL configuration validation

## Links

- [ADR-0001: Monorepo](./ADR-0001-monorepo.md)
- [ADR-0002: Stripe Billing](./ADR-0002-stripe-billing.md)
- [ADR-0003: Permanent Public IPs](./ADR-0003-permanent-public-ips.md)
- [ADR-0004: Makefile Operations](./ADR-0004-makefile-terraform-operations.md)
- [Ingress Module](../../infra/modules/ingress/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)

---

*This decision enables secure, professional, and compliant access to the Therapy Engage Platform while maintaining cost efficiency for the academic project.*