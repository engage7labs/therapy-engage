# DEV Environment (Azure Container Apps)

This directory contains Terraform configuration for the **DEV environment** using **Azure Container Apps (ACA)**.

## Architecture

- **Compute**: Azure Container Apps (ACA)
- **Authentication**: Service Principal + Secret (for GitHub Actions)
- **Container Registry**: GitHub Container Registry (GHCR)
- **State**: `dev.tfstate` (isolated from PROD)

## Resources

- Resource Group: `rg-therapy-engage-dev`
- Container Apps Environment: `cae-therapy-engage-dev-{suffix}`
- Frontend Container App: `ca-therapy-frontend-dev`
- Backend Container App: `ca-therapy-backend-dev`

## Usage

```bash
# From project root
make init-dev
make plan-dev
make apply-dev
make outputs-dev
```

## CI/CD Integration

This environment is designed for GitHub Actions CI/CD using Service Principal authentication:

1. **Service Principal Setup**: Use `scripts/setup-service-principal-dev.ps1`
2. **GitHub Secrets**: Configure AZURE_CREDENTIALS, RESOURCE_GROUP, ACA_FRONTEND_NAME, ACA_BACKEND_NAME
3. **Images**: Built and pushed to GHCR with SHA and `dev-latest` tags
4. **Deployment**: Automated via `.github/workflows/ci.yml`

## Health Endpoints

- Backend: `https://{backend-fqdn}/health`
- Frontend: `https://{frontend-fqdn}/api/health`

## Rollback

Use Azure Container Apps revisions for instant rollback:

```bash
az containerapp revision list --name ca-therapy-backend-dev --resource-group rg-therapy-engage-dev
az containerapp revision set-active --name ca-therapy-backend-dev --resource-group rg-therapy-engage-dev --revision {previous-revision}
```

See [ROLLBACK_GUIDE.md](../../../docs/ROLLBACK_GUIDE.md) for detailed procedures.
