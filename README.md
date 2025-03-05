# RightSpend Landing Page

The official landing page for RightSpend, showcasing our AWS cost optimization services.

## Quick Start

1. Install Node.js (v22.14.0 or later)
2. Install dependencies: `npm install`
3. Build the site: `npm run build`
4. Start the server: `npm run serve`

The site will be available at http://localhost:3005

## Development

- `npm run build` - Build the site (cleans dist, builds CSS, copies files)
- `npm run serve` - Start the local server
- `npm run clean` - Clean the dist directory

## Project Structure

```
rightspend.ai/
├── src/
│   ├── pages/         # HTML pages
│   ├── components/    # Reusable HTML components
│   ├── scripts/       # JavaScript files
│   ├── styles/        # CSS files (Tailwind)
│   └── assets/        # Images and other static files
├── dist/             # Built files (generated)
└── server.js        # Express server for serving the site
```

## Technologies

- Tailwind CSS for styling
- Alpine.js for interactivity
- Express.js for serving the site

## Menu Structure

*   Features
*   Benefits (with Use Cases as a sub-item)
*   Pricing
*   Resources
    *   How it Works
        *   Engine
        *   Admin Panel
    *   Use Cases
    *   FAQ
    *   Blog
