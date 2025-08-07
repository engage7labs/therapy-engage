# TO_RESTORE_LATER - Archived Code Documentation

## Purpose
This directory contains temporarily moved code that was causing Docker build failures due to `@/` import path resolution issues. The code is preserved here for future restoration and integration.

## Original Structure and Locations

### Date Archived: August 7, 2025
### Reason: Docker build failing due to webpack module resolution of `@/` imports

## Archived Directories:

### 1. app/preliminary/
**Original Path**: `web/app/preliminary/`
**Contents**: Complete preliminary version of the therapy platform
- **Components**: Advanced UI components with shadcn/ui
- **Pages**: dashboard, settings, sessions, login, client-portal
- **Contexts**: auth-context, theme-context with full functionality
- **Hooks**: use-logout-confirmation and other custom hooks
- **Features**: Full therapy platform with advanced features

### 2. app/mvp-preliminar/
**Original Path**: `web/app/mvp-preliminar/`  
**Contents**: MVP preliminary version
- **Structure**: Similar to preliminary but potentially different versions
- **Components**: Therapy-specific components
- **Features**: Core MVP functionality

### 3. mvp-preliminar_old_claude_code/
**Original Path**: `web/mvp-preliminar/`
**Contents**: Previous therapy platform implementation by Claude
- **Status**: Archived old Claude code (not Spark code)
- **Purpose**: Legacy implementation that was replaced
- **Move Date**: August 7, 2025
- **Structure**: Complete old therapy platform codebase

### 4. page_simple_redirect.tsx
**Original Path**: `web/app/page.tsx`
**Contents**: Simple redirect page created during build troubleshooting
- **Status**: Replaced with Spark-based page.tsx with role-based dashboards
- **Purpose**: Basic redirect to current-version route
- **Move Date**: August 7, 2025

### 5. current-version_page_simple.tsx
**Original Path**: `web/app/current-version/page.tsx`  
**Contents**: Simple current-version landing page
- **Status**: Replaced with redirect to main app
- **Purpose**: Basic current-version entry point
- **Move Date**: August 7, 2025

### 6. app_preliminary_remaining/ (if exists)
**Original Path**: `web/app/preliminary/`
**Contents**: Remaining preliminary code that wasn't moved earlier
- **Status**: Moved to preserve from build conflicts
- **Purpose**: Additional preliminary therapy platform code
- **Move Date**: August 7, 2025

### 7. Root page.tsx (if moved)
**Original Path**: `web/app/page.tsx`
**Contents**: Main landing page with complex component dependencies

## Key Files with @/ Imports (to be fixed when restoring):

### Components that need path fixes:
- All UI components in `preliminary/components/ui/` using `@/lib/utils`
- Session management components using `@/hooks/use-kv`
- Layout components using `@/components/` imports
- Auth components using `@/contexts/` imports

### Pages that need path fixes:
- `preliminary/dashboard/page.tsx` - Complex dashboard with multiple imports
- `preliminary/sessions/page.tsx` - Session management functionality  
- `preliminary/settings/page.tsx` - Settings with KV storage
- `preliminary/login/page.tsx` - Login with auth context

### Common Import Patterns to Fix When Restoring:
```typescript
// Current problematic imports:
import { useKV } from '@/hooks/use-kv'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Should become relative imports like:
import { useKV } from '../../hooks/use-kv'
import { useAuth } from '../contexts/auth-context'
import { Button } from '../components/ui/button'
import { cn } from '../../lib/utils'
```

## Restoration Strategy (for future):
1. **Phase 1**: Fix all `@/` imports to relative paths
2. **Phase 2**: Ensure all dependencies exist in correct locations
3. **Phase 3**: Test each component/page individually
4. **Phase 4**: Integrate back into main app structure
5. **Phase 5**: Update routing and navigation

## Notes:
- The `current-version/` directory was kept and simplified to ensure basic functionality
- All pages in `current-version/` now use simple relative imports: `../../contexts/auth-context`
- The goal is to get Docker build working first, then gradually restore advanced features

## Working Current Structure (kept):
```
web/app/
├── contexts/
│   └── auth-context.tsx          # ✅ Working
├── current-version/
│   ├── page.tsx                  # ✅ Simple redirect logic
│   ├── login/page.tsx            # ✅ Simple login
│   ├── dashboard/page.tsx        # ✅ Simple dashboard
│   ├── client-portal/page.tsx    # ✅ Simple portal
│   ├── sessions/page.tsx         # ✅ Simple sessions
│   └── settings/page.tsx         # ✅ Simple settings
└── layout.tsx                    # ✅ Basic layout
```

All files in current-version use only:
- `../../contexts/auth-context` (relative import that works in Docker)
- Next.js built-in functions (`redirect`)
- Simple HTML/Tailwind without complex component dependencies
