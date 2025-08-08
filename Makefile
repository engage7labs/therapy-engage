# Makefile for safe Terraform operations
# Therapy Engage Platform - Infrastructure Automation

.PHONY: help check-env init plan-dev apply-dev destroy-dev fmt validate deploy-backend-dev deploy-backend-dev-secure

help:
	@echo "=== Therapy Engage Platform - Infrastructure ==="
	@echo ""
	@echo "Available targets:"
	@echo "  check-env            - Check environment and Azure login"
	@echo "  init                 - Initialize Terraform"
	@echo "  fmt                  - Format Terraform files"
	@echo "  validate             - Validate Terraform configuration"
	@echo "  plan-dev             - Plan dev environment (Ireland)"
	@echo "  apply-dev            - Apply dev environment (Ireland)"
	@echo "  destroy-dev          - Destroy dev environment (Ireland)"
	@echo "  deploy-backend-dev   - Deploy backend with test CosmosDB key"
	@echo "  deploy-backend-dev-secure - Deploy backend with secure CosmosDB key"
	@echo ""
	@echo "Required environment variables:"
	@echo "  ARM_SUBSCRIPTION_ID - Azure subscription ID"
	@echo "  COSMOSDB_KEY        - CosmosDB key (for secure deploy)"
	@echo ""
	@echo "Example workflow:"
	@echo "  make check-env && make plan-dev && make apply-dev"
	@echo "  make deploy-backend-dev-secure  # with COSMOSDB_KEY set"

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

# Backend deployment commands
deploy-backend-dev:
	@echo "Deploying backend to DEV with test CosmosDB credentials..."
	@echo "[WARNING] Using test credentials - not for production!"
	helm upgrade --install backend-app charts/backend-app/ \
		-f charts/backend-app/values.dev.yaml \
		--set cosmosdb.key="CHAVE_LOCAL_TESTE" \
		--namespace default \
		--create-namespace

deploy-backend-dev-secure:
	@echo "Deploying backend to DEV with secure CosmosDB credentials..."
	@if [ -z "$$COSMOSDB_KEY" ]; then \
		echo "[ERROR] COSMOSDB_KEY environment variable not set"; \
		echo "Usage: COSMOSDB_KEY=\"your-real-key\" make deploy-backend-dev-secure"; \
		exit 1; \
	fi
	@echo "[OK] COSMOSDB_KEY is set - deploying securely..."
	helm upgrade --install backend-app charts/backend-app/ \
		-f charts/backend-app/values.dev.yaml \
		--set cosmosdb.key="$$COSMOSDB_KEY" \
		--namespace default \
		--create-namespace
	@echo "[SUCCESS] Backend deployed with secure credentials"

# Helper command to get CosmosDB key from Azure
get-cosmosdb-key:
	@echo "Retrieving CosmosDB key from Azure..."
	@az cosmosdb keys list --name therapyengage-cosmosdb-dev --resource-group rg-therapy-dev --query primaryMasterKey -o tsv
