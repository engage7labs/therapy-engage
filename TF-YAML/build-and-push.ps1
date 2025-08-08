# Build and Push Script for Therapy Engage Web Portal
# PowerShell version for Windows

param(
    [string]$Tag = "dev",
    [switch]$Push,
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage: .\build-and-push.ps1 [-Tag <tag>] [-Push] [-Help]"
    Write-Host ""
    Write-Host "Parameters:"
    Write-Host "  -Tag    : Docker image tag (default: dev)"
    Write-Host "  -Push   : Push to registry after build"
    Write-Host "  -Help   : Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\build-and-push.ps1                    # Build only"
    Write-Host "  .\build-and-push.ps1 -Push              # Build and push"
    Write-Host "  .\build-and-push.ps1 -Tag latest -Push  # Build with custom tag and push"
    exit 0
}

# Configuration
$ImageName = "ghcr.io/therapyengageorg/web-portal"
$FullImage = "${ImageName}:${Tag}"

Write-Host "🏗️  Building Docker image for web portal..." -ForegroundColor Green
Write-Host "Image: $FullImage" -ForegroundColor Cyan

# Navigate to web directory
Push-Location web

try {
    # Build the Docker image
    Write-Host "Building image..." -ForegroundColor Yellow
    docker build -t $FullImage .
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker build failed"
    }
    
    # Tag as latest as well if tag is dev
    if ($Tag -eq "dev") {
        docker tag $FullImage "${ImageName}:latest"
    }
    
    Write-Host "✅ Image built successfully!" -ForegroundColor Green
    
    if ($Push) {
        Write-Host "🚀 Pushing image to registry..." -ForegroundColor Yellow
        Write-Host "Note: Make sure you're logged into GitHub Container Registry:" -ForegroundColor Cyan
        Write-Host "docker login ghcr.io -u USERNAME -p TOKEN" -ForegroundColor Gray
        
        docker push $FullImage
        if ($LASTEXITCODE -ne 0) {
            throw "Docker push failed"
        }
        
        if ($Tag -eq "dev") {
            docker push "${ImageName}:latest"
        }
        
        Write-Host "✅ Image pushed successfully!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🔄 To update the deployment, run:" -ForegroundColor Cyan
        Write-Host "kubectl rollout restart deployment/web-portal" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Or if using Helm:" -ForegroundColor Cyan
        Write-Host "helm upgrade web-portal ./charts/web-portal" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "🏷️  Available commands to update deployment:" -ForegroundColor Cyan
Write-Host "1. Force pod restart: kubectl rollout restart deployment/web-portal" -ForegroundColor Gray
Write-Host "2. Update image: kubectl set image deployment/web-portal web-portal=$FullImage" -ForegroundColor Gray
Write-Host "3. Check status: kubectl get pods -l app=web-portal" -ForegroundColor Gray
Write-Host "4. Check logs: kubectl logs -l app=web-portal --tail=50" -ForegroundColor Gray
