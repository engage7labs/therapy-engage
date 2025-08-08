# MANUAL_BUILD_INSTRUCTIONS

# Manual Build Instructions for Therapy Engage Web Portal

## Problem Identified

The remote AKS environment is running an older version of the Docker image that doesn't include the latest Priority 2 changes (SessionManager, UpcomingSessions, PatientVideoCallSelector components).

## Solution Steps

### 1. Start Docker Desktop

Make sure Docker Desktop is running on your machine.

### 2. Build New Image

```bash
cd web
docker build -t ghcr.io/therapyengageorg/web-portal:dev .
```

### 3. Tag as Latest (optional)

```bash
docker tag ghcr.io/therapyengageorg/web-portal:dev ghcr.io/therapyengageorg/web-portal:latest
```

### 4. Login to GitHub Container Registry

```bash
docker login ghcr.io -u YOUR_USERNAME -p YOUR_GITHUB_TOKEN
```

### 5. Push to Registry

```bash
docker push ghcr.io/therapyengageorg/web-portal:dev
docker push ghcr.io/therapyengageorg/web-portal:latest
```

### 6. Update AKS Deployment

```bash
# Force restart to pull new image
kubectl rollout restart deployment/web-portal

# Check rollout status
kubectl rollout status deployment/web-portal

# Verify new pod is running
kubectl get pods -l app=web-portal

# Check logs
kubectl logs -l app=web-portal --tail=50
```

## Alternative: Force Image Pull

If the image tag is the same, Kubernetes might not pull the new version. Force it:

```bash
kubectl patch deployment web-portal -p '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'$(date +%Y-%m-%dT%H:%M:%SZ)'"}}}}}'
```

## Verification

After deployment update:

1. Access the remote environment URL
2. Check if login screen appears with "Clear Storage & Reload (Debug)" button
3. Test the therapist dashboard with new session management tabs
4. Verify Priority 2 components are working

## What Was Missing

The current AKS deployment is using an older image that contains:

- ❌ Old authentication system
- ❌ Missing SessionManager component
- ❌ Missing UpcomingSessions component
- ❌ Missing PatientVideoCallSelector component
- ❌ Missing enhanced dashboard with tabs

The new image will include:

- ✅ Enhanced authentication with localStorage persistence
- ✅ Complete Priority 2: Session Management Core
- ✅ New dashboard with tabbed interface
- ✅ All three session management components
- ✅ Debug utilities (Clear Storage button)
