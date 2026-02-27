# CampaignOS — Implementation Plan & Execution Strategy

## What You Have
- **Kimi2.5 LLM API Key** — replaces Claude/Anthropic as the AI engine (all AI generation, analysis, chat)
- **Supabase Key** — covers PostgreSQL database + Supabase Auth (replaces Clerk.dev) + Supabase Storage (replaces Cloudinary for MVP)

## What You Still Need

### REQUIRED (Must Have Before Starting)
| # | Item | Why | Free/Paid | Action |
|---|------|-----|-----------|--------|
| 1 | **Domain Name** | Deployment, auth callbacks, email verification links | ~$10/yr | Buy from Namecheap/Cloudflare |
| 2 | **Vercel Account** | Frontend hosting (free tier works for MVP) | Free | Sign up at vercel.com |
| 3 | **Email Service (Resend or SendGrid)** | Password reset emails, email verification, weekly digest | Free tier available | Sign up at resend.com (recommended) |
| 4 | **Stripe Account + API Keys** | Subscription billing (Free/Pro/Agency tiers) | Free to set up | Sign up at stripe.com |

### NICE TO HAVE (Phase 2+)
| # | Item | Why | Free/Paid |
|---|------|-----|-----------|
| 5 | **NewsAPI.org Key** | DM News Feed (Feature 10) article aggregation | Free tier: 100 req/day |
| 6 | **Google Trends API / SerpAPI Key** | Competitive Intelligence keyword trends | $50/mo for SerpAPI |
| 7 | **Cloudinary Account** | Creative asset storage & ZIP export (Phase 2) | Free tier: 25GB |
| 8 | **Redis (Upstash)** | Rate limiting & caching AI calls | Free tier available |

### DECISIONS I NEED FROM YOU
1. **Kimi2.5 API** — Does it support streaming responses (SSE)? This affects UX significantly.
2. **Kimi2.5 API** — What's the base URL and SDK/format? (OpenAI-compatible? Custom SDK?)
3. **Supabase** — Is this a free tier or paid plan? (Free = 500MB DB, 1GB storage, 50K auth users)
4. **Deployment** — Do you want Vercel (frontend) + Supabase Edge Functions (backend), or a separate Railway/Render backend?
5. **Stripe** — Do you want to implement payments in Phase 1, or launch as free-only first?
6. **Scope** — Should I build Phase 1 fully first, or a thin vertical slice of all features?

---

## Architecture (Adapted to Your Stack)

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                  │
│  TailwindCSS · React Router · Zustand · Recharts             │
│  Deployed on: Vercel                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS / SSE (streaming)
┌──────────────────────▼──────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                 │
│  Routes: /api/ai/* · /api/auth/* · /api/campaigns/*          │
│  Middleware: JWT verify · Rate limiting · Usage tracking      │
│  Deployed on: Railway / Render / Supabase Edge Functions      │
└───────┬─────────────────┬───────────────────┬───────────────┘
        │                 │                   │
   ┌────▼────┐      ┌────▼────┐        ┌────▼────┐
   │ Kimi2.5 │      │Supabase │        │Supabase │
   │ LLM API │      │Postgres │        │  Auth   │
   │(AI gen) │      │  (DB)   │        │(OAuth+  │
   └─────────┘      └─────────┘        │ JWT)    │
                                        └─────────┘
```

### Key Adaptation: Kimi2.5 Instead of Claude
- All system prompts remain the same (prompt engineering is model-agnostic)
- API call wrapper in `/server/services/llm.js` abstracts the LLM provider
- If Kimi2.5 is OpenAI-compatible, we use the OpenAI SDK format
- Streaming via SSE works the same way

### Key Adaptation: Supabase Instead of Clerk + PostgreSQL
- **Auth**: Supabase Auth handles email/password + Google OAuth + JWT natively
- **Database**: Supabase PostgreSQL with Prisma ORM on top
- **Storage**: Supabase Storage for creative assets (replaces Cloudinary in MVP)
- **Row-Level Security**: Supabase RLS ensures users only see their own data

---

## PHASE 1 — Core Platform (Weeks 1-6)

### Sprint 0: Foundation (Week 1)
| Task | Details | Est. Hours |
|------|---------|------------|
| Project scaffolding | Vite + React + TailwindCSS + React Router + Zustand | 4h |
| Design system setup | Colors (#0A2540, #00C896), fonts (Syne, DM Sans, DM Mono), dark theme, component primitives | 8h |
| Supabase project setup | Database schema, RLS policies, auth config | 4h |
| Backend scaffolding | Express server, Prisma ORM, Supabase client, middleware | 6h |
| Kimi2.5 integration | LLM service wrapper with streaming, error handling, retry logic | 6h |
| Auth system | Login, register, Google OAuth, JWT refresh, forgot password (via Supabase Auth) | 8h |
| Layout & navigation | Sidebar nav, responsive shell, user menu, usage meter | 6h |
| **Sprint 0 Total** | | **42h** |

### Sprint 1: Campaign Analyzer (Week 2)
| Task | Details | Est. Hours |
|------|---------|------------|
| Campaign type selector | Chip-based selection (Meta, Google, Email, TikTok, etc.) | 3h |
| Campaign input form | Rich text + structured metric inputs (Spend, CTR, CPC, etc.) | 6h |
| AI analysis engine | System prompt, streaming response, structured output parsing | 8h |
| Results UI | Health score ring gauge, collapsible cards, benchmark sparklines | 10h |
| Follow-up chat | Contextual thread below results, conversation memory | 4h |
| Save & export | Save to workspace, PDF export | 4h |
| **Sprint 1 Total** | | **35h** |

### Sprint 2: Campaign Planner (Week 3)
| Task | Details | Est. Hours |
|------|---------|------------|
| 3-step wizard UI | Stepper, progress bar, form validation | 6h |
| Step 1: Project brief form | Business info, goals, audience, budget inputs | 4h |
| Step 2: Channel preferences | Multi-select chips, AI recommendation toggle, experience level | 3h |
| Step 3: Strategy output | AI generation with streaming, structured sections | 8h |
| Output UI | Document panel, sidebar anchors, donut chart, Gantt timeline | 10h |
| Export & cross-feature link | PDF export, save, "Send to Analyzer" pre-fill | 4h |
| **Sprint 2 Total** | | **35h** |

### Sprint 3: AI Consultant Chat (Week 3-4)
| Task | Details | Est. Hours |
|------|---------|------------|
| Chat interface | Message bubbles, streaming display, auto-scroll | 6h |
| System prompt & persona | 15-year marketing expert persona with full context | 4h |
| Context injection | Auto-load campaign data from Analyzer/Planner via Zustand | 3h |
| Starter questions & chips | 8 curated questions, category filter chips | 3h |
| Pin answer & export | Save responses to notes library, clipboard/txt export | 4h |
| **Sprint 3 Total** | | **20h** |

### Sprint 4: Learning Hub (Week 4-5)
| Task | Details | Est. Hours |
|------|---------|------------|
| Curriculum data structure | 4 tracks, 16 topics, metadata (difficulty, time) | 4h |
| Hub home page | Track cards, progress bars, streak tracker | 6h |
| Topic page layout | 3-column responsive layout, sidebar nav | 8h |
| AI content generation | Experience-level-aware content with structured sections | 6h |
| Quiz system | AI-generated MCQs, scoring, progress tracking | 6h |
| Glossary system | Inline term highlighting, hover popups | 4h |
| Progress persistence | Mark complete, track per-user in Supabase | 3h |
| **Sprint 4 Total** | | **37h** |

### Sprint 5: Dashboard & Polish (Week 5-6)
| Task | Details | Est. Hours |
|------|---------|------------|
| Dashboard/home page | Onboarding checklist, recent activity, quick actions | 8h |
| User workspace | Saved campaigns list, experiments, personas | 6h |
| Usage tracking & limits | Free tier 15 calls/day counter, upgrade prompts | 4h |
| Error handling & edge cases | API failures, empty states, loading skeletons | 6h |
| Responsive design pass | Mobile/tablet layouts for all Phase 1 features | 8h |
| Testing & bug fixes | End-to-end testing, fix issues | 8h |
| **Sprint 5 Total** | | **40h** |

### Phase 1 Total: ~209 hours (~5-6 weeks full-time)

---

## PHASE 2 — Differentiation (Weeks 7-12)

| Sprint | Feature | Est. Hours |
|--------|---------|------------|
| Sprint 6 | Creative Studio MVP (copy, headlines, scoring, export) | 40h |
| Sprint 7 | Audience Builder & Persona Lab | 35h |
| Sprint 8 | Concept-to-Prompt Generator | 25h |
| Sprint 9 | Festival & Holiday Campaign Planner | 30h |
| Sprint 10 | DM News Feed + Prompt Library | 30h |
| Sprint 11 | Stripe payments integration (Pro/Agency tiers) | 20h |

### Phase 2 Total: ~180 hours (~4-5 weeks)

---

## PHASE 3 — Market Leadership (Weeks 13-20)

| Sprint | Feature | Est. Hours |
|--------|---------|------------|
| Sprint 12-13 | Budget Simulator & Forecasting Engine | 50h |
| Sprint 14-15 | Experimentation Engine (A/B testing) | 50h |
| Sprint 16 | Creative Studio DCO (Dynamic Creative Optimization) | 40h |
| Sprint 17-18 | Competitive Intelligence & Market Signals | 60h |
| Sprint 19-20 | Platform API integrations (Meta, Google, Mailchimp) | 50h |

### Phase 3 Total: ~250 hours (~6-7 weeks)

---

## Database Schema (Core Tables)

```sql
-- Users (managed by Supabase Auth, extended with profile)
profiles (
  id UUID PK → auth.users.id,
  full_name, avatar_url, plan (free/pro/agency),
  ai_calls_today INT, ai_calls_reset_at TIMESTAMP,
  onboarding_completed BOOLEAN,
  created_at, updated_at
)

-- Campaigns
campaigns (
  id UUID PK, user_id FK → profiles,
  name, type (analyzer/planner), platform,
  input_data JSONB, ai_output JSONB,
  health_score INT, status,
  created_at, updated_at
)

-- Brand Voices
brand_voices (
  id UUID PK, user_id FK,
  brand_name, description, tone TEXT[],
  target_audience, value_prop,
  always_use TEXT[], never_use TEXT[],
  reference_text,
  created_at
)

-- Chat Conversations
conversations (
  id UUID PK, user_id FK,
  title, context_type, context_id,
  messages JSONB[],
  pinned_answers JSONB[],
  created_at, updated_at
)

-- Learning Progress
learning_progress (
  id UUID PK, user_id FK,
  track_id, topic_id,
  completed BOOLEAN, quiz_score INT,
  experience_level,
  completed_at
)

-- Personas
personas (
  id UUID PK, user_id FK,
  name, archetype, industry,
  demographics JSONB, psychographics JSONB,
  platform_likelihood JSONB,
  audience_size JSONB, predicted_cac JSONB,
  creative_hook TEXT,
  created_at
)

-- Experiments (Phase 3)
experiments (
  id UUID PK, user_id FK, campaign_id FK,
  name, hypothesis, type, test_element,
  primary_metric, secondary_metrics TEXT[],
  confidence_level, min_detectable_effect,
  required_sample_size, status,
  variants JSONB, results JSONB,
  ai_verdict TEXT, ai_learnings TEXT,
  created_at, concluded_at
)

-- Creatives
creatives (
  id UUID PK, user_id FK, campaign_id FK,
  type, platform, objective,
  variants JSONB, brand_voice_id FK,
  created_at
)

-- Saved Notes (Pinned AI Answers)
saved_notes (
  id UUID PK, user_id FK,
  source_feature, content TEXT,
  tags TEXT[],
  created_at
)
```

---

## Execution Strategy: How I Will Build This

### Approach: Feature-by-Feature, Full Vertical Slices
I will build each feature end-to-end (UI → API → AI prompt → DB) before moving to the next. This means you get a working, testable feature after each sprint.

### Step-by-Step Execution Order:
1. **Scaffold entire project** — folder structure, configs, dependencies, design tokens
2. **Supabase setup** — schema migration, auth config, RLS policies
3. **Backend API** — Express server, Kimi2.5 wrapper, auth middleware, streaming SSE
4. **Auth flow** — Login/Register/OAuth/Reset password (fully working)
5. **App shell** — Sidebar, routing, dark theme, responsive layout
6. **Feature 1: Campaign Analyzer** — full build with AI streaming
7. **Feature 2: Campaign Planner** — wizard + AI output + cross-feature context
8. **Feature 3: AI Consultant Chat** — with context injection
9. **Feature 4: Learning Hub** — curriculum + AI content + quizzes
10. **Dashboard & workspace** — home page, saved items, usage limits
11. **Phase 2 features** — one by one in priority order
12. **Payments** — Stripe integration for Pro/Agency tiers

### What I Will Do in Each Feature Build:
- Write the system prompt (optimized for Kimi2.5)
- Build the backend API route with auth + rate limiting
- Build the React page with all UI components
- Wire up streaming AI responses
- Add save/export functionality
- Test the complete flow

---

## GRAND TOTAL ESTIMATE

| Phase | Features | Hours | Timeline |
|-------|----------|-------|----------|
| Phase 1 | Auth, Analyzer, Planner, Chat, Learning Hub, Dashboard | ~209h | Weeks 1-6 |
| Phase 2 | Creative Studio, Audience, Prompts, Festival, News, Payments | ~180h | Weeks 7-12 |
| Phase 3 | Forecasting, Experiments, DCO, Competitive Intel, API Integrations | ~250h | Weeks 13-20 |
| **TOTAL** | **13 features + infrastructure** | **~639h** | **~20 weeks** |

---

## File/Folder Structure (What Gets Built)

```
CampaignOS/
├── client/                          # React + Vite Frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css                # Tailwind + custom design tokens
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Analyzer.jsx         # Feature 01
│       │   ├── Planner.jsx          # Feature 02
│       │   ├── Consultant.jsx       # Feature 03
│       │   ├── LearningHub.jsx      # Feature 04
│       │   ├── LearningTopic.jsx    # Feature 04 - topic detail
│       │   ├── CreativeStudio.jsx   # Feature 05
│       │   ├── AudienceBuilder.jsx  # Feature 06
│       │   ├── Forecasting.jsx      # Feature 07
│       │   ├── Experiments.jsx      # Feature 08
│       │   ├── Competitive.jsx      # Feature 09
│       │   ├── NewsFeed.jsx         # Feature 10
│       │   ├── PromptLibrary.jsx    # Feature 11
│       │   ├── PromptGenerator.jsx  # Feature 12
│       │   └── FestivalPlanner.jsx  # Feature 13
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx
│       │   │   ├── AppShell.jsx
│       │   │   └── UserMenu.jsx
│       │   ├── ui/
│       │   │   ├── Button.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── ChipSelector.jsx
│       │   │   ├── Stepper.jsx
│       │   │   ├── Modal.jsx
│       │   │   └── Spinner.jsx
│       │   ├── ai/
│       │   │   ├── AIBlock.jsx      # Streaming AI response renderer
│       │   │   ├── ChatBubble.jsx
│       │   │   ├── HealthRing.jsx   # Animated score gauge
│       │   │   └── MetricCard.jsx
│       │   └── charts/
│       │       ├── DonutChart.jsx
│       │       ├── SparkLine.jsx
│       │       └── TimelineChart.jsx
│       ├── hooks/
│       │   ├── useAI.js             # AI call hook with streaming
│       │   ├── useAuth.js           # Supabase auth hook
│       │   ├── useSavedData.js      # CRUD for saved items
│       │   └── useWorkspace.js      # Workspace context
│       ├── lib/
│       │   ├── api.js               # Fetch wrappers
│       │   ├── prompts.js           # ALL system prompts
│       │   ├── constants.js         # Benchmarks, categories
│       │   ├── supabase.js          # Supabase client init
│       │   └── utils.js             # Helpers
│       └── store/
│           └── store.js             # Zustand global store
│
├── server/                          # Node.js + Express Backend
│   ├── package.json
│   ├── index.js                     # Express app entry
│   ├── routes/
│   │   ├── ai.js                    # /api/ai/* — all AI endpoints
│   │   ├── auth.js                  # /api/auth/* — auth helpers
│   │   ├── campaigns.js             # /api/campaigns/*
│   │   ├── experiments.js           # /api/experiments/*
│   │   └── workspace.js             # /api/workspace/*
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification via Supabase
│   │   └── rateLimit.js             # Per-user AI call quota
│   ├── services/
│   │   ├── llm.js                   # Kimi2.5 API wrapper (streaming)
│   │   ├── db.js                    # Prisma client
│   │   └── email.js                 # Email service (Resend)
│   └── prisma/
│       └── schema.prisma            # Database schema
│
├── .env                             # Environment variables
├── .gitignore
└── README.md
```
