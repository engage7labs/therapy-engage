# Manual Ingress Setup - Therapy Engage Platform

**File:** `docs/INGRESS_MANUAL_SETUP.md`  
**Date:** 31 July 2025  
**Purpose:** Document manual NGINX Ingress + HTTPS setup via kubectl

---

## Overview

This document describes the manual implementation of NGINX Ingress Controller with automatic HTTPS certificates for the Therapy Engage Platform. This approach was chosen due to Terraform provider complexity issues with helm/kubernetes providers.

## Background

### Original State
- **Backend API:** Direct LoadBalancer on `4.207.239.129:80` (HTTP only)
- **Service:** `backend-app-service` type LoadBalancer
- **Security:** No SSL/TLS encryption
- **Access:** IP-based only

### Target State
- **NGINX Ingress:** Centralized traffic routing with SSL termination
- **HTTPS:** Automatic Let's Encrypt certificates
- **Domains:** Professional domain names
- **Security:** Full encryption for healthcare compliance

## Implementation Steps

### Phase 1: NGINX Ingress Controller

#### 1.1 Add Helm Repository
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

#### 1.2 Install NGINX Ingress
```bash
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.loadBalancerIP=4.207.239.129
```

**Expected Result:** NGINX Ingress Controller deployed with LoadBalancer service

#### 1.3 Resolve IP Conflicts
**Issue Encountered:** Multiple LoadBalancer services competing for same IP

**Resolution:**
```bash
# Remove original backend LoadBalancer
kubectl delete service backend-app-service

# Patch NGINX service to use available IP
kubectl patch service ingress-nginx-controller -n ingress-nginx \
  -p '{"spec":{"loadBalancerIP":"20.13.251.223"}}'
```

**Lesson Learned:** Azure LoadBalancer IPs are released when services are deleted

### Phase 2: cert-manager Installation

#### 2.1 Add Jetstack Repository
```bash
helm repo add jetstack https://charts.jetstack.io
```

#### 2.2 Install cert-manager
```bash
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

**Purpose:** Automatic SSL certificate provisioning and renewal

### Phase 3: Let's Encrypt Configuration

#### 3.1 Create ClusterIssuer
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: x24130664@student.ncirl.ie
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
```

#### 3.2 Apply ClusterIssuer
```bash
kubectl apply -f letsencrypt-clusterissuer.yaml
```

### Phase 4: Backend Ingress Rules

#### 4.1 Create Service (ClusterIP)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-app-service
  namespace: default
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 3000
      protocol: TCP
  selector:
    app: backend-app
```

#### 4.2 Create Ingress Resource
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: backend-api-ingress
  namespace: default
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - therapyengage-api.azurewebsites.net
    secretName: backend-api-tls
  rules:
  - host: therapyengage-api.azurewebsites.net
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-app-service
            port:
              number: 80
```

## Verification Steps

### 1. Check NGINX Controller
```bash
kubectl get service --namespace ingress-nginx
# Expected: EXTERNAL-IP assigned to ingress-nginx-controller
```

### 2. Verify cert-manager
```bash
kubectl get pods --namespace cert-manager
# Expected: All pods in Running state
```

### 3. Test ClusterIssuer
```bash
kubectl get clusterissuer
# Expected: letsencrypt-prod with READY: True
```

### 4. Validate Ingress
```bash
kubectl get ingress
# Expected: Ingress with ADDRESS field populated
```

### 5. Test HTTPS Endpoint
```bash
curl -k https://therapyengage-api.azurewebsites.net/graphql \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello, health }"}'
```

## IP Address Migration

### Issue
During implementation, the original backend IP `4.207.239.129` was lost when the LoadBalancer service was deleted.

### Impact
- **CA Documentation:** References outdated IP
- **Demo URLs:** Need updating
- **Academic Evaluation:** Requires explanation

### Resolution
- **New IP:** `20.13.251.223` (from AKS resource group)
- **Documentation Update:** README.md updated with new endpoints
- **Academic Addendum:** Incident documented as learning experience

### URLs Updated
- **Before:** `http://4.207.239.129/graphql`
- **After:** `https://therapyengage-api.azurewebsites.net/graphql` (pending DNS)
- **Temporary:** `http://20.13.251.223/graphql`

## Troubleshooting Guide

### Common Issues

#### 1. LoadBalancer IP Conflicts
**Symptom:** `<pending>` EXTERNAL-IP
**Solution:** Check for existing LoadBalancer services using same IP

#### 2. cert-manager Certificate Issues
**Symptom:** SSL certificate not issued
**Debug:**
```bash
kubectl describe certificate <cert-name>
kubectl describe certificaterequest <request-name>
kubectl logs -n cert-manager -l app=cert-manager
```

#### 3. Ingress Class Issues
**Symptom:** Ingress not routing traffic
**Solution:** Verify `ingressClassName: nginx` in Ingress spec

#### 4. DNS Resolution
**Symptom:** Domain not resolving
**Solution:** Configure DNS A record pointing to LoadBalancer IP

## Security Considerations

### HTTPS Enforcement
- All HTTP traffic redirected to HTTPS via `ssl-redirect: "true"`
- Strong SSL/TLS configuration via NGINX defaults
- HSTS headers enabled

### Certificate Management
- **Auto-renewal:** cert-manager handles 30-day renewal cycle
- **Rate limiting:** Let's Encrypt has rate limits (50 certs/week)
- **Monitoring:** Certificate expiration alerts recommended

### Healthcare Compliance
- **GDPR Article 32:** Encryption in transit requirement met
- **LGPD Article 46:** Data protection technical measures implemented
- **PHI Security:** Healthcare data encrypted during transmission

## Performance Considerations

### Resource Usage
- **NGINX Controller:** ~200Mi memory, ~100m CPU
- **cert-manager:** ~100Mi memory, ~50m CPU
- **Impact:** Minimal on AKS cluster

### Scalability
- **Horizontal scaling:** NGINX Controller supports multiple replicas
- **SSL termination:** Offloaded from backend pods
- **Performance:** Single ingress point vs multiple LoadBalancers

## Maintenance Tasks

### Regular Monitoring
- **Certificate expiry:** Monitor cert-manager logs
- **NGINX health:** Check controller pod status
- **SSL validation:** Monthly SSL Labs testing

### Updates
- **NGINX Controller:** Regular Helm chart updates
- **cert-manager:** Version updates for security patches
- **Certificates:** Automatic renewal (monitor only)

## Lessons Learned

### Technical
1. **Provider Complexity:** Terraform helm/kubernetes providers can be challenging
2. **Resource Dependencies:** LoadBalancer IP management requires careful planning
3. **Hybrid Approach:** Terraform for infrastructure + kubectl for complex K8s resources works well

### Academic
1. **Documentation:** Real-world issues provide valuable learning experiences
2. **Problem Solving:** Adapting to unexpected challenges (IP loss)
3. **Best Practices:** Manual setup helps understand automation later

## Future Improvements

### Automation
- **GitOps:** Implement ArgoCD for declarative configuration
- **Helm Charts:** Custom charts for complete application deployment
- **Terraform:** Revisit when provider issues are resolved

### Monitoring
- **Prometheus:** Metrics collection for NGINX and cert-manager
- **Grafana:** Dashboards for SSL certificate monitoring
- **Alerting:** Automated alerts for certificate expiry

### Security
- **WAF:** Web Application Firewall integration
- **Rate Limiting:** NGINX rate limiting configuration
- **IP Whitelisting:** Restrict admin endpoints

## References

- [NGINX Ingress Controller Documentation](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Azure AKS Ingress Guide](https://docs.microsoft.com/en-us/azure/aks/ingress-basic)

---

**Note:** This document serves as both implementation guide and post-incident documentation for the Therapy Engage Platform ingress setup.