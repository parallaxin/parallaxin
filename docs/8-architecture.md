# PARALLAXIN — Architecture Overview

**Version 1.0 — Technical documentation for contributors**

---

## TECHNOLOGY STACK

### Core Framework
- **Astro 5.18** — Modern static site generator with zero JavaScript by default
- **TypeScript** — Type safety and better developer experience
- **Vite** — Fast development server and build tool

### Content Management
- **Markdown** — Content authoring in Git with full audit trail
- **YAML Frontmatter** — Structured metadata validated by Zod schemas
- **Zod Schemas** — Runtime validation ensuring content integrity

### Styling & UI
- **TailwindCSS** — Utility-first CSS framework
- **IBM Plex Sans/Mono** — Typography system
- **CSS Custom Properties** — Dark theme and evidence color system

### Internationalization
- **Astro i18n** — Built-in internationalization support
- **Languages** — English (primary), Arabic, Farsi (planned)
- **RTL Support** — Right-to-left layout for Arabic content

### Deployment & CI/CD
- **GitHub Actions** — Automated testing and deployment
- **GitHub Pages** — Static hosting with custom domain support
- **Node.js** — Runtime environment

---

## PROJECT STRUCTURE

```
parallaxin/
├── src/
│   ├── components/          # Reusable Astro components
│   ├── layouts/            # Page layout templates
│   ├── pages/              # Route-based pages
│   │   ├── autopsies/      # Claim autopsy pages
│   │   ├── actors/         # Actor profile pages
│   │   └── conflicts/      # Conflict record pages
│   └── styles/             # Global CSS and Tailwind config
├── content/
│   ├── autopsies/          # Claim autopsy content
│   ├── actors/             # Actor profile content
│   └── conflicts/          # Conflict record content
├── src/content/config.ts   # Zod schema definitions
├── public/                 # Static assets
├── scripts/                # Build and utility scripts
└── docs/                   # Project documentation
```

---

## CONTENT SCHEMAS

### Claim Autopsy Schema
```yaml
---
id: ca-2026-0001
title: "Claim title in question form"
status: under-review # draft, under-review, published
date_published: 2026-03-01
claim:
  statement: "Exact claim being investigated"
  source: "Who made the claim"
  date: "When the claim was made"
evidence:
  - type: document
    source: "Source URL or reference"
    assessment: "supports|contradicts|neutral"
    notes: "Analysis of this evidence"
conclusion:
  finding: "Evidence-based conclusion"
  confidence: high|medium|low
---
```

### Actor Record Schema
```yaml
---
id: act-2026-0001
name: "Full name"
type: individual|organization|government
status: draft|published
period_active: "YYYY-MM to YYYY-MM"
key_positions: ["Position 1", "Position 2"]
notable_statements:
  - date: YYYY-MM-DD
    statement: "Exact quote or paraphrase"
    source: "Reference"
---
```

### Conflict Record Schema
```yaml
---
id: con-2025-0001
name: "Conflict name"
type: armed|political|economic
status: draft|published
period: "YYYY-MM to YYYY-MM"
parties:
  - actor_id: "act-2026-0001"
    role: "primary|secondary|supporter"
key_events:
  - date: YYYY-MM-DD
    event: "Factual description"
    sources: ["Source 1", "Source 2"]
---
```

---

## DEVELOPMENT WORKFLOW

### Local Development
```bash
# Clone the repository
git clone https://github.com/parallaxin/parallaxin.git
cd parallaxin

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:4321
```

### Content Creation
1. **Choose content type** (autopsy, actor, conflict)
2. **Copy appropriate template** from `/docs/templates/`
3. **Fill in frontmatter** following schema requirements
4. **Write content in Markdown** with proper evidence formatting
5. **Test locally** with `npm run dev`
6. **Submit Pull Request** for review

### Build & Deploy
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run content validation
npm run check-sources
```

---

## SCHEMA & CONSTITUTION ENFORCEMENT

### Automated Validation
The Zod schemas in `src/content/config.ts` enforce constitutional principles:

- **Article 2 (Evidence Tiers)**: Schema requires `evidence` array with mandatory `assessment` field
- **Article 3 (No Framing)**: `date_published` and `period` fields prevent selective timeframes
- **Article 4 (Dispute Resolution)**: `status` field tracks review workflow
- **Article 7 (Source Requirements)**: `source` fields mandatory for all claims

### Build-Time Errors
Invalid content will cause build failures with descriptive error messages:
- Missing required fields
- Invalid enum values
- Incorrect data types
- Malformed dates or URLs

### Content Quality Gates
- **Source checker script** validates all URLs
- **Archive verification** ensures evidence preservation
- **Automated testing** prevents schema violations

---

## CONTRIBUTION GUIDELINES

### Code Contributions
- Follow existing code style and patterns
- Add TypeScript types for new components
- Test responsive design and dark theme
- Update documentation for new features

### Content Contributions
- Use provided templates exactly
- Cite primary sources whenever possible
- Maintain neutral, evidence-based language
- Include archive URLs for web sources

### Review Process
1. **Automated checks** pass (CI/CD pipeline)
2. **Content schema validation** succeeds
3. **Manual review** for constitutional compliance
4. **Merge** after approval

---

## DEPLOYMENT ARCHITECTURE

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run check-sources
```

### Static Site Generation
- **Output**: Pure HTML/CSS/JS (no server required)
- **CDN Ready**: Optimized for global distribution
- **Secure**: No database or server-side processing

### Hosting Options
- **Primary**: GitHub Pages (free, integrated)
- **Alternative**: Cloudflare Pages (better performance)
- **Future**: IPFS/Arweave for permanent archival

---

## SECURITY CONSIDERATIONS

### Content Integrity
- **Git history** provides tamper-evident audit trail
- **Schema validation** prevents structural corruption
- **Source archiving** preserves evidence availability

### Contributor Safety
- **No user accounts** required (GitHub-based)
- **Anonymous contributions** possible via forks
- **Decentralized hosting** options for resilience

### Operational Security
- **Static sites** minimize attack surface
- **No user data** collection or storage
- **Open source** code for transparency

---

*This document serves as the technical foundation for contributors to understand and extend the Parallaxin platform while maintaining constitutional compliance.*
