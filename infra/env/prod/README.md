# PROD Environment (Azure Kubernetes Service)

This directory contains Terraform configuration for the **PROD environment** using **Azure Kubernetes Service (AKS)**.

## Architecture

- **Compute**: Azure Kubernetes Service (AKS)
- **Authentication**: OIDC (OpenID Connect) - more secure for production
- **Container Registry**: Azure Container Registry (ACR) or GHCR
- **State**: `prod.tfstate` (isolated from DEV)

## Resources (when enabled)

- Resource Group: `rg-therapy-engage-prod`
- Virtual Network with subnets
- AKS Cluster with node pools
- Azure Container Registry
- CosmosDB for production data
- Azure OpenAI for AI services

## Usage

```bash
# From project root
make init-prod
make plan-prod
make apply-prod
make outputs-prod
```

## CI/CD Integration

This environment is designed for production deployment using OIDC authentication:

1. **OIDC Setup**: More secure than Service Principal for production
2. **GitHub Secrets**: Configure AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID
3. **Branch Protection**: Requires PR approval and status checks
4. **Images**: Production-ready images with proper tagging

## Notes

- Most modules are currently commented out to prevent accidental PROD changes
- Uncomment modules as needed for actual PROD deployment
- Always test changes in DEV first
- Use blue-green deployment strategies for zero-downtime updates

## Monitoring

- Azure Monitor integration
- Application Insights for telemetry
- Log Analytics for centralized logging
- Prometheus/Grafana for Kubernetes metrics
