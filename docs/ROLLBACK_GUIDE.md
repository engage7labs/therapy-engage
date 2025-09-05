# Azure Container Apps - Rollback Guide (DEV)

This guide covers rollback procedures for the DEV environment using Azure Container Apps revisions and Git operations.

## 🔄 Rollback Methods

### Method 1: Azure Container Apps Revisions (Recommended)

Azure Container Apps automatically creates revisions for each deployment. Use this for quick rollbacks without rebuilding.

#### List Available Revisions

```bash
# List backend revisions
az containerapp revision list \
  --name <ACA_BACKEND_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --output table

# List frontend revisions
az containerapp revision list \
  --name <ACA_FRONTEND_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --output table
```

#### Rollback to Previous Revision

```bash
# Set traffic to single revision mode
az containerapp revision set-mode \
  --name <ACA_BACKEND_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --mode single

# Activate previous good revision
az containerapp revision set-active \
  --name <ACA_BACKEND_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --revision <PREVIOUS_REVISION_NAME>
```

#### Gradual Rollback with Traffic Splitting

```bash
# Split traffic between revisions (useful for testing)
az containerapp ingress traffic set \
  --name <ACA_BACKEND_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --revision-weight <NEW_REVISION>=20 <OLD_REVISION>=80

# After validation, route all traffic to old revision
az containerapp ingress traffic set \
  --name <ACA_BACKEND_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --revision-weight <OLD_REVISION>=100
```

### Method 2: Git Revert + Re-deploy

Use this when you need to rollback the source code and trigger a new deployment.

#### Revert Last Commit

```bash
# Revert the last merge commit
git revert HEAD --mainline 1

# Push the revert commit
git push origin dev
```

#### Revert to Specific Commit

```bash
# Find the commit to revert to
git log --oneline -10

# Revert to specific commit
git revert <COMMIT_SHA> --mainline 1

# Push the revert
git push origin dev
```

## 🏥 Health Check After Rollback

Always verify the rollback was successful:

```bash
# Get URLs from ACA
BACKEND_URL=$(az containerapp show --name <ACA_BACKEND_NAME> --resource-group <RESOURCE_GROUP> --query properties.configuration.ingress.fqdn -o tsv)
FRONTEND_URL=$(az containerapp show --name <ACA_FRONTEND_NAME> --resource-group <RESOURCE_GROUP> --query properties.configuration.ingress.fqdn -o tsv)

# Test health endpoints
curl -fS "https://$BACKEND_URL/health" | jq .
curl -fS "https://$FRONTEND_URL/api/health"
```

## 📊 Using Terraform Outputs

If using Terraform, get the required values:

```bash
cd infra
export RESOURCE_GROUP=$(terraform output -raw resource_group_name)
export ACA_BACKEND_NAME=$(terraform output -raw aca_backend_name)
export ACA_FRONTEND_NAME=$(terraform output -raw aca_frontend_name)
```

## 🚨 Emergency Rollback Procedure

1. **Immediate**: Use ACA revision rollback (fastest)
2. **Verify**: Run health checks on both services
3. **Document**: Note the issue and which revision was problematic
4. **Follow-up**: Investigate the root cause and prepare a proper fix

## 📝 Rollback Checklist

- [ ] Identify problematic deployment
- [ ] List available revisions
- [ ] Set traffic to previous good revision
- [ ] Verify health endpoints return 200
- [ ] Test critical user flows
- [ ] Document the incident
- [ ] Plan proper fix for next deployment

## 🔍 Monitoring During Rollback

Monitor the following during rollback:

- Application logs in Azure Container Apps
- Health endpoint responses
- User error reports
- Azure Container Apps metrics

## 📚 Additional Resources

- [Azure Container Apps Revisions](https://docs.microsoft.com/azure/container-apps/revisions)
- [Traffic Splitting](https://docs.microsoft.com/azure/container-apps/ingress#traffic-splitting)
- [Git Revert Best Practices](https://git-scm.com/docs/git-revert)
