# ADR-0006: Frontend Web Portal Architecture

**File:** `docs/adr/ADR-0006-frontend-web-portal.md`

## Status
**ACCEPTED** - August 5, 2025

## Context
The Therapy Engage Platform requires a web-based portal for therapists to manage clients, sessions, and view AI-generated insights. This portal must be responsive, secure, and integrate seamlessly with our GraphQL backend API running on Azure Kubernetes Service (AKS).

### Business Requirements
- Therapist dashboard with client management
- Session scheduling and management
- Real-time mood tracking visualization  
- AI insights and recommendations display
- Secure authentication with Azure AD B2C
- Responsive design (mobile-friendly web)
- GDPR/LGPD compliant data handling

### Technical Constraints
- Must run as containerized application in AKS
- Connect to existing GraphQL API: `https://20.82.234.39.sslip.io/graphql`
- Portal domain: `https://134.149.41.178.sslip.io`
- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Maximum bundle size: 2MB for performance
- Target: <2s initial load time

## Decision

### Frontend Framework: Next.js 14 with App Router
**Rationale:**
- ✅ **Server-side rendering** for SEO and performance
- ✅ **App Router** for modern routing patterns
- ✅ **TypeScript** for type safety with medical data
- ✅ **Standalone output** for container optimization
- ✅ **Built-in optimization** (images, fonts, code splitting)

### UI/UX Technology Stack
```typescript
// Core Framework
Next.js 14.2 + TypeScript 5.4 + React 18.3

// Styling & Components  
Tailwind CSS 3.4 + @tailwindcss/forms
Heroicons 2.1 + Lucide React 0.400
Headless UI (future addition)

// Data & State Management
Apollo Client 3.10 + GraphQL 16.8
React Hook Form 7.51 + Zod 3.23 validation

// Authentication
NextAuth 4.24 + Azure AD B2C integration

// Charts & Visualization
Recharts 2.12 for mood tracking dashboards
```

### Architecture Patterns

#### 1. Container Strategy
```dockerfile
# Multi-stage build for optimization
FROM node:20-alpine AS builder
# Build Next.js standalone output
FROM node:20-alpine AS runner
# Copy .next/standalone for minimal container
```

#### 2. Component Architecture
```
src/
  app/                    # Next.js App Router
    (auth)/               # Authentication routes
      login/
      callback/
    dashboard/            # Main therapist dashboard
    clients/              # Client management
    sessions/             # Session management
    insights/             # AI insights display
    
  components/
    ui/                   # Reusable UI components
      Button/
      Card/
      Modal/
      DataTable/
    auth/                 # Authentication components
      LoginForm/
      ProtectedRoute/
    dashboard/            # Dashboard-specific components
      ClientCard/
      SessionList/
      MoodChart/
      InsightPanel/
    layout/               # Layout components
      Sidebar/
      Header/
      Navigation/

  lib/
    apollo-client.ts      # GraphQL client configuration
    auth.ts               # Authentication utilities
    utils.ts              # Common utilities
    validations.ts        # Zod schemas for forms
```

#### 3. State Management Strategy
- **Server State:** Apollo Client cache with GraphQL queries
- **Authentication State:** NextAuth session management
- **UI State:** React useState/useReducer for component state
- **Form State:** React Hook Form for complex forms

### Security Implementation

#### 1. Content Security Policy
```javascript
// next.config.js headers
'Content-Security-Policy': 
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "connect-src 'self' https://20.82.234.39.sslip.io; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data:;"
```

#### 2. Environment Variables
```bash
# Required for production
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://20.82.234.39.sslip.io/graphql
NEXT_PUBLIC_APP_URL=https://134.149.41.178.sslip.io
NEXTAUTH_URL=https://134.149.41.178.sslip.io
NEXTAUTH_SECRET=[generated-secret]

# Azure AD B2C Configuration
NEXT_PUBLIC_B2C_CLIENT_ID=[client-id]
NEXT_PUBLIC_B2C_AUTHORITY=https://[tenant].b2clogin.com/[tenant].onmicrosoft.com/B2C_1_signupsignin
```

### Deployment Strategy

#### 1. Containerization with Podman
```dockerfile
# Dockerfile optimized for AKS deployment
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder  
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

#### 2. Kubernetes Deployment
```yaml
# HELM chart: charts/web-portal/
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-portal
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-portal
  template:
    spec:
      containers:
      - name: web-portal
        image: ghcr.io/therapyengageorg/web-portal:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_GRAPHQL_ENDPOINT
          value: "https://20.82.234.39.sslip.io/graphql"
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
```

#### 3. Ingress Configuration
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-portal-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - 134.149.41.178.sslip.io
    secretName: web-portal-tls
  rules:
  - host: 134.149.41.178.sslip.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-portal-service
            port:
              number: 80
```

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
- ✅ Create Next.js application structure
- ✅ Configure Apollo Client with GraphQL endpoint
- ✅ Setup basic authentication flow
- ✅ Create Dockerfile and HELM chart
- ✅ Deploy to AKS with sslip.io domain

### Phase 2: Dashboard Components (Week 2)  
- ✅ Build therapist dashboard layout
- ✅ Create client management interface
- ✅ Implement session management
- ✅ Add mock data for development

### Phase 3: Real Data Integration (Week 3)
- ✅ Connect to live GraphQL API
- ✅ Implement real authentication
- ✅ Add error handling and loading states
- ✅ Performance optimization

### Phase 4: Advanced Features (Week 4)
- ✅ AI insights visualization
- ✅ Real-time updates via WebSocket
- ✅ Advanced filtering and search
- ✅ Export capabilities

## Consequences

### Positive
- ✅ **Modern Developer Experience:** Next.js 14 with TypeScript provides excellent DX
- ✅ **Performance:** SSR + standalone output = fast loading
- ✅ **Security:** Built-in security headers + NextAuth integration
- ✅ **Scalability:** Container-ready for horizontal scaling in AKS
- ✅ **Maintainability:** Component-based architecture with clear separation
- ✅ **Mobile-Friendly:** Responsive design works across devices

### Negative
- ⚠️ **Bundle Size:** Rich UI components may increase bundle size
- ⚠️ **Learning Curve:** App Router is newer pattern for team
- ⚠️ **Build Complexity:** Multi-stage Docker builds require careful optimization
- ⚠️ **Authentication Complexity:** Azure AD B2C integration requires configuration

### Mitigation Strategies
- **Bundle Optimization:** Code splitting, dynamic imports, tree shaking
- **Documentation:** Comprehensive component documentation and examples
- **Container Optimization:** Multi-stage builds with minimal runtime image
- **Authentication:** Step-by-step B2C setup documentation with examples

## Alternatives Considered

### React SPA + Vite
- **Pros:** Faster dev server, smaller build tool
- **Cons:** No SSR, SEO challenges, manual routing

### Vue.js + Nuxt
- **Pros:** Similar SSR benefits, potentially smaller bundle
- **Cons:** Team expertise in React, existing Apollo Client setup

### Server-Side Only (ASP.NET Core MVC)
- **Pros:** Simpler deployment, traditional approach
- **Cons:** Poor UX for dashboard interactions, limited real-time features

## References
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Apollo Client React Integration](https://www.apollographql.com/docs/react/)
- [Azure AD B2C with NextAuth](https://next-auth.js.org/providers/azure-ad-b2c)
- [Kubernetes Ingress NGINX](https://kubernetes.github.io/ingress-nginx/)
- [GDPR Compliance for Healthcare Apps](https://gdpr.eu/healthcare-data-protection/)

---

**Decision made by:** Rodrigo Marques Teixeira (MSc Student)  
**Technical review:** Dr. Zé Deleta (AI Assistant)  
**Date:** August 5, 2025  
**Next review:** Sprint 3 retrospective