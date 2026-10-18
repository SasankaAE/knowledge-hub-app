# Knowledge Hub

Knowledge Hub is a knowledge-sharing web app for publishing and discovering
articles, field notes, and practical engineering lessons.

## Current project status

The project is currently a working prototype built with Next.js. It includes:

- A home feed with sample articles
- Article detail pages with tags, reading time, votes, and discussion
- A write-article form
- A profile page with the current user's articles
- Light and dark theme support
- Optional Supabase integration for loading articles from an `articles` table
- A local sample-data fallback when Supabase configuration is not available

The current content and user profile are demo data. Authentication, persistent
article creation, comments, and vote storage are not implemented yet.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase JavaScript client
- Radix UI and Lucide React

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Useful commands:

```bash
npm run lint
npm run build
npm run start
```

## Optional Supabase configuration

Create a `.env` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

When these variables are missing or invalid, the app runs with the built-in
sample articles.
