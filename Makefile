# Makefile for Terraform Environment Isolation
# Therapy Engage Platform - Infrastructure Automation
# DEV = Azure Container Apps (ACA) | PROD = Azure Kubernetes Service (AKS)

# Environment-specific Terraform directories
TF_DIR_DEV=infra/env/dev
TF_DIR_PROD=infra/env/prod

.PHONY: help check-env fmt fmt-check \
        init-dev plan-dev apply-dev destroy-dev outputs-dev \
        init-prod plan-prod apply-prod destroy-prod outputs-prod \
        clean tree-infra

help:
	@echo "=== Therapy Engage Platform - Infrastructure ==="
	@echo ""
	@echo "Environment Isolation: DEV=ACA • PROD=AKS"
	@echo ""
	@echo "DEV Environment (Azure Container Apps):"
	@echo "  init-dev             - Initialize DEV Terraform"
	@echo "  plan-dev             - Plan DEV environment changes"
	@echo "  apply-dev            - Apply DEV environment"
	@echo "  destroy-dev          - Destroy DEV environment"
	@echo "  outputs-dev          - Show DEV outputs"
	@echo ""
	@echo "PROD Environment (Azure Kubernetes Service):"
	@echo "  init-prod            - Initialize PROD Terraform"
	@echo "  plan-prod            - Plan PROD environment changes"
	@echo "  apply-prod           - Apply PROD environment"
	@echo "  destroy-prod         - Destroy PROD environment"
	@echo "  outputs-prod         - Show PROD outputs"
	@echo ""
	@echo "Utility:"
	@echo "  check-env            - Check Azure authentication"
	@echo "  fmt                  - Format all Terraform files"
	@echo "  fmt-check            - Check Terraform formatting"
	@echo "  tree-infra           - Show infrastructure directory structure"
	@echo "  clean                - Clean Terraform state and cache"
	@echo ""
	@echo "State Files: dev.tfstate (DEV) | prod.tfstate (PROD)"
	@echo ""
	@echo "Required environment variables:"
	@echo "  ARM_SUBSCRIPTION_ID - Azure subscription ID"
	@echo ""
	@echo "Example workflows:"
	@echo "  make check-env && make plan-dev && make apply-dev"
	@echo "  make outputs-dev  # Get values for GitHub secrets"

# Check environment variables and Azure login
check-env:
	@echo "Checking environment setup..."
	@if [ -z "$$ARM_SUBSCRIPTION_ID" ]; then \
		echo "[ERROR] ARM_SUBSCRIPTION_ID not set"; \
		echo "Run: export ARM_SUBSCRIPTION_ID=\"your-subscription-id\""; \
		exit 1; \
	fi
	@echo "[OK] ARM_SUBSCRIPTION_ID is set"
	@CURRENT_SUB=$$(az account show --query id -o tsv 2>/dev/null || echo "NOT_LOGGED_IN"); \
	if [ "$$CURRENT_SUB" = "NOT_LOGGED_IN" ]; then \
		echo "[ERROR] Not logged in to Azure. Run: az login"; \
		exit 1; \
	fi; \
	if [ "$$CURRENT_SUB" != "$$ARM_SUBSCRIPTION_ID" ]; then \
		echo "[WARN] Setting active subscription..."; \
		az account set --subscription "$$ARM_SUBSCRIPTION_ID"; \
	fi; \
	echo "[OK] Using subscription: $$ARM_SUBSCRIPTION_ID"
	@echo "[OK] Environment check complete"

# ============================================
# Formatting and Validation
# ============================================

fmt:
	@echo "Formatting Terraform files..."
	terraform -chdir=$(TF_DIR_DEV) fmt -recursive
	terraform -chdir=$(TF_DIR_PROD) fmt -recursive
	@echo "[OK] All files formatted"

fmt-check:
	@echo "Checking Terraform formatting..."
	terraform -chdir=$(TF_DIR_DEV) fmt -recursive -check
	terraform -chdir=$(TF_DIR_PROD) fmt -recursive -check
	@echo "[OK] All files properly formatted"

# ============================================
# DEV Environment (Azure Container Apps)
# ============================================

init-dev: check-env
	@echo "Initializing DEV environment (ACA)..."
	terraform -chdir=$(TF_DIR_DEV) init -upgrade
	@echo "[OK] DEV environment initialized"

plan-dev: init-dev
	@echo "Planning DEV environment changes..."
	terraform -chdir=$(TF_DIR_DEV) plan
	@echo "[OK] DEV plan complete"

apply-dev: init-dev
	@echo "Applying DEV environment..."
	terraform -chdir=$(TF_DIR_DEV) apply -auto-approve
	@echo "[OK] DEV environment deployed"

destroy-dev: init-dev
	@echo "Destroying DEV environment..."
	terraform -chdir=$(TF_DIR_DEV) destroy -auto-approve
	@echo "[OK] DEV environment destroyed"

outputs-dev:
	@echo "DEV Environment Outputs:"
	@echo "========================"
	terraform -chdir=$(TF_DIR_DEV) output

# ============================================
# PROD Environment (Azure Kubernetes Service)
# ============================================

init-prod: check-env
	@echo "Initializing PROD environment (AKS)..."
	terraform -chdir=$(TF_DIR_PROD) init -upgrade
	@echo "[OK] PROD environment initialized"

plan-prod: init-prod
	@echo "Planning PROD environment changes..."
	terraform -chdir=$(TF_DIR_PROD) plan
	@echo "[OK] PROD plan complete"

apply-prod: init-prod
	@echo "Applying PROD environment..."
	terraform -chdir=$(TF_DIR_PROD) apply -auto-approve
	@echo "[OK] PROD environment deployed"

destroy-prod: init-prod
	@echo "Destroying PROD environment..."
	terraform -chdir=$(TF_DIR_PROD) destroy -auto-approve
	@echo "[OK] PROD environment destroyed"

outputs-prod:
	@echo "PROD Environment Outputs:"
	@echo "========================="
	terraform -chdir=$(TF_DIR_PROD) output

# ============================================
# Utility Commands
# ============================================

tree-infra:
	@echo "Infrastructure Directory Structure:"
	@echo "=================================="
	@ls -la infra/ 2>/dev/null || dir infra

clean:
	@echo "Cleaning Terraform cache and state..."
	rm -rf $(TF_DIR_DEV)/.terraform $(TF_DIR_DEV)/.terraform.lock.hcl
	rm -rf $(TF_DIR_PROD)/.terraform $(TF_DIR_PROD)/.terraform.lock.hcl
	@echo "[OK] Terraform cache cleaned"
