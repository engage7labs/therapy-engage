# ADR-0004: Makefile for Safe Terraform Operations

**File:** `docs/adr/ADR-0004-makefile-terraform-operations.md`  
**Status:** Accepted  
**Date:** 30 July 2025

## Context

Our infrastructure management requires multiple safety checks and consistent command patterns:

### Current Challenges:
- **Human Error Risk:** Direct `terraform` commands can target wrong subscriptions/environments
- **Inconsistent Commands:** Different developers use different parameter combinations
- **Security Exposure:** Subscription IDs hardcoded in files or forgotten in commands
- **Environment Confusion:** Easy to apply dev configs to prod (or vice versa)
- **Team Onboarding:** New developers need to learn complex terraform command patterns

### Multi-Environment Future:
- **DEV Environment:** Ireland (North Europe) for GDPR compliance testing
- **PROD Environment:** Brazil (South America) for LGPD compliance
- **Potential Expansion:** Global regions as mental health platform scales

## Decision

Implement a **root-level Makefile** with standardized, safe infrastructure operations.

### Key Features:

#### 1. Environment Safety
```makefile
make plan-dev    # Only operates on dev environment
make apply-dev   # Explicit dev targeting
make destroy-dev # Requires DESTROY confirmation
```

#### 2. Security-First Design
- **No hardcoded subscription IDs** in public repository
- **Environment variable validation:** `ARM_SUBSCRIPTION_ID` required
- **Subscription verification:** Confirms Azure CLI matches environment variable
- **Environment cross-check:** Validates `expected_environment` parameter

#### 3. Standardized Workflows
- **Consistent parameters:** Always uses correct `.tfvars` file
- **Required confirmations:** Interactive prompts for destructive operations
- **Clear feedback:** Emoji-based status indicators for developer experience

## Options Considered

### Option 1: Shell Scripts (Rejected)
- **Pros:** Cross-platform compatibility
- **Cons:** Less expressive than Make, harder dependency management

### Option 2: Just Taskfile (Rejected)
- **Pros:** Modern YAML-based task runner
- **Cons:** Additional tool installation, less universal than Make

### Option 3: CI/CD Only (Rejected)
- **Pros:** Centralized control
- **Cons:** Slower development cycles, requires GitHub for all operations

### Option 4: Makefile with Safety Patterns (Chosen)
- **Pros:** Universal tool, expressive syntax, excellent safety patterns
- **Cons:** Windows compatibility requires installation

## Implementation

### Commands Structure:
```bash
make help         # Show available operations
make check-env    # Validate environment setup
make plan-dev     # Plan Ireland dev environment
make apply-dev    # Apply Ireland dev environment  
make destroy-dev  # Destroy Ireland dev environment
```

### Safety Mechanisms:
- **Environment variable validation** before any operation
- **Subscription ID verification** matches Azure CLI context
- **Interactive confirmations** for apply/destroy operations
- **Environment parameter validation** prevents cross-environment accidents

### Windows Compatibility:
- **Git Bash users:** Install via `choco install make`
- **PowerShell alternative:** Commands documented for direct terraform usage
- **Team documentation:** Installation instructions in README

## Consequences

### Positive:
- **Reduced Human Error:** Standardized, validated operations
- **Faster Onboarding:** New developers run `make help` and understand immediately
- **Security Improvement:** No subscription IDs in public code, environment validation
- **Consistency:** Same commands work for all developers across all environments
- **Multi-Environment Ready:** Easy to add `make plan-prod`, `make apply-prod` for Brazil

### Negative:
- **Windows Installation Required:** Developers need `make` tool
- **Learning Curve:** Team needs to adopt Makefile patterns vs. direct terraform
- **Abstraction Layer:** Debugging requires understanding both Make and Terraform

### Neutral:
- **Documentation Overhead:** Need to maintain Makefile and document commands
- **CI/CD Integration:** GitHub Actions can use same `make` commands

## Adoption Strategy

### Phase 1: Development Team
- All infrastructure changes use `make plan-dev` / `make apply-dev`
- Document Windows make installation process
- Update team onboarding documentation

### Phase 2: CI/CD Integration  
- GitHub Actions workflows use same `make` commands
- Environment-specific secrets configuration
- Branch protection rules require successful `make plan-*`

### Phase 3: Production Operations
- Add `make plan-prod` / `make apply-prod` for Brazil environment
- Production-specific safety confirmations
- Audit logging for production operations

## Links

- [ADR-0001: Monorepo](./ADR-0001-monorepo.md)
- [ADR-0002: Stripe Billing](./ADR-0002-stripe-billing.md)  
- [ADR-0003: Permanent Public IPs](./ADR-0003-permanent-public-ips.md)
- [Root Makefile](../../Makefile)
- [Environment Configurations](../../infra/environments/)

---

*This decision supports safe, consistent infrastructure operations for a mental health platform where reliability and security are paramount.*