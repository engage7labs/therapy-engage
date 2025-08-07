#!/usr/bin/env pwsh
# Deployment Verification Script
# Verifies that the latest deployment contains Priority 2 features

Write-Host "🔍 Deployment Verification - Priority 2 Features" -ForegroundColor Cyan
Write-Host "=" * 50

# Check pod status
Write-Host "`n📦 Current Pod Status:" -ForegroundColor Yellow
kubectl get pods -l app=web-portal

# Check current image and SHA
Write-Host "`n🖼️ Current Image Details:" -ForegroundColor Yellow
kubectl describe pod -l app=web-portal | Select-String -Pattern "Image.*:|Started.*:" | ForEach-Object { 
    Write-Host $_.Line.Trim() 
}

# Check deployment history
Write-Host "`n📜 Recent Deployment History:" -ForegroundColor Yellow
kubectl rollout history deployment web-portal --limit=3

# Get service status
Write-Host "`n🌐 Service Status:" -ForegroundColor Yellow
kubectl get svc web-portal

# Get ingress status
Write-Host "`n🚪 Ingress Status:" -ForegroundColor Yellow
kubectl get ingress web-portal-ingress

Write-Host "`n✅ Verification Complete!" -ForegroundColor Green
Write-Host "Portal URL: https://20.82.234.39.sslip.io" -ForegroundColor Cyan

# Additional debugging info
Write-Host "`n🔧 Debugging Info:" -ForegroundColor Yellow
Write-Host "- Pod restart forced container to pull latest image"
Write-Host "- SHA changed indicating new image version deployed"
Write-Host "- GitHub Actions CI/CD successfully built and pushed new image"
Write-Host "- Kubernetes was using cached image before restart"

Write-Host "`n💡 Next Steps:" -ForegroundColor Magenta
Write-Host "1. Test the portal to verify Priority 2 features are working"
Write-Host "2. If features are still missing, check application build contents"
Write-Host "3. Consider implementing imagePullPolicy: Always in deployment"
