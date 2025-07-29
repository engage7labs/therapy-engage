ADR‑0002: Adopt Stripe for Billing

Status: AcceptedDate: 29 July 2025

Context

We require a payment platform to charge psychology clinics for the Therapy Engagement SaaS, handle subscription tiers (per‑therapist seat) and eventual usage‑based add‑ons. Two primary options were evaluated:

Stripe Checkout + Billing APIs – card, Apple Pay, Pix, coupons; rapid onboarding; webhooks for metered usage.

Microsoft Commerce (Azure Marketplace / SaaS Fulfillment API) – billing through the customer’s Azure invoice; integrated seat management; slower publication cycle.

The majority of target clinics pay via credit card or local methods (e.g., Pix in Brazil) and are not necessarily Azure customers.

Decision

Adopt Stripe Checkout and Billing APIs as the billing backbone for MVP and early rollout.

Implement Stripe self‑serve checkout in W‑00 Platform Sign‑up.

Webhooks validated in Azure Function stripe_webhooks → GraphQL mutation stripeEvent to sync subscription state.

Per‑seat pricing stored in Invoice entity; usage metering (e.g., extra AI minutes) reported daily via Stripe Usage Records.

Consequences

Faster go‑to‑market: no Partner Center approval, test mode available instantly.

Supports international payment methods (135+ currencies, Pix, boleto) needed for Brazil expansion.

Revenue share limited to Stripe fee (~2.9 % + fixed) rather than 3–20 % Microsoft cut.

Clinics with enterprise Azure contracts will pay separately; future ADR may introduce Microsoft Commerce as an additional channel.

We must manage seat entitlements in our backend; Stripe customer portal customization required.

Alternatives Considered but Not Chosen

Microsoft Commerce only – misaligned with small/private clinics, longer onboarding.

Hybrid (Stripe + Microsoft) in MVP – complexity too high for first release; revisit after product‑market fit.

Links

ADR‑0001 – Adopt Monorepo

Data Model & API Spec v0.3 – stripeEvent mutation, Invoice entity

This decision will be reviewed after the first 25 live clinics or if enterprise customers demand Azure Marketplace billing.