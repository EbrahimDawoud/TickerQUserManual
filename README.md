# TickerQ Demo Documentation

This directory contains the Docusaurus documentation site for the TickerQ Demo project.

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

```bash
cd docs
npm install
```

### Development

Start the development server:

```bash
npm start
```

This will start the documentation site at `http://localhost:3000`.

### Building

Build the static site:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run serve
```

## Documentation Structure

- `docs/` - Documentation pages
- `src/` - React components and custom CSS
- `static/` - Static assets (images, etc.)
- `docusaurus.config.js` - Site configuration
- `sidebars.js` - Navigation structure

## Content

The documentation covers:

1. **Introduction** - Overview of TickerQ and the demo project
2. **Installation** - Setup guide and prerequisites
3. **Configuration** - TickerQ setup and configuration
4. **Cron Jobs** - Scheduled background tasks
5. **Time Jobs** - One-time scheduled tasks
6. **Exception Handling** - Custom error handling
7. **Dashboard** - Monitoring and management interface
8. **API Reference** - Complete code examples

## Deployment

The documentation can be deployed to:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Build the site and deploy the `build/` directory.
