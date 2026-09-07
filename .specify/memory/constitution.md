<!-- 
Sync Impact Report
==================
Version change: N/A → 1.0.0
Modified principles: None (initial creation)
Added sections:
  - Purpose
  - Core Principles (8 principles)
  - Technical Standards
  - Governance
  - Template References
Removed sections: None
Templates requiring updates:
  ✅ Plan template created: .specify/templates/plan-template.md
  ✅ Spec template created: .specify/templates/spec-template.md
  ✅ Tasks template created: .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# WorkPilot Project Constitution

**Version**: 1.0.0  
**Ratification Date**: 2026-09-04  
**Last Amended**: 2026-09-04

## Purpose

WorkPilot is a premium SaaS task management platform built for productivity, simplicity, and team collaboration. This constitution establishes the non-negotiable principles and governance standards that guide all development decisions.

## Core Principles

### 1. Type Safety First

All code MUST be written in TypeScript with strict type checking enabled. No `any` types are permitted without explicit justification and documentation. Type definitions MUST be co-located with their usage or placed in shared type files.

**Rationale**: Type safety prevents runtime errors, improves developer experience, and ensures code maintainability across the team.

### 2. Component Composition Over Configuration

React components MUST be designed as composable, single-responsibility units. Prefer composition patterns (render props, compound components) over prop drilling or complex configuration objects. Components SHOULD NOT exceed 300 lines of code.

**Rationale**: Composable components are easier to test, reuse, and maintain. They reduce cognitive load and prevent monolithic components that become difficult to modify.

### 3. Explicit State Management

State management MUST use Redux Toolkit for global state and React Query for server state. Local component state SHOULD use React hooks. All state mutations MUST be predictable and traceable through actions or queries.

**Rationale**: Clear state management boundaries prevent data inconsistencies and make debugging easier. Redux Toolkit provides predictable state updates, while React Query handles server state synchronization.

### 4. Internationalization by Default

All user-facing strings MUST use the i18n translation system. Component text MUST reference translation keys rather than hardcoded strings. RTL support MUST be considered in all layout components.

**Rationale**: WorkPilot targets global users with English and Arabic support. Internationalization by default prevents technical debt and ensures consistent user experience across languages.

### 5. Accessibility Compliance

All interactive elements MUST be keyboard accessible. Components MUST include proper ARIA attributes where semantic HTML is insufficient. Color contrast ratios MUST meet WCAG 2.1 AA standards.

**Rationale**: Accessibility is a legal requirement in many jurisdictions and ensures the product is usable by all users regardless of ability.

### 6. Performance Budget

Initial bundle size MUST NOT exceed 200KB gzipped. Images MUST be optimized and served in modern formats (WebP, AVIF). Code splitting MUST be implemented for route-based loading. Core Web Vitals MUST meet "Good" thresholds.

**Rationale**: Performance directly impacts user retention and SEO. Strict budgets prevent gradual degradation that affects user experience.

### 7. Security by Design

Authentication tokens MUST be stored securely (httpOnly cookies preferred). API requests MUST include proper CSRF protection. Sensitive data MUST NOT be logged or exposed in client-side code. Input validation MUST be performed on both client and server.

**Rationale**: Security vulnerabilities can expose user data and damage trust. Security must be considered from the initial design, not added as an afterthought.

### 8. Documentation as Code

All components MUST include JSDoc comments for public APIs. Complex algorithms or business logic MUST have inline documentation. README files MUST be maintained for major features and architectural decisions.

**Rationale**: Documentation ensures knowledge transfer and reduces onboarding time. Documentation as code keeps documentation close to the implementation and prevents it from becoming outdated.

## Technical Standards

### Code Quality

- All code MUST pass ESLint checks without warnings
- TypeScript compilation MUST produce no errors
- Code formatting MUST follow Prettier configuration
- Git commits MUST follow conventional commit format

### Testing

- Critical business logic MUST have unit tests
- Component interactions MUST have integration tests
- User workflows MUST have end-to-end tests
- Test coverage MUST NOT fall below 80% for new code

### Performance

- Lighthouse scores MUST be 90+ for Performance, Accessibility, Best Practices, and SEO
- First Contentful Paint MUST be under 1.5 seconds
- Largest Contentful Paint MUST be under 2.5 seconds
- Cumulative Layout Shift MUST be under 0.1

## Governance

### Amendment Process

1. Propose changes via pull request with clear justification
2. Review by at least two team members
3. Update version according to semantic versioning:
   - MAJOR: Breaking principle changes
   - MINOR: New principles or material expansions
   - PATCH: Clarifications and wording improvements
4. Update this document with new version and date
5. Propagate changes to dependent templates and documentation

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-09-04 | Initial constitution creation |

### Compliance Review

- Monthly review of adherence to principles
- Quarterly audit of technical standards compliance
- Annual review and update of constitution
- All pull requests must include principle compliance check

## Template References

- Plan template: `.specify/templates/plan-template.md`
- Spec template: `.specify/templates/spec-template.md`
- Tasks template: `.specify/templates/tasks-template.md`
