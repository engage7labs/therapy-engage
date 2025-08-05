# Therapy Engage Platform - Next.js Enterprise Application

## Core Purpose & Success
- **Mission Statement**: Deliver a cloud-native, enterprise-grade mental health platform using Next.js, providing role-based access for therapists and patients with integrated session management, AI insights, and GDPR compliance.
- **Success Indicators**: 
  - Complete Next.js migration maintaining all Spark functionality
  - 100% successful authentication for valid credentials
  - Zero unauthorized cross-role data access
  - <2 second login process for demo accounts
  - Complete separation of therapist and patient interfaces
  - Persistent session management with secure logout
  - Ready for Azure AKS deployment pipeline
  - Compatible with existing infrastructure
- **Experience Qualities**: Enterprise, Secure, Intuitive, Professional

## Project Classification & Approach
- **Complexity Level**: Complex Application (Next.js enterprise framework with advanced routing)
- **Primary User Activity**: Interacting (comprehensive therapy workflow management)

## Migration Achievements
### Framework Migration ✅
- Successfully migrated from Spark/Vite to Next.js 15
- Implemented App Router with file-based routing
- Converted all components to Next.js compatible structure
- Added proper TypeScript configuration for Next.js

### Infrastructure Compatibility ✅
- Docker configuration updated for Next.js standalone build
- Health check endpoints for Kubernetes probes
- Environment variable mapping preserved
- Compatible with existing HELM charts and AKS deployment

### Feature Preservation ✅
- Complete authentication system (dr.smith + rodrigo demo accounts)
- Multi-language support (EN/PT/ES) with theme toggle
- Session timeout management with activity monitoring
- Emergency WhatsApp integration
- Video recording and session management
- GDPR/LGPD consent workflows
- Brazilian consent system
- Patient dashboard and therapist clinical interface
- Comprehensive demo testing components

## Thought Process for Feature Selection
- **Core Problem Analysis**: The platform serves therapists and patients with completely different access needs and interface requirements
- **User Context**: 
  - **Therapists**: Need clinical dashboard access for patient management
  - **Patients**: Require personal portal for therapy tracking and consent management
- **Critical Path**: Authentication → Role Detection → Appropriate Interface Routing
- **Key Moments**: First login, role switching for demos, secure logout

## Essential Features

### Dual-Role Authentication System
**Functionality**: Secure login with automatic role-based interface routing
**Purpose**: Ensure appropriate access levels and user experiences based on user role
**Success Criteria**: 
- Mock authentication for demo accounts (dr.delete/rodrigo)
- Automatic routing to therapist dashboard or patient portal
- Session persistence across page refreshes
- Secure logout functionality

### Demo Account Management
**Functionality**: Pre-configured demo accounts for platform evaluation
**Purpose**: Enable stakeholder demonstrations and system testing
**Success Criteria**:
- Therapist demo: dr.delete (full clinical access)
- Patient demo: rodrigo (patient portal access)
- Quick-access buttons for demonstration purposes
- Credential display for manual login testing

### Role-Based Interface Separation
**Functionality**: Completely different user interfaces based on authenticated role
**Purpose**: Provide role-appropriate functionality and maintain data security
**Success Criteria**:
- Therapist interface: Full clinical dashboard with patient management
- Patient interface: Personal portal with therapy progress and consent tools
- No cross-role data leakage or interface access

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Professional trust, secure confidence, intuitive clarity
- **Design Personality**: Medical-grade security with approachable user experience
- **Visual Metaphors**: Clinical clipboard, secure vault, personal health record
- **Simplicity Spectrum**: Clean login experience with clear role differentiation

### Color Strategy
- **Color Scheme Type**: Medical blue palette with role-specific accents
- **Primary Color**: Medical blue (oklch(0.55 0.15 250)) for platform trust
- **Secondary Colors**: 
  - **Therapist Accent**: Professional blue (oklch(0.55 0.15 250))
  - **Patient Accent**: Therapeutic green (oklch(0.65 0.15 135))
- **Role Indicators**: Blue badges for therapists, green badges for patients
- **Color Psychology**: Blue conveys medical professionalism, green suggests healing and personal growth

### Typography System
- **Font Pairing Strategy**: Inter font for consistency across authentication and platform
- **Typographic Hierarchy**: 
  - 24px bold for main headings
  - 16px medium for form labels
  - 14px regular for body text
- **Font Personality**: Clean, medical-grade legibility
- **Readability Focus**: High contrast, generous spacing for accessibility

### UI Elements & Component Selection
- **Component Usage**: 
  - Cards for login form containers
  - Tabs for manual vs quick-access login modes
  - Badges for role identification
  - Buttons for demo account quick-access
- **Component Customization**: Medical color palette, generous padding for accessibility
- **Component States**: Clear hover/focus states for form interaction
- **Icon Selection**: Stethoscope (therapist), User (patient), Shield (security)

### Accessibility & Readability
- **Contrast Goal**: WCAG AA compliance for all text and interactive elements
- **Additional Requirements**: Screen reader support, keyboard navigation, focus indicators

## Implementation Considerations
- **Scalability Needs**: Support for future multi-tenant authentication
- **Testing Focus**: Role separation validation, session persistence testing
- **Critical Questions**: 
  - How do we maintain complete data separation between roles?
  - What session timeout is appropriate for healthcare data?
  - How do we handle role switching during demonstrations?

## Technical Architecture
- **Authentication Context**: React Context for user state management
- **Persistent Storage**: useKV for session persistence across page refreshes
- **Route Protection**: Role-based component rendering and access control
- **Mock Database**: In-memory user store for demo functionality
- **Session Management**: Secure logout with complete state clearing