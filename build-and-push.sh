#!/bin/bash

# Build and Push Script for Therapy Engage Web Portal
# This script builds the Docker image and pushes to GitHub Container Registry

set -e

# Configuration
IMAGE_NAME="ghcr.io/therapyengageorg/web-portal"
TAG="dev"
FULL_IMAGE="${IMAGE_NAME}:${TAG}"

echo "🏗️  Building Docker image for web portal..."
echo "Image: ${FULL_IMAGE}"

# Navigate to web directory
cd web

# Build the Docker image
echo "Building image..."
docker build -t ${FULL_IMAGE} .

# Tag as latest as well
docker tag ${FULL_IMAGE} ${IMAGE_NAME}:latest

echo "✅ Image built successfully!"

# Push to registry (requires docker login to ghcr.io first)
echo "🚀 Pushing image to registry..."
echo "Note: Make sure you're logged into GitHub Container Registry:"
echo "docker login ghcr.io -u USERNAME -p TOKEN"

read -p "Push to registry? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker push ${FULL_IMAGE}
    docker push ${IMAGE_NAME}:latest
    echo "✅ Image pushed successfully!"
    
    echo ""
    echo "🔄 To update the deployment, run:"
    echo "kubectl rollout restart deployment/web-portal"
    echo ""
    echo "Or if using Helm:"
    echo "helm upgrade web-portal ./charts/web-portal"
else
    echo "Skipped push to registry."
fi

echo ""
echo "🏷️  Available commands to update deployment:"
echo "1. Force pod restart: kubectl rollout restart deployment/web-portal"
echo "2. Update image: kubectl set image deployment/web-portal web-portal=${FULL_IMAGE}"
echo "3. Check status: kubectl get pods -l app=web-portal"
