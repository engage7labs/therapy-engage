# Check AKS Deployment Status
# PowerShell script to check current deployment status

Write-Host "🔍 Checking AKS deployment status..." -ForegroundColor Green

# Check if kubectl is available
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ kubectl not found. Please install kubectl and configure AKS access." -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Current deployments:" -ForegroundColor Cyan
kubectl get deployments -o wide

Write-Host "`n🏗️ Web portal pods:" -ForegroundColor Cyan
kubectl get pods -l app=web-portal -o wide

Write-Host "`n🖼️ Current images in use:" -ForegroundColor Cyan
kubectl get pods -l app=web-portal -o jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.spec.containers[*].image}{'\n'}{end}" | Format-Table -AutoSize

Write-Host "`n📊 Pod status details:" -ForegroundColor Cyan
kubectl describe pods -l app=web-portal | Select-String "Image:|Status:|Ready:|Restart"

Write-Host "`n🔄 Recent events:" -ForegroundColor Cyan
kubectl get events --sort-by=.metadata.creationTimestamp --field-selector involvedObject.kind=Pod | Select-Object -Last 10

Write-Host "`n🌐 Services:" -ForegroundColor Cyan
kubectl get services -l app=web-portal

Write-Host "`n📝 Recent logs (last 20 lines):" -ForegroundColor Cyan
kubectl logs -l app=web-portal --tail=20

Write-Host "`n💡 Quick commands:" -ForegroundColor Yellow
Write-Host "• Restart deployment: kubectl rollout restart deployment/web-portal" -ForegroundColor Gray
Write-Host "• Force pull new image: kubectl patch deployment web-portal -p '{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"kubectl.kubernetes.io/restartedAt\":\"`$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')\"}}}}}'" -ForegroundColor Gray
Write-Host "• Check rollout status: kubectl rollout status deployment/web-portal" -ForegroundColor Gray
