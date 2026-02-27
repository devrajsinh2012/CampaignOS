**PRODUCT BRIEF & FEATURE SPECIFICATION**

**CampaignOS**

*AI-Powered Digital Marketing Command Centre*

| Document Type: |   Product Brief v1.0 |
| ----: | :---- |
| **Status:** |   Draft — For Development Handoff |
| **Audience:** |   AI Coding Agents & Developers |
| **Date:** |   February 2026 |

**CONFIDENTIAL**

# **1\. Executive Summary**

CampaignOS is an AI-powered digital marketing command centre designed to eliminate the fragmentation that plagues modern marketing teams. Today, a typical marketer uses 6–12 different tools to plan, execute, analyze, and learn from campaigns — and still lacks real-time intelligence to make great decisions.

CampaignOS brings the entire workflow into one platform, powered by Claude AI at every layer: analyze what is broken in live campaigns, plan new ones backed by market intelligence, generate high-performing creatives, build precise audiences, forecast outcomes, run experiments, and track competitive moves — all without leaving the tool.

| PRODUCT VISION The world's smartest digital marketing co-pilot — from brief to campaign to results, all in one place. |
| :---- |

## **Target Users**

| USER TYPE | DESCRIPTION |
| :---- | :---- |
| **Solo Marketers** | Freelancers or in-house marketers managing everything alone — need speed and expertise on demand |
| **Small Agencies** | 5–25 person shops running 10–50 client campaigns — need structure, consistency, and AI leverage |
| **Growth Marketers** | Startup PMs and growth leads who understand metrics but need creative and strategic assistance |
| **Marketing Students** | Learners building skills — need guided education plus hands-on tools with real output |

## **Core Problems Being Solved**

* Tool fragmentation: briefs in Notion, data in sheets, creative in Canva, ads in dashboards — nothing talks to each other

* Strategy gap: most marketers can run ads but struggle with systematic planning, forecasting, and experimentation

* Creative bottleneck: generating enough variant creatives for testing is slow and expensive

* Knowledge gap: junior marketers lack mentorship and make expensive, avoidable mistakes

* Blind spots: competitive intelligence is reactive and manual; marketers miss opportunities and threats

# **2\. Platform Architecture & Technical Overview**

CampaignOS is built as a React SPA with a Node.js/Express backend API layer. The AI engine is Claude (Anthropic) accessed via server-side API calls — the API key is never exposed to the browser. This architecture supports authentication, usage quotas, and multi-user workspaces.

## **Authentication & User System**

| WHY AUTH IS REQUIRED Without authentication there is no way to persist user campaigns, experiments, personas, or learning progress across sessions. Auth is a Day 1 requirement, not a future addition. |
| :---- |

### **Login & Registration**

* Email \+ password with email verification

* Google OAuth (one-click) as primary onboarding path — reduces friction significantly

* JWT-based session management with 7-day refresh tokens

* Forgot password / reset via email link; optional magic link (passwordless)

### **User Workspace & Plans**

* Each user gets a personal workspace with saved campaigns, experiments, personas, and learning progress

* Free tier: 15 AI calls/day. Pro ($19/mo): unlimited. Agency ($79/mo): multi-client workspaces \+ team seats

* Usage meter visible in dashboard for free-tier users

* Onboarding checklist on first login: Analyze your first campaign → Build a persona → Run an experiment

## **Recommended Tech Stack**

| LAYER | RECOMMENDED STACK |
| :---- | :---- |
| **Frontend** | React \+ Vite, TailwindCSS, React Router, Zustand (state), Recharts (charts) |
| **Backend** | Node.js \+ Express, Prisma ORM, PostgreSQL (Supabase or Railway) |
| **Auth** | Clerk.dev or Auth.js — managed auth for fastest implementation |
| **AI Engine** | Anthropic Claude API — server-side ONLY, never client-side |
| **File Storage** | Cloudinary for creative assets and export ZIPs |
| **Deployment** | Vercel (frontend) \+ Railway (backend \+ DB) |

# **3\. Feature Specifications**

Each feature below includes: purpose, user flow, AI output design, UI requirements, and MVP scope. Features are ordered by release priority.

## **Feature 01 — Campaign Analyzer**

| ONE-LINE PURPOSE Paste your running campaign details and get an expert AI breakdown of exactly what is broken, what is working, and the 5 most impactful changes to make right now. |
| :---- |

### **Problem Solved**

Most marketers are overwhelmed by their dashboard — numbers are there but insight is absent. Is 1.8% CTR good or bad for this industry? Is $4.20 CPC acceptable? CampaignOS acts as a senior marketing consultant reviewing their live campaign with full context.

### **User Flow**

1. Select campaign type from chips: Meta Ads, Google PPC, Email, TikTok, LinkedIn, SEO, Influencer, Display, etc.

2. Describe the campaign in rich text: product, audience, creatives, platform, objective, targeting, duration

3. Optionally enter structured metrics: Spend ($), Impressions, Clicks, CTR (%), CPC ($), Conversions, CPA ($), ROAS, Revenue

4. Click 'Analyze Campaign' — AI response streams in with structured breakdown

5. Ask follow-up questions in a contextual thread below (campaign context auto-preserved)

6. Save analysis to workspace history and export as PDF

### **AI Output Sections**

* Campaign Health Score — 0–100 with color indicator (red/yellow/green) and one-line verdict

* Benchmark Comparison — how their metrics compare to industry averages for their campaign type

* Critical Issues — what needs immediate attention, ranked by impact

* What's Working — genuine positives to scale or protect

* 5 Optimization Actions — specific, ranked, actionable with estimated impact per action

* This Week's Priority — the single most impactful change to make in 7 days

* Red Flags — warning signs that will worsen if unaddressed

### **UI Requirements**

* Health score as large animated ring gauge in top-right of results panel

* Each section as a collapsible card with color-coded left border (red=issues, green=wins, blue=actions)

* Metric comparison shown as sparkline vs. benchmark

* Follow-up chat input pinned below the AI response

* 'Share Analysis' generates a read-only link; 'Export PDF' downloads a formatted report

## **Feature 02 — Campaign Planner**

| ONE-LINE PURPOSE Starting fresh? Enter your project, budget, goal, and channels — get a complete professional marketing strategy with market research, budget allocation, and a week-by-week execution plan. |
| :---- |

### **User Flow — 3-Step Wizard**

### **Step 1: Project Brief**

7. Business name, Industry (text with smart suggestions)

8. Product/service description — what are you selling and to whom? (min 50 chars)

9. Primary Campaign Goal: Sales, Lead Gen, Brand Awareness, Follower Growth, Traffic, App Downloads, Events

10. Target audience description, Total Budget ($), Duration, Geography

### **Step 2: Channel Preferences**

11. Multi-select chips: Social Ads, Google PPC, Email, SEO, Influencer, Video, Display, Push, Affiliate, Content

12. Toggle: 'Let AI recommend channels' — overrides manual selection based on goal and budget

13. Experience level: Beginner / Intermediate / Advanced — adjusts output complexity

### **Step 3: Strategy Output**

* Market Research Summary — audience insights, demand signals, key competitors for their industry

* Recommended Strategy — why this channel mix fits their specific goal and budget level

* Budget Allocation Table — percentage split across channels with weekly spend amounts

* Week-by-Week Execution Timeline — what to do each week (creative, launch, optimize, scale decisions)

* KPI Framework — which metrics to track, benchmarks to aim for, success/failure criteria

* Quick Wins — 3 things to implement in the first 48 hours

* Risk & Pivot Signals — specific signs that mean 'pause and reassess'

### **UI Requirements**

* Stepper with progress bar; back/next navigation between steps

* Output renders as a document-style panel with sidebar section anchors

* Budget Allocation as interactive donut chart (Recharts)

* Timeline as Gantt-style week-row view

* Export as PDF; Save to Workspace; 'Send to Analyzer' pre-fills Analyzer once campaign is live

## **Feature 03 — AI Marketing Consultant Chat**

| ONE-LINE PURPOSE A specialized AI with 15 years of digital marketing experience — the equivalent of a senior marketing head — available 24/7 for any question with full conversation memory. |
| :---- |

### **Persona Design (System Prompt)**

The AI persona is precisely defined: 15 years experience across DTC eCommerce, B2B SaaS, and local businesses. Former Head of Growth at a mid-size agency. Expert in paid media, CRO, email, and content strategy. Direct, opinionated, and data-informed. Never gives vague answers. When uncertain, provides a framework instead of a guess.

### **Key Features**

* Full conversation history maintained within session — all messages sent as context on each call

* Campaign context injection — if user came from Analyzer or Planner, that data is pre-loaded so AI already knows their situation

* 8 curated Suggested Starter Questions shown on empty state, organized by category chips

* Question category chips: Paid Ads, Email, SEO, Analytics, Strategy, Creatives, Budgeting

* 'Pin Answer' — saves specific AI responses to a personal notes library

* Conversation export: copy all to clipboard or download as .txt

### **Suggested Starter Questions**

* "My CTR is 1.2% on Facebook — is that good and how do I improve it?"

* "What's the right budget split between prospecting and retargeting?"

* "How do I write a Meta ad headline that actually stops the scroll?"

* "When should I scale a campaign vs. kill it?"

* "How do I build a proper email welcome sequence for a new subscriber?"

* "What KPIs should I report to a client each week?"

* "I have $500/month — what's the best way to start advertising?"

* "How do I calculate the right A/B test sample size?"

## **Feature 04 — Learning Hub (Redesigned)**

| ONE-LINE PURPOSE A structured digital marketing curriculum where every lesson is AI-generated on demand, adapted to the learner's experience level, with quizzes, a glossary, and a personal progress tracker. |
| :---- |

### **Why the Current Version Is Insufficient**

The current Learning Hub is 12 clickable cards that fetch one AI paragraph. That is not a learning experience — it is a glorified search engine. The redesigned Hub is a proper curriculum with structure, progression, quizzes, and retention mechanics.

### **Curriculum — 4 Learning Tracks**

* Track 1 — Foundations: What is Digital Marketing, The Marketing Funnel, KPIs & Metrics 101, Setting Campaign Objectives

* Track 2 — Channels Deep Dive: Social Media Ads (Meta/TikTok/LinkedIn), Google Ads & PPC, Email Marketing, SEO & Content

* Track 3 — Advanced Strategy: Audience Targeting & Segmentation, A/B Testing & Experimentation, CRO & Landing Pages, Attribution Models

* Track 4 — Analytics & Growth: Reading Your Dashboards, Budget Optimization, Scaling Campaigns, Reporting to Stakeholders

### **Topic Page Design (Each Topic is a Full Page)**

* Hero banner: topic name, estimated read time, difficulty badge (Beginner/Intermediate/Advanced)

* Experience Level Selector at top — changes depth and vocabulary of AI content in real time

* Structured AI content sections: What It Is → Why It Matters → Core Concepts → Real Example → Common Mistakes → Cheat Sheet

* Inline Glossary: technical terms are highlighted; hover reveals definition popup

* Knowledge Check: 3–5 AI-generated multiple-choice questions at end of each topic

* 'Mark as Complete' checkbox — tracks progress in curriculum sidebar

* 'Go Deeper' button — opens AI Consultant with topic pre-loaded as context

### **UI Layout**

* Left sidebar: full curriculum tree with completion checkmarks and per-track progress bars

* Main panel: topic content with clean reading typography and generous whitespace

* Right sidebar (desktop): 'On This Page' anchor links, time remaining, quick glossary

* Hub home: percentage complete per track, learning streak tracker, last studied topic

* Fully responsive: sidebars collapse to accordions on mobile

## **Feature 05 — Creative Studio & Dynamic Creative Engine**

| ONE-LINE PURPOSE Generate complete creative packages — ad copy, headlines, CTAs, video scripts, image prompts — in your brand voice, scored by predicted performance, exported in platform-ready formats. |
| :---- |

### **Problem Solved**

Creative production is the biggest bottleneck in paid media. Writing 10 headline variants, 5 descriptions, 3 CTAs, and an image brief for one campaign takes hours. Multiplied across 5 campaigns that becomes a week of work. CampaignOS generates all of it in minutes with platform-specific formatting and performance scoring.

### **Brand Voice Profile (Saved to Workspace)**

* Brand name and one-line description

* Tone of Voice — select up to 3: Professional, Playful, Bold, Empathetic, Luxurious, Urgent, Conversational, Authoritative

* Target audience description, key value proposition (max 2 sentences)

* Words/phrases to always use and words to never use

* Example of excellent creative they love (optional reference text)

### **Creative Generation Flow**

14. Select Creative Type: Ad Copy, Email Subject Lines, Video Script, Image Brief, Push Notification

15. Select Target Platform(s): Meta, Google Responsive Search, TikTok Vertical, LinkedIn, YouTube, Display

16. Enter Campaign Objective and Key Message to communicate

17. Set Number of Variants: 3, 5, or 10

18. AI generates all variants with character count validation per platform specification

### **Output — Creative Package**

* Variants displayed in platform-preview cards (shows how ad looks in Meta or Google interface)

* Predicted Performance Score (0–100) per variant based on clarity, emotional hook, CTA strength, benefit-focus

* Variants ranked by score; top variant highlighted with 'Recommended' badge

* One-click regenerate per variant; inline editing with live character counter

* Export: copy to clipboard, CSV (all variants), JSON (for ad platform API import), Google Ads import sheet

### **Dynamic Creative Optimization — Pro/Agency Feature**

DCO automatically assembles combinations of headlines \+ descriptions \+ CTAs and exports a full test matrix: 3 headlines × 3 descriptions × 2 CTAs \= 18 combinations. Exports as Google Performance Max asset group, Meta Dynamic Creative, or CSV test matrix. Integrates with Experimentation Engine to send top combinations directly to A/B test setup.

## **Feature 06 — Audience Builder & Persona Lab**

| ONE-LINE PURPOSE Build precise, testable audience segments from simple inputs — with size estimates, predicted CAC, and suggested creative hooks per segment — ready to export to any ad platform. |
| :---- |

### **Persona Generator Flow**

19. Input: Industry, product/service, top 3 customer attributes, average order value, purchase frequency

20. Optional: paste 5–10 example customer descriptions for richer AI persona matching

21. AI generates 5 distinct audience personas, each containing:

    * Persona name and archetype label (e.g. 'The Deal Seeker', 'The Aspirational Professional')

    * Demographics snapshot (age range, income bracket, location types)

    * Psychographics: values, motivations, pain points, media habits

    * Platform Likelihood: ranked list of where this persona spends time

    * Estimated Audience Size in broad / mid / narrow targeting tiers

    * Predicted CAC range based on benchmarks for this industry \+ channel

    * Suggested Creative Hook — the messaging angle that resonates most with this persona

    * Interest cluster suggestions for Meta/TikTok targeting setup

    * Exclusion Rules — who NOT to target to protect segment purity

### **Audience Recipes — Quick Segment Builder**

* Broad Prospecting — wide reach for awareness, interest-based cold targeting

* Mid-Funnel Engaged — website visitors, video viewers, post engagers in last 30 days

* Narrow Retargeting — cart abandoners, high-intent page visitors, past purchasers

### **Export Options**

* Ad Platform Audience Brief: formatted doc for Meta Ads Manager, Google, or LinkedIn Campaign Manager

* First-Party Hashed List: CSV template with email fields for customer list upload

* Lookalike Seed Strategy: seed audience description for lookalike expansion setup

## **Feature 07 — Forecasting & Budget Simulator**

| ONE-LINE PURPOSE Run 'what-if' budget scenarios before spending a dollar — see projected reach, conversions, CPA, and ROAS under Conservative, Moderate, and Aggressive assumptions. |
| :---- |

### **Input Options**

* Historical Mode: enter past campaign metrics (CPC, CTR, conversion rate) — model uses actuals

* Benchmark Mode: select industry \+ campaign type — model uses industry average benchmarks

* Hybrid: mix actuals for known metrics and benchmarks for unknowns

### **Three Scenarios Generated Simultaneously**

| SCENARIO | DESCRIPTION |
| :---- | :---- |
| **Conservative** | CTR at P25 percentile, CPC 20% above median, conversion rate 15% below expected |
| **Moderate** | Median benchmarks for the channel and industry, standard conversion rate |
| **Aggressive** | CTR at P75 percentile, optimized CPC, conversion rate 20% above median |

### **Output Visualizations**

* Side-by-side scenario comparison table with color-coded performance cells

* Spend-to-results curve showing diminishing returns beyond a budget threshold

* Week-by-week projected spend and cumulative conversions chart (line chart with confidence interval bands)

* Sensitivity Analysis: shows how results change if CPC increases 20% or conversion rate drops 15%

## **Feature 08 — Experimentation Engine (A/B & Multivariate Manager)**

| ONE-LINE PURPOSE Design experiments properly, auto-calculate sample sizes, track results, and receive AI-generated recommended actions when tests conclude — making systematic learning the default, not the exception. |
| :---- |

### **Experiment Design Wizard**

22. Experiment name and structured Hypothesis: 'We believe \[change\] will \[increase/decrease\] \[metric\] for \[audience\] because \[reason\]'

23. Experiment Type: A/B (2 variants), A/B/C (3 variants), Multivariate

24. What is being tested: Creative, Audience, Landing Page, Offer, Copy, Subject Line, CTA, Bid Strategy

25. Primary optimization metric; Secondary observation metrics

26. Confidence Level target (80%, 90%, 95% — default 95%) and Minimum Detectable Effect

27. AI auto-calculates required sample size and recommended runtime from all inputs

### **Results Dashboard**

* Manual metric entry (or future: API sync with ad platforms)

* Live statistical significance calculation as data is entered

* Bayesian probability display: 'Variant B has 87% probability of outperforming Control'

* Auto-generated verdict at runtime end: Full Rollout / Continue Test / Stop & Iterate

* AI-generated Learning Summary: what was learned and what to test next

### **Experiment Catalog & Learnings Library**

* All experiments saved with status (Running, Concluded, Archived) and outcome

* Learnings extracted per experiment and saved to a searchable knowledge base

* Pattern detection: AI surfaces recurring insights across multiple experiments

## **Feature 09 — Competitive Intelligence & Market Signals**

| ONE-LINE PURPOSE Know what competitors are running, what audiences are trending, and where the gaps are — so your strategy is always a step ahead. |
| :---- |

### **MVP Features**

* Competitor Tracker: input competitor URLs — system monitors Meta Ad Library and Google Ads Transparency Center for their live ads

* Ad Creative Gallery: competitor ad creatives with estimated run duration, format, and messaging themes — updated weekly

* Keyword Trend Dashboard: Google Trends integration showing search volume trajectory for key industry terms

* Share of Voice Estimate: relative ad volume vs. competitors — approximates market visibility

### **Phase 2 Advanced Features**

* Brand Sentiment Monitor: social listening across X, Reddit, and reviews for brand and competitor mentions

* Counterplay Alerts: 'Competitor has paused promotions — window to increase spend detected'

* Gap Analysis: keywords and audiences competitors are not targeting — low-competition opportunities

* Landing Page Intelligence: track competitor landing page changes over time

## **Feature 10 — Digital Marketing News & Trend Feed**

| ONE-LINE PURPOSE A curated, AI-summarized daily feed of the most important digital marketing news, platform updates, and industry trends — so users never miss what matters. |
| :---- |

* 8–12 articles daily from: Marketing Week, Search Engine Journal, AdAge, Social Media Examiner, platform official blogs

* Each article: AI-generated 2-sentence 'What happened' summary \+ 1-sentence 'Why it matters for your campaigns'

* Category filter chips: Platform Updates, Paid Media, SEO/Content, Email, AI & Martech, Strategy

* 'Breaking' badge for algorithm or policy changes affecting ad delivery — high-priority visibility

* Bookmark to personal reading list; Weekly Digest email every Monday morning

* Source: NewsAPI.org or Feedly RSS for aggregation, Claude for summarization

## **Feature 11 — AI Prompt Library (Photo & Video)**

| ONE-LINE PURPOSE A searchable, categorized, trending collection of proven prompts for AI image and video tools — filtered by style, platform, and use case, updated weekly with what's working now. |
| :---- |

* Categories: Product Photography, Lifestyle & UGC, Ad Backgrounds, Logo Mockups, Social Graphics, Video B-Roll, Thumbnails

* Platform tags: Midjourney, DALL-E 3, Adobe Firefly, Runway, Sora, Kling, Pika

* Style tags: Minimalist, Luxurious, Playful, Corporate, Cinematic, Lo-Fi, Editorial

* 'Trending this week' section — prompts with highest copy rate in last 7 days

* Each card: prompt text, example output image (if available), tool compatibility, difficulty, copy button

* Community submissions (Phase 2): users can submit prompts; top-voted are featured

## **Feature 12 — Concept-to-Prompt Generator**

| ONE-LINE PURPOSE Describe your creative concept in plain language — get a fully optimized AI image prompt, a video generation prompt, and a structured JSON prompt for any major AI creative tool. |
| :---- |

### **Input Fields**

* Creative Concept (plain English): e.g. 'A woman using a sleek skincare product in a bright bathroom at golden hour'

* Brand Context (optional): tone, colors, style reference pulled from Brand Voice Profile

* Target Tool: Midjourney / DALL-E 3 / Adobe Firefly / Runway / Sora / Kling (changes prompt syntax)

* Output Format: Still Image / Short Loop (3–5s) / Short Video (15–30s)

* Intended Ad Placement: Meta Feed, TikTok, YouTube, LinkedIn, Display (affects aspect ratio guidance)

### **Output Package**

* Optimized Text Prompt — subject, style, lighting, composition, technical params (aspect ratio, quality flags) formatted for the chosen tool's specific syntax

* Negative Prompt — what to avoid: blurry faces, unrealistic hands, text artifacts, etc.

* JSON Prompt — machine-readable format for API calls to Midjourney, DALL-E, Runway, Replicate

* 3 Prompt Variants — different stylistic angles of the same concept (cinematic, editorial, lifestyle)

* Technical Specs — recommended resolution, aspect ratio, and seed strategy for the target platform

* Director's Notes (Video only) — camera movement suggestions: slow zoom, handheld, parallax, etc.

### **'Refine This Prompt' Chat**

A small chat input below the output lets users iterate: 'Make it feel more luxury', 'Change the setting to outdoors at dusk', 'Add motion blur to the background'. Each instruction updates the prompt without losing the base concept.

## **Feature 13 — Festival & Holiday Campaign Planner**

| ONE-LINE PURPOSE Never miss a marketing moment. Get a 12-month campaign calendar, AI-generated creative concepts, and post ideas for every festival and holiday relevant to your brand and geography. |
| :---- |

### **12-Month Calendar View**

* Visual calendar showing all major global and regional holidays/festivals by month

* User selects target geographies (India, US, UK, Middle East, Southeast Asia, Global) — calendar filters accordingly

* User selects industry — calendar adds sector-specific moments (Back to School, Tax Season, etc.)

* Each event: date, lead time recommendation, opportunity score for this industry

* Color coding: Tier 1 (major, high-spend) / Tier 2 (medium) / Tier 3 (social post only)

### **Concept Builder — Per Event**

28. Event overview: cultural context, typical consumer behavior and spending patterns

29. Campaign Angle Generator: 5 creative angles — emotional, humorous, offer-led, storytelling, educational — adapted to brand

30. Post Concept Generator: 3 social media post concepts per angle (image direction \+ caption)

31. Offer Ideas: suggested promotions, bundles, and limited-time offers for this occasion

32. Messaging Do's and Don'ts: cultural sensitivity guidance and brand-safe communication tips

33. Countdown Reminder: push notification 3 weeks, 1 week, and 48 hours before event

34. 'Build Full Campaign' — pre-fills Campaign Planner with this event's details in one click

### **Export Options**

* Content calendar as CSV (Google Sheets compatible)

* Monthly brief PDF for client or team approval

# **4\. Feature Priority & Release Matrix**

All features mapped to three release phases. Phase 1 establishes the core value loop. Phase 2 adds differentiation. Phase 3 achieves market leadership.

| Feature | Priority | Phase | Complexity | Core Value |
| :---- | :---- | :---- | :---- | :---- |
| Auth & User Workspace | **P0 — Critical** | Phase 1 | Medium | Required for persistence and monetization — build first |
| Campaign Analyzer | **P0 — Critical** | Phase 1 | Medium | Immediate value — works with any existing campaign |
| Campaign Planner | **P0 — Critical** | Phase 1 | Medium | Core use case for all new campaigns |
| AI Consultant Chat | **P0 — Critical** | Phase 1 | Low | Always-on expertise — primary retention driver |
| Learning Hub (Full) | **P1 — High** | Phase 1 | Medium | Attracts students; builds long-term stickiness |
| Creative Studio (MVP) | **P1 — High** | Phase 2 | High | Highest-demand pain point; strong willingness to pay |
| Audience Builder | **P1 — High** | Phase 2 | High | Multiplies ROI of every campaign |
| Concept-to-Prompt Gen | **P1 — High** | Phase 2 | Medium | Unique feature with high shareability |
| Festival Planner | **P1 — High** | Phase 2 | Medium | High value especially in India/APAC markets |
| DM News Feed | **P2 — Medium** | Phase 2 | Low | Daily habit formation and engagement driver |
| Prompt Library | **P2 — Medium** | Phase 2 | Low | Community feature — grows organically over time |
| Budget Simulator | **P2 — Medium** | Phase 3 | High | Critical for agency tier; complex to do well |
| Experimentation Engine | **P2 — Medium** | Phase 3 | High | High value for mature users; complex UX |
| Creative Studio (DCO) | **P2 — Medium** | Phase 3 | Very High | Agency differentiator — Phase 3 priority |
| Competitive Intelligence | **P2 — Medium** | Phase 3 | Very High | API dependencies; significant data infrastructure costs |

# **5\. UX Principles & Design System**

## **Core UX Principles**

* Zero to Value in 60 Seconds — every feature must deliver something useful within 60 seconds of first use. No lengthy onboarding. No configuration before output.

* Show, Don't Just Tell — every AI recommendation should explain the 'why'. Users should feel smarter after using CampaignOS, not just informed.

* Progressive Disclosure — show simple inputs first; reveal advanced options behind an 'Advanced' toggle. Never overwhelm first-time users.

* Always a Next Action — every AI output ends with a clear next step. The platform should feel like a guide, not a dead end.

* Persistent Context — a campaign built in Planner follows the user to Analyzer, Creative Studio, and Experimentation Engine automatically.

## **Design System**

| ELEMENT | SPECIFICATION |
| :---- | :---- |
| **Color — Primary** | Deep Navy \#0A2540 — authority, trust, professionalism |
| **Color — Accent** | Teal Green \#00C896 — growth, data, performance (CTAs, wins, health indicators) |
| **Color — Warning** | Amber \#F59E0B — caution states, moderate results, pending actions |
| **Color — Error** | Red \#EF4444 — critical issues, failing metrics, urgent alerts |
| **Font — Display** | Syne 700/800 — distinctive, modern, authoritative for headings |
| **Font — Body** | DM Sans — clean, highly readable at small sizes |
| **Font — Data/Mono** | DM Mono — metrics, code, technical values, labels |
| **Theme** | Dark mode primary (navy/slate background); light mode available in Phase 2 |
| **Border Radius** | 16px cards, 10px inputs/buttons, 100px chips and badges |
| **Shadow Strategy** | Subtle outer shadow for elevation; accent-color glow for active/selected states |

# **6\. Implementation Instructions for AI Coding Agents**

| IMPORTANT This section is written specifically for AI coding agents (Claude Code, Cursor, Copilot Workspace). Read entirely before writing any code. |
| :---- |

## **Repository Structure**

* /client — React \+ Vite frontend

* /client/src/pages — one file per feature page (Analyzer.jsx, Planner.jsx, Consultant.jsx, etc.)

* /client/src/components — shared UI (AIBlock, Spinner, MetricInput, ChipSelector, ProgressRing)

* /client/src/hooks — useAI.js, useAuth.js, useSavedData.js, useWorkspace.js

* /client/src/lib — api.js (fetch wrappers), prompts.js (ALL system prompts), constants.js (benchmarks, etc.)

* /server — Node.js \+ Express backend

* /server/routes — ai.js, auth.js, campaigns.js, experiments.js, workspace.js

* /server/middleware — auth.js (JWT verify), rateLimit.js (per-user AI call quota)

* /server/services — claude.js (Anthropic SDK wrapper with streaming), db.js (Prisma client)

## **Critical Rules for Claude API Calls**

* CRITICAL: ALL Claude API calls go through the backend server. NEVER call the Anthropic API directly from the browser. The API key will be exposed in browser DevTools.

* Every route at /api/ai/\* must verify the JWT Authorization header before calling Claude

* Per-user rate limiting: Free \= 15 AI calls/day; Pro \= unlimited. Use Redis or in-memory store

* Use streaming responses (stream: true in Anthropic SDK) for long outputs — Planner and Analyzer in particular. Stream tokens to client via Server-Sent Events

* Store conversation history in component state (Zustand), not database, for chat features. Free users: clear on page refresh. Pro users: persist to DB

## **Prompt Engineering Standards**

* ALL system prompts stored in /client/src/lib/prompts.js as named exports — never hardcoded inline in components

* Every prompt must specify: persona/role, output format (labeled sections), tone, constraints, and output length target

* Request structured output using labeled sections (\#\# Section Name) so the frontend can parse into separate UI cards

* For scored outputs (Creative Studio), instruct Claude to return JSON block within the response for reliable parsing

* Always include the user's campaign context (from Zustand) in relevant prompts — this is what makes the AI feel 'intelligent'

## **State Management Rules**

* Use Zustand for all global state: currentUser, currentCampaign (cross-feature context), savedWorkspace

* Campaign context — when user moves from Planner to Analyzer — store in Zustand and auto-inject into the new feature's AI prompt as context

* Do NOT use localStorage or sessionStorage — use Zustand for in-session state, PostgreSQL (Prisma) for persistence

* All loading states must show a streaming skeleton or typed-text animation — never leave the user looking at a blank panel

# **7\. API Strategy & Integrations**

## **Phase 1 — Core APIs**

| API / SERVICE | PURPOSE |
| :---- | :---- |
| **Anthropic Claude API** | All AI generation, analysis, consultation — server-side ONLY |
| **Clerk.dev or Auth.js** | User authentication, session management, Google OAuth |
| **PostgreSQL via Prisma** | User data, saved campaigns, experiments, personas, progress |
| **Cloudinary** | Creative asset storage and export ZIP generation |

## **Phase 2 — Extended**

| API / SERVICE | PURPOSE |
| :---- | :---- |
| **NewsAPI.org or Feedly** | DM News Feed article aggregation (Feature 10\) |
| **Google Trends API** | Keyword trend data for Competitive Intelligence (Feature 09\) |
| **Meta Ad Library API** | Competitor ad creative scraping (Feature 09\) |
| **Stripe** | Subscription payments — Free → Pro → Agency tier upgrades |

## **Phase 3 — Platform Export Integrations**

| INTEGRATION | FUNCTION |
| :---- | :---- |
| **Meta Ads Manager API** | Export audience definitions and dynamic creative sets |
| **Google Ads API** | Export responsive search ad assets and Performance Max groups |
| **Mailchimp / Klaviyo API** | Export email sequences and segmented audience lists |
| **Google Sheets / Notion** | Export campaign plans, experiment logs, content calendars |

# **8\. Success Metrics & KPIs**

## **Phase 1 Launch Targets (First 90 Days)**

| METRIC | TARGET |
| :---- | :---- |
| **User Registrations** | 500+ in first 30 days post-launch |
| **Campaign Analyses Run** | 1,000+ within 60 days — validates core use case adoption |
| **Day-7 Retention** | 40%+ — users who return within 7 days of first use |
| **Feature Discovery Rate** | 60%+ of users engage with 3+ features in first session |
| **AI Call Success Rate** | 99%+ reliability — non-negotiable for user trust |
| **Average Session Duration** | 8+ minutes — benchmark for engagement-class tools |

## **Qualitative Success Signals**

* Users describe the platform as 'my marketing brain' or 'like having a consultant on call'

* Users share AI outputs externally — to clients, on LinkedIn — organic social proof

* Learning Hub users return within 48 hours to continue their track

* Agency users onboard client campaigns into the platform (multi-project usage)

| NORTH STAR METRIC Number of campaigns actively optimized per week — capturing both acquisition (new campaigns started) and retention (returning to analyze, iterate, and improve). Everything in the product should drive this number. |
| :---- |

# **9\. Open Questions & Decisions Required**

| OPEN QUESTION | CONTEXT & OPTIONS |
| :---- | :---- |
| **Free tier AI call limit** | 15/day suggested. Too low \= acquisition friction; too high \= unprofitable. Validate with unit economics before launch. |
| **Benchmark data source** | Industry-average CTR/CPC/CVR needed for Analyzer \+ Simulator. Phase 1: hardcoded curated table. Phase 2: SpyFu or Semrush API. |
| **Image generation scope** | Generate actual images (requires Midjourney/DALL-E API costs) or only prompts? Recommend: prompts only in Phase 1\. Image gen in Phase 2\. |
| **Competitive intelligence cost** | Meta Ad Library API \+ crawling infrastructure is substantial. MVP: manual competitor ad paste. Automated in Phase 3\. |
| **Mobile app strategy** | Web app is responsive. Native mobile app (iOS/Android) for on-the-go AI Consultant queries would increase daily habit formation. Phase 3\. |
| **Team/Agency multi-user** | Client management across multiple campaign workspaces is architecturally complex. Scope Agency tier carefully — may need its own sub-project. |

*End of CampaignOS Product Brief v1.0*

This document is intended for use with AI coding agents for autonomous implementation.