---
applyTo: '**'
Provide comprehensive project context and coding guidelines for the Therapy Engage Platform development continuation.
---

# Therapy Engage Platform - Comprehensive Development Guidelines

## 🏗️ Project Architecture Overview

### Core Platform
- **Framework**: Next.js 14.2.31 with App Router
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS + Spark Design System
- **UI Components**: shadcn/ui + Custom Spark components
- **Authentication**: NextAuth.js with JWT tokens
- **State Management**: React Context + Custom hooks
- **Internationalization**: i18n system (EN/PT/ES)

### Repository Structure
```
therapy-engage/
├── web/                           # Main Next.js application
│   ├── app/                       # App Router pages
│   │   ├── api/                   # API routes
│   │   ├── client-portal/         # Patient portal
│   │   ├── dashboard/             # Therapist dashboard
│   │   ├── login/                 # Authentication
│   │   ├── sessions/              # Session management
│   │   └── settings/              # User settings
│   ├── components/                # Reusable components
│   │   ├── auth/                  # Authentication components
│   │   ├── dashboard/             # Dashboard components
│   │   ├── layout/                # Layout components
│   │   ├── session/               # Session components
│   │   ├── ui/                    # Base UI components
│   │   └── patient/               # Patient-specific components
│   ├── contexts/                  # React contexts
│   ├── hooks/                     # Custom React hooks
│   └── lib/                       # Utilities and configurations
├── backend/                       # Backend services
├── infra/                        # Terraform infrastructure
├── charts/                       # Kubernetes charts
└── docs/                         # Documentation
```

## 🎯 Current Implementation Status

### ✅ Completed Features (August 2025)
1. **AI Clinical Insights Panel** (`web/components/session/ai-insights.tsx`)
   - Real-time session analysis with 3-tab interface
   - Live Feed with confidence metrics and risk indicators
   - Analysis Dashboard with sentiment/engagement tracking  
   - Recommendations panel with clinical actions
   - Priority system (low/moderate/high/critical)
   - Auto-refresh every 3 seconds during recording

2. **Enhanced Therapist Layout** (`web/components/layout/therapist-layout.tsx`)
   - Professional clinical sidebar with collapsible navigation
   - Emergency protocols quick access
   - Quick actions toolbar with patient management
   - Global search functionality
   - Session timer display
   - Real-time notifications system
   - Professional profile dropdown

3. **Session Management Integration** (`web/components/session/SessionManager.tsx`)
   - AI Insights integration in insights view
   - Recording status detection
   - Insight action callback handlers
   - Professional session controls

4. **Spark Design System Compliance**
   - Orange/blue theme system implementation
   - Mobile-first responsive design
   - Heart icon in login (Spark Figure 12)
   - Multi-language support (EN/PT/ES)
   - Professional color palette

### 🚧 Priority 1 - Critical Missing Components

1. **Enhanced Patient Layout** (`web/app/patient/layout.tsx`)
   - Patient-specific navigation structure
   - Emergency contact access
   - Session status display
   - Privacy controls toggle

2. **Session Recording Interface** (`web/components/session/recording-interface.tsx`)
   - Professional Start/Stop/Pause controls
   - Audio/Video quality indicators
   - Recording time display
   - Privacy compliance notices

3. **Session Timeout Manager** (`web/components/session/timeout-manager.tsx`)
   - Visual countdown timer
   - Auto-save functionality
   - Emergency session extension
   - Secure logout procedures

### 🔧 Priority 2 - Advanced Features

1. **Video Call Quality Tester** (`web/components/session/quality-tester.tsx`)
   - Connection quality metrics
   - Audio/Video test interface
   - Network diagnostics
   - Optimization recommendations

2. **UpcomingSessions Component** (`web/components/sessions/upcoming-sessions.tsx`)
   - Calendar integration visual
   - Session type indicators
   - Patient preparation status
   - Quick reschedule options

## 🎨 Spark Design System Implementation

### Color Tokens (Implemented)
```css
/* Primary Theme */
--spark-orange-primary: #f97316
--spark-blue-primary: #3b82f6
--spark-background: #ffffff
--spark-surface: #f8fafc

/* Clinical Colors (Need Implementation) */
--spark-clinical-green: #22c55e
--spark-warning-amber: #f59e0b  
--spark-critical-red: #ef4444
--spark-info-blue: #3b82f6
--spark-neutral-slate: #64748b
```

### Typography System
```css
--spark-font-family: 'Inter', sans-serif
--spark-clinical-font: 'Inter Medical', sans-serif
--spark-patient-font: 'Inter Friendly', sans-serif
--spark-emergency-weight: 600
```

### Spacing Clinical
```css
--spark-session-padding: 2rem
--spark-emergency-margin: 1rem
--spark-clinical-gap: 1.5rem
```

## 🔄 Development Workflow

### Auto-Iteration Guidelines
**Continue Automatically:**
- TypeScript compilation errors
- Missing imports/exports
- CSS styling fixes
- Component dependency resolution
- ESLint/Prettier formatting
- Build optimization issues

**Pause for User Input:**
- New feature architecture decisions
- Breaking changes to existing APIs
- Security/authentication modifications
- Database schema changes
- External API integrations
- Infrastructure modifications

### Code Quality Standards

#### TypeScript Best Practices
```typescript
// ✅ Good: Proper interface with exports
export interface SessionData {
  id: string;
  patientId: string;
  therapistId: string;
  status: 'scheduled' | 'active' | 'completed';
  insights?: ClinicalInsight[];
}

// ✅ Good: Component with proper props
interface AIInsightsProps {
  sessionId: string;
  isRecording: boolean;
  onInsightAction: (action: string, data: any) => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ 
  sessionId, 
  isRecording, 
  onInsightAction 
}) => {
  // Implementation
};
```

#### React/Next.js Patterns
```typescript
// ✅ Client components with directive
'use client';

// ✅ Server components (default)
export default function ServerComponent() {
  // No client-side hooks
}

// ✅ Dynamic routes
export const dynamic = 'force-dynamic';
```

#### Component Architecture
```typescript
// ✅ Helper functions for complex logic
const getProgressWidth = (confidence: number): string => {
  return `${Math.min(confidence * 100, 100)}%`;
};

const getNavigationItemClasses = (isActive: boolean): string => {
  return `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive 
      ? 'bg-spark-orange-50 text-spark-orange-600 border-l-4 border-spark-orange-500' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  }`;
};
```

## 🚀 Build & Deployment

### Development Commands
```bash
# Start development server
cd web && npm run dev

# Build for production
cd web && npm run build

# Type checking
cd web && npm run type-check

# Linting
cd web && npm run lint
```

### Docker Deployment
```bash
# Build Docker image (from root)
docker build -t therapy-engage .

# Current build time: ~72.3s (optimized)
# Image layers: Cached dependencies for faster rebuilds
```

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-component
git add .
git commit -m "feat: implement new component with Spark design"
git push origin feature/new-component

# Current branch: dev
# Last successful push: August 7, 2025
```

## 🧪 Testing Strategy

### Component Testing
```typescript
// Test AI Insights functionality
describe('AIInsights', () => {
  it('should display live feed when recording', () => {
    // Test implementation
  });
  
  it('should update insights every 3 seconds', () => {
    // Test real-time updates
  });
});
```

### Build Validation
- TypeScript compilation success
- ESLint warnings resolution
- Bundle size optimization (current: 87kB shared)
- Docker build verification

## 📋 Implementation Checklist

### Week 1 - Core Session Management
- [ ] Enhanced Patient Layout implementation
- [ ] Session Recording Interface with quality indicators
- [ ] Session Timeout Manager with security features
- [ ] Emergency protocols integration

### Week 2 - Advanced Features
- [ ] Video Call Quality Tester
- [ ] UpcomingSessions Calendar component
- [ ] Patient Video Call Selector
- [ ] Clinical recommendations system

### Week 3 - Spark Design Completion
- [ ] Complete Spark Figure references (8, 15, 22, 31)
- [ ] Clinical color tokens implementation
- [ ] Professional typography system
- [ ] Accessibility compliance (WCAG 2.1)

### Week 4 - Polish & Optimization
- [ ] Performance optimization
- [ ] Bundle size reduction
- [ ] Documentation completion
- [ ] End-to-end testing

## 🎯 Spark Design References

### Implemented
- ✅ **Spark Figure 12**: Logout modal with translations
- ✅ Heart icon in login design
- ✅ Orange/blue color system
- ✅ Mobile-first responsive layout

### Pending Implementation
- 🚧 **Spark Figure 8**: Session controls interface
- 🚧 **Spark Figure 15**: AI insights panel (enhanced version needed)
- 🚧 **Spark Figure 22**: Emergency protocols interface
- 🚧 **Spark Figure 31**: Complete clinical dashboard

## 🛠️ Technical Debt & Improvements

### High Priority
1. **Session Timer Integration**: Add real-time timer to TherapistLayout
2. **Emergency Protocols**: Complete implementation in sidebar
3. **Mobile Optimization**: Enhance AI Insights for mobile devices
4. **Performance**: Optimize real-time updates in AI components

### Medium Priority
1. **Accessibility**: Add ARIA labels to all clinical components
2. **Testing**: Increase test coverage for AI components
3. **Documentation**: Add JSDoc comments to all functions
4. **Bundle Size**: Code splitting for AI components

## 🔐 Security Considerations

### Authentication
- JWT token validation on all API routes
- Session timeout implementation (15min default)
- Secure logout with token invalidation

### Data Privacy
- HIPAA compliance for session recordings
- End-to-end encryption for patient data
- Audit logging for all clinical actions

### Emergency Protocols
- Quick access to emergency contacts
- Session termination procedures
- Data preservation during emergencies

## 🌍 Internationalization

### Current Support
- English (EN) - Complete
- Portuguese (PT) - Complete
- Spanish (ES) - Complete

### Implementation Pattern
```typescript
// Use translation hook
const { t } = useTranslation();

// Clinical terms
t('clinical.insights.confidence')
t('clinical.emergency.protocols')
t('session.recording.status')
```

## 📈 Performance Metrics

### Current Status (August 2025)
- Build time: 72.3s (Docker)
- Bundle size: 87kB (shared chunks)
- TypeScript compilation: ✅ Clean
- ESLint warnings: ✅ Resolved

### Optimization Goals
- Build time: <60s
- Bundle size: <80kB
- First Contentful Paint: <2s
- Time to Interactive: <3s

---

**Last Updated**: August 7, 2025  
**Version**: v2.1.0  
**Status**: AI Clinical Insights & Enhanced Therapist Layout Implemented  
**Next Milestone**: Enhanced Patient Layout & Session Recording Interface