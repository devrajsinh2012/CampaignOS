# CampaignOS — AI-Powered Digital Marketing Command Centre

> The world's smartest digital marketing co-pilot — from brief to campaign to results, all in one place.

CampaignOS eliminates the fragmentation that plagues modern marketing teams. Instead of juggling 6–12 different tools, everything lives in one platform powered by AI: analyze campaigns, plan new ones, generate creatives, build audiences, forecast outcomes, run experiments, and track competitors.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Features (13 AI-Powered Tools)

### Phase 1 — Core Features
| Tool | Description |
|------|-------------|
| **Dashboard** | Real-time overview with AI usage meter, quick actions, and recent activity |
| **Campaign Analyzer** | Paste campaign metrics → get instant AI diagnosis with prioritized fixes |
| **Campaign Planner** | Define goals, audience, budget → receive a full campaign plan with timelines |
| **AI Consultant** | Chat-based marketing advisor for strategy, copy, and troubleshooting |
| **Learning Hub** | Structured AI-guided courses on digital marketing fundamentals |

### Phase 2 — Creative & Content
| Tool | Description |
|------|-------------|
| **Creative Studio** | Generate ad copy variants with brand voice profiles and performance scoring |
| **Audience Builder** | Build detailed audience personas with tiered targeting recipes |
| **Prompt Generator** | Turn creative concepts into optimized prompts for AI image/video tools |
| **Festival Planner** | 12-month marketing calendar with geography-specific events and campaign ideas |
| **News Feed** | AI-curated daily digest of digital marketing news and platform updates |
| **Prompt Library** | Searchable collection of high-quality prompts by category, tool, and style |

### Phase 3 — Analytics & Intelligence
| Tool | Description |
|------|-------------|
| **Forecasting** | Budget simulator with conservative/moderate/aggressive scenario modeling |
| **Experiments** | A/B test design wizard + statistical results analyzer |
| **Competitive Analysis** | Competitor teardown, gap analysis, and monitoring framework |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 6, TailwindCSS 4, React Router 7, Zustand 5, Recharts 3 |
| **UI** | Custom dark-mode design system (Navy #0A2540, Teal #00C896), Lucide icons |
| **Auth** | Supabase Auth (Email/Password + Google OAuth) |
| **Database** | Supabase PostgreSQL |
| **AI Engine** | NVIDIA NIM API (OpenAI-compatible) — Kimi K2 model |
| **Backend** | Vercel Serverless Functions |
| **Deployment** | Vercel |

---

## Project Structure

```
CampaignOS/
├── api/                        # Vercel Serverless Functions
│   └── ai/
│       ├── analyze.js          # Campaign analysis endpoint
│       ├── plan.js             # Campaign planning endpoint
│       ├── chat.js             # AI consultant + general chat
│       ├── learn.js            # Learning content generation
│       └── quiz.js             # Quiz generation
├── src/
│   ├── components/
│   │   ├── ai/                 # AIBlock, ChatBubble, HealthRing, MetricInput
│   │   ├── layout/             # AppShell, Sidebar
│   │   └── ui/                 # Button, Card, Input, ChipSelector, Spinner, Modal
│   ├── hooks/
│   │   ├── useAI.js            # Custom hook for AI API calls
│   │   └── useAuth.js          # Authentication hook
│   ├── lib/
│   │   ├── api.js              # API client
│   │   ├── constants.js        # App constants & data arrays
│   │   ├── prompts.js          # All AI system prompts
│   │   ├── supabase.js         # Supabase client init
│   │   └── utils.js            # Utility functions
│   ├── pages/                  # 18 page components (auth + features)
│   ├── store/
│   │   └── store.js            # Zustand global state
│   ├── App.jsx                 # Router & route definitions
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                 # Vercel routing config
└── .env.example                # Environment variable template
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Supabase](https://supabase.com) project (free tier)
- An AI API key ([NVIDIA NIM](https://build.nvidia.com/), OpenAI, or any OpenAI-compatible provider)

### 1. Clone the repository

```bash
git clone https://github.com/devrajsinh2012/CampaignOS.git
cd CampaignOS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

LLM_API_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_API_KEY=your_nvidia_nim_api_key
LLM_MODEL_NAME=moonshotai/kimi-k2

FREE_TIER_DAILY_LIMIT=15
```

### 4. Set up Supabase Auth

In your Supabase dashboard:
1. Go to **Authentication → Providers** and enable **Email** (with email confirmation disabled for dev)
2. Optionally enable **Google** OAuth
3. Go to **SQL Editor** and create the required tables (see [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md) for schema)

### 5. Run locally

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

> **Note:** AI features require the serverless API endpoints. For local AI testing, deploy to Vercel or run a local API server.

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repository
3. Framework preset: **Vite** (auto-detected)
4. Add the environment variables listed above
5. Click **Deploy**

Your app will be live at `https://your-app.vercel.app`.

The `vercel.json` is pre-configured to route `/api/*` to serverless functions and serve the SPA for all other paths.

---

## Screenshots

> *Coming soon — deploy the app and explore all 13 features!*

---

## AI Architecture

All AI calls flow through Vercel Serverless Functions (`/api/ai/*`) to keep API keys secure. The backend uses an OpenAI-compatible client, so you can swap providers by changing three environment variables:

```
LLM_API_BASE_URL → Provider endpoint
LLM_API_KEY      → Your API key
LLM_MODEL_NAME   → Model identifier
```

**Compatible providers:** NVIDIA NIM, OpenAI, Groq, Together AI, Fireworks, Ollama, or any OpenAI-compatible API.

Each feature has its own system prompt defined in `src/lib/prompts.js`, engineered for structured markdown output that renders cleanly in the UI.

---

## Target Users

- **Solo Marketers** — Freelancers who need speed and expertise on demand
- **Small Agencies** — Teams running 10–50 client campaigns who need structure and AI leverage
- **Growth Marketers** — Startup PMs who understand metrics but need creative & strategic help
- **Marketing Students** — Learners building skills with guided education and real tools

---

## Contributing

Contributions are welcome! This is an open-source prototype.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

**Devrajsinh Gohil**
- GitHub: [@devrajsinh2012](https://github.com/devrajsinh2012)
- Email: djgohil2012@gmail.com

---

<p align="center">
  Built with ❤️ and AI
</p>
