# ADR-0003: Permanent Public IPs for Cost Optimization

**File:** `docs/adr/ADR-0003-permanent-public-ips.md`  
**Status:** Accepted  
**Date:** 30 July 2025

## Context

Our Azure infrastructure needs to balance cost optimization with operational stability. The current situation:

- **Cost Management:** Frequent `terraform destroy` operations to minimize Azure costs during development
- **Service Dependencies:** Backend API and Web Portal require stable public endpoints for:
  - Domain name configuration (DNS A records)
  - SSL certificate management (Let's Encrypt)
  - Client integrations and demos
  - CI/CD pipeline consistency

Without permanent IPs, each `terraform apply` generates new public IPs, requiring:
- DNS record updates
- SSL certificate reissuance
- Integration endpoint reconfiguration
- Broken client bookmarks/integrations

## Decision

Implement **permanent static public IP addresses** with `prevent_destroy = true` lifecycle rules for:

1. **Backend API IP** (`pip-backend`) - for GraphQL endpoint and health checks
2. **Web Portal IP** (`pip-portal`) - for user-facing application

### Implementation Strategy:

- **Location:** Integrated into existing `modules/networking` 
- **Lifecycle Protection:** `prevent_destroy = true` on both IP resources
- **Environment Variables:** Subscription ID from `ARM_SUBSCRIPTION_ID` (not hardcoded)
- **Multi-Region Ready:** Structure supports future Brazil (PROD) deployment

### Security Considerations:

- Subscription ID stored as environment variable/GitHub secret (not in public repo)
- Environment validation prevents accidental cross-environment deployments
- Makefile enforces secure deployment patterns

## Options Considered

### Option 1: Separate IP Pool Module (Rejected)
- **Pros:** Complete isolation, separate tfstate
- **Cons:** Additional complexity, separate CI/CD pipeline, over-engineering for current scale

### Option 2: Integrated Permanent IPs (Chosen)
- **Pros:** Leverages existing networking module, single terraform state, simpler operations
- **Cons:** IPs survive with main infrastructure (acceptable trade-off)

### Option 3: Azure DNS + Dynamic IPs (Rejected)
- **Pros:** No IP management needed
- **Cons:** Still requires reconfiguration on each deployment, DNS propagation delays

## Consequences

### Positive:
- **Cost Optimization:** Can `terraform destroy` infrastructure without losing endpoints
- **Operational Stability:** DNS, SSL, and integrations remain consistent
- **Development Velocity:** Faster iteration cycles without endpoint reconfiguration
- **Multi-Region Ready:** Architecture supports Ireland (DEV) and Brazil (PROD) expansion

### Negative:
- **Slight Cost Increase:** Static IPs cost ~€3.50/month each (acceptable for value provided)
- **Resource Persistence:** IPs survive even during full infrastructure rebuilds

### Neutral:
- **Compliance Ready:** Supports GDPR (Ireland) and LGPD (Brazil) data residency requirements
- **Enterprise Scalable:** Foundation for future global deployment

## Implementation Timeline

1. **Phase 1** (Current): Add permanent IPs to dev environment
2. **Phase 2** (Future): Replicate pattern for Brazil PROD environment  
3. **Phase 3** (Future): Global regions as needed

## Links

- [ADR-0001: Monorepo](./ADR-0001-monorepo.md)
- [ADR-0002: Stripe Billing](./ADR-0002-stripe-billing.md)
- [Networking Module](../../infra/modules/networking/)
- [Environment Configuration](../../infra/environments/)

---

*This decision supports the project's goal of cost-effective development while maintaining production-ready infrastructure patterns for mental health services.*