# AI Course-to-Career Navigator 🚀

The **AI Course-to-Career Navigator** is an enterprise-grade full-stack platform designed to help students bridge the gap between academic learning and high-impact industry careers. Leveraging the **Gemini 3.5 Flash** large language model, the application automatically maps complete career pathways, analyzes technical skill gaps, structures custom capstone projects, and builds professional recruiter portfolios.

---

## 🎨 Design Philosophy & UI Choices

The user interface utilizes a **Modern Slate & Violet** high-contrast aesthetic that focuses purely on elegance, legibility, and high human usability:
* **Spacious Typography**: Using deep charcoal text on soft clean slate white cards with generous negative spacing.
* **Responsive Fluidity**: Engineered desktop-first precision with mobile-friendly collapsible sidebars and touch elements.
* **Dynamic Visualization**: Integrated responsive **Recharts** charts to track student learning progress over weeks and display readiness gauges.
* **Animated State Changes**: Utilizing **Framer Motion** to deliver smooth, sub-second route changes and sliding tab selections.

---

## 🛠️ Technical Stack

* **Frontend**: React 19, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts.
* **Backend**: Node.js, Express.js.
* **Database**: Local high-performance JSON-file persistent transaction engine (`server_db.json`).
* **AI Engine**: `@google/genai` (utilizing the recommended `gemini-3.5-flash` model).
* **Development/Bundler**: Vite, `tsx` server hot reload, `esbuild` production bundler.

---

## ⚙️ Environment Variables

Declare these variables in your root configuration or `.env` files:

```env
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from your Secrets.
GEMINI_API_KEY="your_api_key_here"

# APP_URL: Self-referential Link for authentication and redirects
APP_URL="http://localhost:3000"
```

---

## 📂 Core Folder Structure

```
├── server.ts                    # Full-Stack Express Server with AI routing
├── server_db.json               # Persistent local database state JSON file
├── package.json                 # Dependency definitions & full-stack scripts
├── tsconfig.json                # TypeScript definitions and configurations
├── vite.config.ts               # Vite configuration with tailwind assets
├── index.html                   # Entry SPA template shell
└── src/
    ├── App.tsx                  # Main root application coordinate controller
    ├── main.tsx                 # Client entry bootstrap file
    ├── index.css                # Global CSS stylesheet importing Tailwind v4
    ├── types.ts                 # Shared TypeScript models and interfaces
    ├── utils/
    │   └── fallbackTemplates.ts # Offline simulation fallbacks (resilience layer)
    └── components/
        ├── AuthCard.tsx         # Account logs & registrations
        ├── Navbar.tsx           # Dynamic header and real-time alerts dropdown
        ├── Sidebar.tsx          # Navigation rail
        ├── DashboardHome.tsx    # Analytics dashboard (Recharts, profile inputs)
        ├── RoadmapTab.tsx       # Timeline-driven Course-to-Career roadmap
        ├── SkillGapTab.tsx      # Dual skill gap comparisons with priority score cards
        ├── InternshipFinderTab.tsx# Vetted jobs search with bookmark filters
        ├── ProjectGeneratorTab.tsx# Beginner, Intermediate, and Advanced guides
        ├── PortfolioBuilderTab.tsx# Synthesizer of Resumes, LinkedIn Bios, and READMEs
        ├── ChatbotTab.tsx       # LLM-guided conversational career counselor
        └── AdminPanelTab.tsx    # Broadcasts dispatch systems
```

---

## 📡 REST API Architecture

* **Authentication Routes**:
  * `POST /api/auth/login` - Verify user credentials.
  * `POST /api/auth/signup` - Register a new account.
  * `POST /api/auth/google` - Link/register Google profiles (Demo).
  * `POST /api/auth/forgot-password` - Trigger recovery steps.
* **Data & Analytics**:
  * `GET /api/profile` - Authenticate token and load student bio.
  * `POST /api/profile/update` - Update verified skills and courses.
  * `GET /api/analytics` - Pull applications and score progress charts.
* **AI Orchestrator Services**:
  * `POST /api/career-roadmap` - Formulates custom vertical timeline progressions.
  * `POST /api/skill-gap` - Calculates Readiness Score % and compiles roadmap courses.
  * `POST /api/generate-project` - Produces modular project blueprints and folder trees.
  * `POST /api/portfolio` - Packages LinkedIn summaries, Resumes, and GitHub profiles.
  * `POST /api/chat` - Chats dynamically with history parameters.
* **Internships & Alert Systems**:
  * `GET /api/internships` - Query searchable, sorted openings.
  * `POST /api/internships/save` - Bookmark listings.
  * `GET /api/notifications` - Pull alert counters.
  * `POST /api/notifications/read` - Mark specific messages as read.
* **Administrative Interfaces**:
  * `GET /api/admin/stats` - Pull system totals.
  * `POST /api/admin/broadcast` - Send notifications instantly to all registries.

---

## 🔒 Security Practices & Resilience

1. **Lazy SDK Initialization**: The server-side Gemini AI client initializes only when triggered by user actions, preventing backend crashes on startup if keys are missing or pending.
2. **Offline Resilience Fallbacks**: If the Gemini API encounters rate limits, network timeouts, or missing configurations, the application gracefully activates structured, high-yield offline blueprints matching the user's targeted course. The application NEVER crashes.
3. **Strict Secrets Separation**: The Gemini API key is called *exclusively* inside the secure Node backend. No keys are ever packed into or exposed to browser bundles.
4. **JWT-like Token Headers**: Front-to-back communications are locked behind Bearer token structures, safeguarding profile registries.

---

## 🚀 Deployment Instructions

### Local Execution:
```bash
# 1. Install dependencies
npm install

# 2. Run local development environment
npm run dev
```

### Production Bundling:
```bash
# 1. Build client-side assets and compile server.ts to dist/server.cjs via esbuild
npm run build

# 2. Start stand-alone production node server
npm start
```
