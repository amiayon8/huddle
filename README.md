# Huddle

Huddle is a deliberate practice platform for software engineers. It organizes continuous engineering growth into sequential stepping-stone units, 4-day practice sprints, 4-person accountability squads, and contextual coaching with Pip.

## Overview

Traditional learning platforms focus on passive video consumption or long tutorials. Huddle emphasizes daily deliberate execution:
- **Stepping-Stone Units**: Guided curriculum nodes with clear progression from fundamentals to production implementation.
- **4-Day Deliberate Sprints**: Focused daily exercises designed to take 15 to 20 minutes and produce tangible engineering artifacts.
- **Zero-Penalty Reshuffling**: Reschedule sprint timelines anytime without resetting practice progress.
- **Friend Squads**: 4-person accountability groups sharing weekly progress, check-ins, and peer encouragement.
- **Learning Library**: Digestible 15-minute engineering guides with downloadable blueprints and syntax-highlighted code.
- **Developer Profile**: Verified engineering proofs, milestone badges, and skill health tracking with privacy controls.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, TypeScript 5, Tailwind CSS v4, Framer Motion
- **Database & Auth**: Supabase (PostgreSQL, Realtime, Supabase Auth)
- **Math & Code Engine**: KaTeX, Custom CodeBlock syntax parser
- **Icons**: Lucide React

## Project Architecture

```text
app/
├── api/
│   ├── mascot/             # Pip coaching conversational endpoint
│   └── questionnaire/      # Onboarding survey evaluation endpoint
├── auth/
│   ├── forgot-password/    # Password reset email dispatch
│   ├── login/              # Account sign-in
│   └── signup/             # Account registration
├── components/
│   ├── CodeBlock.tsx       # Syntax-highlighting code viewer & parser
│   ├── CommunityView.tsx   # Questions and discussions feed
│   ├── CreatorView.tsx     # Learning Library of engineering guides
│   ├── DashboardView.tsx   # Primary Learn tab with stepping-stone path
│   ├── DuolingoMascot.tsx  # Pip speech bubble and interactive mascot
│   ├── MascotDrawer.tsx    # Multi-session conversational coaching drawer
│   ├── PublicProfileView.tsx # 3-tab developer profile with portfolio proofs
│   ├── SquadView.tsx       # 4-person friend squad & community updates
│   └── BingeQuizModal.tsx  # Dynamic concept review modal
├── context/
│   └── HuddleContext.tsx   # Application state and Supabase data subscriptions
├── lib/
│   └── supabase.ts         # Database client, queries, and mutations
└── types/
    └── huddle.ts           # Domain data models and TypeScript definitions
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, pnpm, or yarn
- A Supabase project instance

### Environment Variables

Create a `.env` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
GEMINI_API_KEY=<your-gemini-api-key>
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Key Features

### 1. Learn (Stepping-Stone Path)
Visual stepping-stone units guide engineers through core concepts, code builds, and production architecture proofs. Each day features one clear task with estimated time and artifact deliverables.

### 2. Friend Squads
Small 4-person squads with shared weekly goals, member milestone tracking, activity pings, and mutual check-ins.

### 3. Learning Library
Curated engineering lessons with reading times, architecture blueprints, and code examples. Engineers can filter by topic tags or search by keyword.

### 4. Discussions
Technical Q&A filtered by category with inline reply threads, verified solution markers, and code formatting.

### 5. Developer Profile
Showcases verified GitHub pull requests, architecture decision records, milestone achievements, and skill health with public/private visibility toggles.