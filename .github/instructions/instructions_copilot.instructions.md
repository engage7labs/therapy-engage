---
applyTo: '**'
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
---

# Therapy Engage Platform - Development Guidelines

## Project Context
This is a Next.js 14 therapy platform with TypeScript, Tailwind CSS, and shadcn/ui components. The platform includes therapist dashboards, patient portals, session management, and real-time communication features.

## Auto-Iteration Guidelines

### When to Continue Automatically
- Build errors that can be resolved systematically
- TypeScript compilation issues
- Missing component dependencies
- CSS/styling fixes
- Import/export resolution
- Package installation and configuration
- File structure organization

### When to Pause for User Input
- Major architectural decisions
- Feature requirement clarification
- Breaking changes to existing functionality
- Security or authentication modifications
- Database schema changes
- External API integrations

## Coding Standards

### TypeScript
- Use strict typing with proper interfaces
- Export types alongside components
- Prefer `interface` over `type` for object shapes
- Use `const` assertions for immutable data

### React/Next.js
- Use `'use client'` directive for client components
- Implement `export const dynamic = 'force-dynamic'` for pages with client hooks
- Use App Router structure (app/ directory)
- Prefer server components when possible

### Component Structure
- Create reusable components in `/components`
- Use shadcn/ui for base UI components
- Implement proper props interfaces
- Include loading and error states

### File Organization
```
/app - Next.js App Router pages
/components - Reusable UI components
/contexts - React contexts for state management
/hooks - Custom React hooks
/lib - Utility functions and configurations
```

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS variables for theming
- Prefer composition over custom CSS

## Problem-Solving Approach

1. **Identify Root Cause**: Analyze error messages systematically
2. **Apply Fixes Incrementally**: Make small, targeted changes
3. **Validate Each Step**: Test compilation after each fix
4. **Document Changes**: Explain reasoning for modifications
5. **Maintain Functionality**: Ensure existing features continue working

## Build Process Priority
1. TypeScript compilation
2. Component dependency resolution
3. CSS compilation
4. Webpack bundling
5. Static generation (if applicable)

## Current Project Status
- ✅ TypeScript compilation working
- ✅ Component ecosystem complete
- ✅ CSS pipeline functional
- ✅ Development server operational
- 🔄 Production build optimization in progress