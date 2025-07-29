# ADR-0001: Adopt a Monorepo
Status: Accepted  
Date: 2025-07-29

## Context
We need a repo structure that supports infrastructure (Terraform), backend
(Node + NestJS), mobile (Flutter) and web (Next.js) while the team is <10 devs
and releases are tightly coupled.

## Decision
Store all code in a single GitHub repository `therapy-engage`.

## Options Considered
* Monorepo (chosen)  
* Polyrepo (infra, backend, mobile, web split)  
* Hybrid (infra private, apps public)

## Consequences
* Single PR can update Terraform + backend.  
* CI uses path filters to run only impacted jobs.  
* Repo checkout is heavier (~500 MB when mobile assets arrive).  
* Future teams may need to revisit if app teams become autonomous.
