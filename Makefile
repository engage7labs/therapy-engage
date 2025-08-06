# Makefile for safe Terraform operations
# Therapy Engage Platform - Infrastructure Automation

.PHONY: help check-env init plan-dev apply-dev destroy-dev fmt validate

help:
	@echo "=== Therapy Engage Platform - Infrastructure ==="
	@echo ""
	@echo "Available targets:"
	@echo "  check-env     - Check environment and Azure login"
	@echo "  init          - Initialize Terraform"
	@echo "  fmt           - Format Terraform files"
	@echo "  validate      - Validate Terraform configuration"
	@echo "  plan-dev      - Plan dev environment (Ireland)"
	@echo "  apply-dev     - Apply dev environment (Ireland)"
	@echo "  destroy-dev   - Destroy dev environment (Ireland)"
	@echo ""
	@echo "Required environment variables:"
	@echo "  ARM_SUBSCRIPTION_ID - Azure subscription ID"
	@echo ""
	@echo "Example workflow:"
	@echo "  make check-env && make plan-dev && make apply-dev"

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

# Initialize Terraform
init: check-env
	@echo "Initializing Terraform..."
	terraform -chdir=infra init

# Format Terraform files
fmt:
	@echo "Formatting Terraform files..."
	terraform -chdir=infra fmt -recursive

# Validate Terraform configuration
validate: fmt
	@echo "Validating Terraform configuration..."
	terraform -chdir=infra validate

# Dev environment commands
plan-dev: check-env validate
	@echo "Planning DEV environment (Ireland)..."
	terraform -chdir=infra plan -var-file=environments/dev-eu-ie.tfvars -var="expected_environment=dev"

apply-dev: check-env
	@echo "Applying DEV environment (Ireland)..."
	@read -p "Are you sure you want to apply changes? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		terraform -chdir=infra apply -var-file=environments/dev-eu-ie.tfvars -var="expected_environment=dev"; \
	else \
		echo "[CANCELLED] Apply operation cancelled"; \
	fi

destroy-dev: check-env
	@echo "=== DANGER ZONE ==="
	@echo "DESTROYING DEV environment (Ireland)..."
	@echo "This will destroy ALL resources in dev environment!"
	@echo "Static IPs will be preserved due to prevent_destroy lifecycle"
	@read -p "Type 'DESTROY' to confirm: " confirm; \
	if [ "$$confirm" = "DESTROY" ]; then \
		terraform -chdir=infra destroy -var-file=environments/dev-eu-ie.tfvars -var="expected_environment=dev"; \
	else \
		echo "[CANCELLED] Must type exactly 'DESTROY'"; \
	fi
