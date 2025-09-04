# 🚀 Deployment README - Therapy Engage Platform

## Quick Start

### 1. Initial Azure Setup

```powershell
# Run the setup script
.\scripts\setup-azure-env.ps1 -ResourceGroupName "therapy-engage-rg" -AppServiceName "therapy-engage-dev"
```

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret | Value | How to Get |
|--------|--------|------------|
| `AZURE_WEBAPP_NAME` | `therapy-engage-dev` | From setup script output |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | XML content | Download from Azure Portal |
| `SNYK_TOKEN` | Your Snyk token | Register at snyk.io (optional) |

### 3. Deploy Your First Version

```bash
# Create a feature branch
git checkout -b feature/initial-deployment

# Make some changes (if needed)
# ...

# Commit and push
git add .
git commit -m "feat: initial deployment setup"
git push origin feature/initial-deployment

# Create Pull Request on GitHub
# After approval, merge to main branch
# Automatic deployment will trigger
```

## CI/CD Pipeline Overview

```mermaid
graph LR
    A[Push to main] --> B[Build & Test]
    B --> C[Security Scan]
    C --> D[Deploy to Azure]
    D --> E[Health Check]
    E --> F[✅ Success]
```

### Pipeline Stages

1. **Build & Test** (2-3 minutes)
   - Install Node.js dependencies
   - Run ESLint and TypeScript checks
   - Build production bundle
   - Upload artifacts

2. **Security Scan** (1-2 minutes)
   - NPM audit for vulnerabilities
   - Snyk security analysis (if token provided)

3. **Deploy to Azure** (3-5 minutes)
   - Deploy to staging slot (if available)
   - Swap to production
   - Configure environment variables

4. **Health Check** (30 seconds)
   - Verify application startup
   - Test API endpoints

## Environment Structure

### Free Tier Setup
```
Production Environment
├── Azure App Service (Free Tier)
├── Node.js 18 Runtime
├── Automatic SSL (*.azurewebsites.net)
└── Health Monitoring
```

### Standard/Premium Tier Setup
```
Production Environment
├── Azure App Service (Standard/Premium)
├── Production Slot
├── Staging Slot (blue/green deployment)
├── Custom Domain & SSL
└── Advanced Monitoring
```

## Monitoring & Health Checks

### Automatic Health Checks

The system includes built-in health monitoring:

- **Endpoint**: `https://your-app.azurewebsites.net/api/health`
- **Monitoring**: Every 5 minutes during deployment
- **Response**: JSON with status, uptime, memory usage

### Manual Verification

Use the verification script after deployment:

```powershell
.\scripts\verify-deployment.ps1 -AppUrl "https://your-app.azurewebsites.net"
```

## Deployment Strategies

### 1. Standard Deployment (Free Tier)
- Direct deployment to production
- Automatic health checks
- Rollback on failure

### 2. Blue-Green Deployment (Standard+ Tier)
- Deploy to staging slot
- Smoke tests on staging
- Swap slots on success
- Instant rollback capability

## Troubleshooting

### Common Issues

#### Build Failures
```powershell
# Check build logs in GitHub Actions
# Clear local cache and retry
npm run clean
npm ci
npm run build
```

#### Health Check Failures
```powershell
# Check application logs
az webapp log tail --name your-app --resource-group your-rg

# Test health endpoint manually
curl https://your-app.azurewebsites.net/api/health
```

#### Deployment Timeouts
- Verify Azure App Service is running
- Check resource limits (Free tier has limitations)
- Review application startup time

### Debug Commands

```powershell
# Check Azure App Service status
az webapp show --name your-app --resource-group your-rg --query "state"

# View recent deployments
az webapp deployment list --name your-app --resource-group your-rg

# Restart application
az webapp restart --name your-app --resource-group your-rg

# View live logs
az webapp log tail --name your-app --resource-group your-rg
```

## Branch Strategy

### Recommended Git Workflow

```
main (production)
├── develop (integration)
│   ├── feature/sprint-d3-icons
│   ├── feature/auth-improvements
│   └── hotfix/urgent-bug-fix
└── release/v1.0.0
```

### Branch Protection Rules

- `main` branch requires PR reviews
- Status checks must pass before merge
- Automatic deployment on merge to `main`

## Performance Optimization

### Free Tier Limitations
- 60 minutes CPU time per day
- 1 GB RAM
- 1 GB storage
- Cold start delays

### Optimization Strategies
- Minimize bundle size
- Optimize images and assets
- Use efficient database queries
- Implement proper caching

## Security Considerations

### Automated Security Scanning
- NPM audit for known vulnerabilities
- Snyk security analysis
- SARIF reports in GitHub

### Environment Security
- Secrets stored in GitHub Secrets
- Environment variables for configuration
- No sensitive data in code repository

## Scaling Guidelines

### When to Upgrade from Free Tier

Consider upgrading when you experience:
- Regular timeout errors
- Slow response times (>5 seconds)
- High traffic volumes
- Need for custom domains
- Requirement for staging environments

### Upgrade Path
1. Free (F1) → Basic (B1) → Standard (S1) → Premium (P1V2)
2. Each tier offers more resources and features
3. Zero-downtime upgrade possible

## Maintenance

### Regular Tasks
- Monitor application health
- Review security scan results
- Update dependencies monthly
- Check Azure resource usage
- Rotate access tokens quarterly

### Automated Maintenance
- Dependency updates via Dependabot
- Security scanning on every PR
- Health monitoring during deployments
- Automatic log cleanup

## Support

### Getting Help
1. Check GitHub Actions logs first
2. Review Azure App Service diagnostics
3. Use the verification script for debugging
4. Contact development team for complex issues

### Useful Links
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

## Quick Reference Card

```powershell
# Setup new environment
.\scripts\setup-azure-env.ps1 -ResourceGroupName "rg-name" -AppServiceName "app-name"

# Verify deployment
.\scripts\verify-deployment.ps1 -AppUrl "https://app-name.azurewebsites.net"

# Check health
curl https://app-name.azurewebsites.net/api/health

# View logs
az webapp log tail --name app-name --resource-group rg-name

# Restart app
az webapp restart --name app-name --resource-group rg-name
```

**Remember**: Always use Pull Requests for production deployments! 🚀
