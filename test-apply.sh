#!/bin/bash
# HOTFIX DEV - Container Apps with Text Analytics
export ARM_SUBSCRIPTION_ID_DEV=958ff93a-40fd-4622-a59f-c79573aeb782
export TF_VAR_db_admin_password=SecurePassword123!

echo "� HOTFIX: Container Apps + Text Analytics + West Europe"
echo "✅ Regions: West Europe (stable for Free Tier)"
echo "✅ Services: Container Apps (no App Service quota issues)"
echo "✅ AI: Text Analytics F0 (Free, no OpenAI quota)"
echo ""

# Clean old terraform files
echo "🧹 Cleaning old Terraform state..."
rm -f infra/dev/*.tfplan
rm -f infra/dev/.terraform.lock.hcl
rm -rf infra/dev/.terraform/

echo "🚀 Running make apply-dev..."
make apply-dev
