# Capiro: Building a Production SaaS Platform with Claude Cowork

## Project Overview

**Capiro** is an agentic AI platform that automates legislative submission workflows for lobbying firms. It standardizes how firms manage Congressionally Directed Spending (CDS) appropriations requests, track compliance deadlines, and interact with the Senate Lobbying Disclosure Act (LDA) registry — replacing a process that is currently done through scattered spreadsheets, PDFs, and manual data entry across dozens of congressional office portals.

I built the full-stack application — frontend, backend, infrastructure, and deployment pipeline — in collaboration with Claude, using Claude Cowork as my primary development environment. The project went from zero to a deployed, production-grade application in **10 days** (March 18–27, 2026).

**Live repo:** [github.com/neomartinez30/Capiro](https://github.com/neomartinez30/Capiro)

---

## What the Product Does

Lobbying firms file disclosure reports with the Senate (LD-2 filings) and submit appropriations requests to individual congressional offices on behalf of their clients. Each senator's office has its own form, its own deadlines, and its own submission portal. A mid-size firm managing 20+ clients across 10+ offices faces hundreds of individual submissions per cycle — each requiring a white paper, a filled form, and compliance tracking.

Capiro automates this end-to-end:

1. **LDA Registry Sync** — Firms search and link to their official Senate LDA registrant profile. Capiro pulls their clients, lobbyists, topics, and filing history directly from the Senate API.
2. **Compliance Dashboard** — KPIs for open filings, upcoming deadlines, at-risk submissions, and compliance health score. Activity feed and AI-generated compliance insights.
3. **Entity Management** — Full CRUD for clients, lobbyists, and policy topics, enriched with LDA filing data (annual spend, covered positions, industry classifications).
4. **8-Stage Submission Wizard** — The core workflow: select a client → upload documents → choose a policy topic → generate an AI white paper (via Bedrock Claude) → select target senator offices → auto-fill office-specific forms with a Bedrock Agent → insert white paper content → review and submit.
5. **Congressional Office Database** — Structured data on senator offices including deadlines, submission methods, and downloadable form templates.

---

## How I Used Claude Cowork

This project was built almost entirely through conversational collaboration with Claude in Cowork mode. Here's how the workflow actually looked:

### The Development Pattern

I would describe what I needed at a high level — "build the onboarding flow that searches the LDA API and pulls firm data into DynamoDB" — and Claude would scaffold the full implementation: React components, context providers, API service layer, Lambda handler, and DynamoDB schema. I'd review, iterate on specifics, and move to the next feature.

The key advantage wasn't just code generation — it was **architectural coherence across the stack**. Claude maintained context about the DynamoDB single-table design, the auth flow, the API contract, and the component hierarchy simultaneously, which meant changes in the Lambda handler were automatically consistent with the frontend API client and the React context layer.

### What Claude Built vs. What I Directed

**I defined:**
- The product vision and domain (legislative compliance for lobbying firms)
- The user workflow (LDA search → onboarding → dashboard → submission wizard)
- Which AWS services to use (Cognito, DynamoDB, Lambda, Amplify)
- The data model decisions (single-table DynamoDB design, firm-scoped partitioning)
- Brand and design direction (color palette, typography, institutional tone)
- Integration targets (Senate LDA API, Bedrock Claude agents)

**Claude implemented:**
- All 47 React components and 17 CSS stylesheets (~17,000 lines of code)
- The Lambda function with LDA API proxy, DynamoDB CRUD, and CORS handling
- Auth flow with Cognito sign-up/sign-in/confirmation and session persistence
- FirmDataContext with auto-recovery logic for crashed onboarding sessions
- The 8-stage submission wizard with state management across steps
- API service layer with error handling and retry logic
- Deployment pipeline (Amplify config, deploy scripts)
- Bug fixes for CORS header duplication, auth state race conditions, and LDA search relevance sorting

### Debugging with Claude

Some of the most productive sessions were debugging. For example:

- **CORS rejection in production** — The Lambda was sending duplicate CORS headers (one from the handler, one from the Function URL config). Claude identified the conflict, traced it through both layers, and fixed it in one pass.
- **Auth modal unmounting during sign-in** — A global loading state was causing the entire app to re-render, unmounting the login modal mid-flow. Claude restructured the loading logic to be scoped to the auth context rather than the app root.
- **LDA search relevance** — Initial search results came back in arbitrary order from the Senate API. Claude added client-side relevance scoring that weights exact name matches, prefix matches, and word-boundary matches.

### Development Timeline

| Date | Milestone |
|------|-----------|
| Mar 18 | Repo created, initial landing page uploaded |
| Mar 19 | Restructured repo, cleaned up initial files |
| Mar 20 | Phase 0 foundation (Turborepo scaffold), dashboard UI with sparklines and charts, LDA API integration, lobbyist profile UI |
| Mar 21 | AWS infrastructure buildout — DynamoDB table, Lambda functions, API Gateway, LDA proxy with rate limiting and HTTPS, firm profile page |
| Mar 22 | Major feature sprint — Auth flow, onboarding, brand-aligned landing page, all dashboard pages wired to DynamoDB, entity management, FirmDataContext, Amplify deployment. **20 commits in one day.** |
| Mar 23 | Production hardening — removed all mock data, added org validation, DynamoDB auto-recovery, CORS fix, search relevance sorting |
| Mar 27 | Final cleanup and polish |

The heaviest day (March 22) saw 20 commits across the full stack — from CSS styling to DynamoDB schema changes to auth bug fixes. That kind of velocity is only possible when you can describe intent and have the implementation generated coherently across every layer.

---

## Technical Architecture

### Frontend
- **React 18** with Vite bundler
- **React Router v7** for client-side routing
- **AWS Amplify SDK** for Cognito authentication
- Custom CSS with design tokens (no component library — fully custom UI)

### Backend
- **AWS Lambda** (Node.js 20.x) — single handler for LDA proxy + DynamoDB CRUD
- **DynamoDB** — single-table design with `FIRM#<id>` partition keys
- **AWS Cognito** — user pool with email confirmation
- **AWS Amplify** — CI/CD deployment pipeline

### External Integrations
- **Senate LDA API** (`lda.senate.gov/api/v1`) — registrant search, LD-2 filing data
- **AWS Bedrock** (Claude agent) — white paper generation, agentic form-filling
- **Congress.gov API** — bill tracking (planned)
- **Federal Register API** — regulatory data (planned)

### Data Model (DynamoDB Single-Table)

```
PK: FIRM#<firmId>    SK: PROFILE              → firm metadata + LDA info
PK: FIRM#<firmId>    SK: CLIENT#<clientId>    → client entity
PK: FIRM#<firmId>    SK: LOBBYIST#<id>        → lobbyist entity
PK: FIRM#<firmId>    SK: TOPIC#<topicId>      → policy topic
PK: FIRM#<firmId>    SK: SUBMISSION#<id>      → submission record
PK: FIRM#<firmId>    SK: FILING#<id>          → filing period
PK: OFFICE           SK: OFFICE#<officeId>    → congressional office (global)
```

All firm data is scoped by partition key, giving complete multi-tenant isolation with no additional access control logic.

---

## Project by the Numbers

| Metric | Value |
|--------|-------|
| Total development time | ~10 days |
| Lines of code (JS/JSX/CSS) | ~17,000 |
| React components | 47 |
| CSS stylesheets | 17 |
| Total commits | 52 |
| Peak commits in a single day | 20 (Mar 22) |
| AWS services integrated | 7 (Lambda, DynamoDB, Cognito, Amplify, S3, CloudFront, API Gateway) |
| External APIs integrated | 2 (Senate LDA, Bedrock Claude) |
| Pages in the application | 9 (Landing, Onboarding, Dashboard, Firm Profile, Entities, Submissions, Submission Wizard, Offices, Settings) |

---

## File Structure

```
Capiro/
├── src/
│   ├── components/          # 12 shared UI components
│   │   ├── dashboard/       # 10 dashboard-specific components
│   │   ├── Navbar.jsx
│   │   ├── LoginModal.jsx   # Auth flow (sign-in/sign-up/confirm)
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── LandingSections.jsx
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx       # Cognito auth + session management
│   │   └── FirmDataContext.jsx   # DynamoDB data layer + auto-recovery
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── OnboardingPage.jsx    # LDA search + firm setup
│   │   ├── DashboardHome.jsx     # KPIs, deadlines, activity
│   │   ├── EntitiesPage.jsx      # Client management + detail panel
│   │   ├── SubmissionWizard.jsx  # 8-stage agentic workflow
│   │   ├── OfficesPage.jsx       # Congressional office database
│   │   └── ...
│   ├── services/
│   │   └── api.js                # Lambda + Bedrock API client
│   ├── config/
│   │   ├── cognito.js            # Auth config
│   │   ├── aws.js                # AWS service endpoints
│   │   ├── brand.js              # Design tokens
│   │   └── integrations.js       # External API config
│   ├── data/                     # Static data (plans, senator forms)
│   ├── hooks/                    # Custom hooks (useFirmData)
│   └── styles/                   # All CSS stylesheets
├── infra/
│   └── lda-proxy/
│       ├── index.mjs             # Lambda handler
│       └── deploy.sh             # Lambda deployment
├── amplify.yml                   # Amplify CI/CD config
├── deploy.sh                     # Amplify deployment script
└── CLAUDE.md                     # Claude context file
```

---

## Key Takeaways on Building with Claude Cowork

### What worked exceptionally well

**Full-stack coherence.** The single biggest advantage was maintaining architectural consistency across the React frontend, Lambda backend, DynamoDB schema, and API contracts — all in one conversational context. When I changed the data model, Claude updated the Lambda handler, the API client, and the React context in the same pass.

**Rapid iteration on complex integrations.** The Senate LDA API has undocumented quirks (rate limiting, inconsistent response formats, nested filing structures). Claude could reason about the API responses, extract the right data, and build the parsing logic much faster than I could have done manually.

**Bug triage speed.** Production bugs that would normally require tracing across multiple files (CORS issues spanning Lambda + Function URL config, auth race conditions across context providers) were diagnosed and fixed in single sessions because Claude could hold the full system in context.

### What required my judgment

**Product decisions.** Claude doesn't know what lobbying firms actually need. Every workflow decision — what data to show on the dashboard, what the submission wizard steps should be, how onboarding should work — came from my domain expertise.

**Architecture choices.** I chose DynamoDB single-table design over a relational model, Lambda over ECS, Amplify over manual CloudFormation. Claude executed on those choices well, but the tradeoff analysis was mine.

**Scope management.** Claude will build whatever you ask for. Knowing when to stop adding features and ship was entirely my call.

### The bottom line

Claude Cowork compressed what would have been 6-8 weeks of solo development into 10 days. Not by writing lower-quality code — the codebase is production-grade, with proper error handling, auth session management, and auto-recovery logic. But by eliminating the translation overhead between "what I want to build" and "the code that implements it" across every layer of the stack simultaneously.

The result is a deployed SaaS platform with real Senate API integration, AWS infrastructure, multi-tenant data isolation, and an agentic AI workflow — built by one person and one AI agent working together.
