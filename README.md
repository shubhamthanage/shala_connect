# Shala Connect

शाळाConnect — Connect with your school community

## Tech Stack

- **Next.js 14** App Router
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui** components
- **Supabase** client (auth + database)
- **Razorpay** payment integration
- **Google Fonts**: Baloo 2 (headings/hero/titles) + Noto Sans Devanagari (body/labels/forms/tables)

## Setup

### 1. Install dependencies (local to project)

```bash
npm install
```

All dependencies are installed in `node_modules/` within the project — nothing is installed globally.

### 2. Environment variables

Copy the example env file and add your keys:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase and Razorpay credentials.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
├── app/
│   ├── layout.tsx      # Root layout with fonts
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   └── ui/             # Shadcn components
├── lib/
│   ├── supabase/       # Supabase client (browser + server)
│   └── utils.ts        # Utility functions
└── design.html         # Design reference
```

## Adding more Shadcn components

```bash
npx shadcn@latest add [component-name]
```

Example: `npx shadcn@latest add card`
