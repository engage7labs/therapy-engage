# 📋 Pull Request Description

## Sprint/Feature

[e.g., Sprint D3 - Icons Fix, Feature Authentication, etc.]

## Changes Made

- [ ] New feature implementation
- [ ] Bug fix
- [ ] Code refactoring
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other: ___________

## Detailed Description

[Provide a clear and detailed description of the changes]

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Build passes locally
- [ ] ESLint passes without warnings

## Screenshots (if applicable)

[Add screenshots for UI changes]

## Breaking Changes

- [ ] Yes (describe below)
- [ ] No

[If yes, describe the breaking changes and migration steps]

## Deployment Notes

- [ ] No database migration required
- [ ] No environment variable updates needed
- [ ] Container images build successfully locally
- [ ] Health endpoints respond correctly
- [ ] No special Azure Container Apps configuration needed

## Container Apps Checklist

- [ ] Frontend Dockerfile builds without errors
- [ ] Backend Dockerfile builds without errors  
- [ ] Health endpoints implemented and tested:
  - [ ] Backend: `GET /health` returns `{ "status": "ok" }`
  - [ ] Frontend: `GET /api/health` returns `{ "status": "healthy" }`
- [ ] No secrets or sensitive data in container images
- [ ] Environment variables properly configured for production

## Checklist

- [ ] Code follows project coding standards
- [ ] Self-review completed
- [ ] Code is properly commented
- [ ] Documentation updated (if needed)
- [ ] No console.log statements in production code
- [ ] Secrets/sensitive data not exposed

## Related Issues

Fixes #[issue_number]
Closes #[issue_number]
Related to #[issue_number]

---

## Reviewer Notes

[Any specific areas you'd like reviewers to focus on]
