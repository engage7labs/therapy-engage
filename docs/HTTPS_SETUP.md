# HTTPS Setup Guide - Therapy Engage Platform

**Date:** 31 July 2025  
**Status:** ✅ Production Ready  
**Endpoint:** https://20.82.234.39.sslip.io/graphql

---

## Overview

This document describes the complete HTTPS setup process for the Therapy Engage Platform, including all manual steps performed outside of Terraform Infrastructure as Code.

## Prerequisites

- ✅ AKS cluster running (via Terraform)
- ✅ Backend application deployed
- ✅ Azure CLI authenticated
- ✅ kubectl configured

## Step 1: Install NGINX Ingress Controller

```bash
# Add NGINX Ingress repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX Ingress Controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace
```

## Step 2: Install cert-manager

```bash
# Add Jetstack repository
helm repo add jetstack https://charts.jetstack.io

# Install cert-manager with CRDs
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

## Step 3: Configure Let's Encrypt

### Staging ClusterIssuer
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: x24130664@student.ncirl.ie
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
```

### Production ClusterIssuer
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

## Step 4: Configure Network Security Groups

**Critical:** Azure AKS creates NSG rules automatically, but HTTP/HTTPS access requires manual configuration.

```bash
# Find the AKS-managed NSG
az network nsg list --query "[].{Name:name, ResourceGroup:resourceGroup}" -o table

# Add HTTP rule
az network nsg rule create \
  --resource-group MC_rg-therapy-dev_aks-therapy_northeurope \
  --nsg-name aks-agentpool-34357720-nsg \
  --name Allow-HTTP-Inbound \
  --priority 1000 \
  --source-address-prefixes '*' \
  --destination-port-ranges 80 \
  --access Allow \
  --protocol Tcp \
  --direction Inbound

# Add HTTPS rule
az network nsg rule create \
  --resource-group MC_rg-therapy-dev_aks-therapy_northeurope \
  --nsg-name aks-agentpool-34357720-nsg \
  --name Allow-HTTPS-Inbound \
  --priority 1001 \
  --source-address-prefixes '*' \
  --destination-port-ranges 443 \
  --access Allow \
  --protocol Tcp \
  --direction Inbound
```

## Step 5: Create Ingress Resource

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: backend-api-ingress-final
  namespace: default
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    acme.cert-manager.io/http01-edit-in-place: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - 20.82.234.39.sslip.io
    secretName: backend-api-final-tls
  rules:
  - host: 20.82.234.39.sslip.io
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

## Troubleshooting

### LoadBalancer Issues
If external access fails:
```bash
# Recreate LoadBalancer service
kubectl delete svc -n ingress-nginx ingress-nginx-controller
kubectl expose deployment ingress-nginx-controller -n ingress-nginx \
  --type=LoadBalancer \
  --port=80 --target-port=80 \
  --name=ingress-nginx-controller
```

### Certificate Issues
```bash
# Check certificate status
kubectl get certificate
kubectl describe certificate backend-api-final-tls

# Check Let's Encrypt challenges
kubectl get challenge
kubectl describe challenge <challenge-name>
```

### Connectivity Issues
```bash
# Test internal connectivity
kubectl run test-pod --image=curlimages/curl -it --rm --restart=Never \
  -- curl -I http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/

# Test external connectivity
curl -I http://<external-ip>/
```

## Validation

### Test HTTPS Endpoint
```bash
curl -X POST https://20.82.234.39.sslip.io/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello, health }"}'
```

**Expected Response:**
```json
{"data":{"hello":"Hello from Therapy Engage Platform!","health":"API is running successfully"}}
```

### Browser Access
- **URL:** https://20.82.234.39.sslip.io/graphql
- **SSL:** Valid Let's Encrypt certificate
- **Status:** Production ready

## Architecture Notes

- **DNS Strategy:** Using sslip.io for automatic IP-to-domain resolution
- **SSL Strategy:** Let's Encrypt with automated renewal
- **Load Balancing:** Azure LoadBalancer → NGINX Ingress → Backend pods
- **Security:** NSG rules + TLS termination at Ingress level

## Known Issues & Solutions

### Issue: LoadBalancer Timeout
**Symptoms:** External curl timeouts, Let's Encrypt connection failed  
**Root Cause:** Azure LoadBalancer not properly routing to nodes  
**Solution:** Recreate LoadBalancer service (Step in Troubleshooting section)

### Issue: Certificate Authority Invalid
**Symptoms:** Browser warnings about certificate  
**Root Cause:** Using Let's Encrypt staging environment  
**Solution:** Switch annotation to `letsencrypt-prod` ClusterIssuer

### Issue: NSG Blocking External Access
**Symptoms:** Internal cluster access works, external fails  
**Root Cause:** Azure NSG doesn't allow HTTP/HTTPS by default  
**Solution:** Add explicit NSG rules for ports 80 and 443 (Step 4)

### Issue: AKS Cluster Connectivity
**Symptoms:** `kubectl` commands fail intermittently  
**Root Cause:** DNS resolution issues with AKS API server  
**Solution:** Reconnect credentials: `az aks get-credentials --resource-group rg-therapy-dev --name aks-therapy --overwrite-existing`

---

*This setup provides production-ready HTTPS for the Therapy Engage Platform with automated SSL certificate management. All manual steps documented for future reference and troubleshooting.*