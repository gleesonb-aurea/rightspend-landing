# RightSpend Landing Page

A modern, responsive landing page for RightSpend by CloudFix, showcasing AWS cost optimization services.

## Features

- Responsive design with Tailwind CSS
- Interactive components with Alpine.js
- Smooth animations with AOS
- Interactive savings calculator
- Customer testimonials slider
- Contact form
- SEO optimized

## Development Setup

1. Install Node.js (v22.14.0 or later)

2. Clone the repository:
```bash
git clone https://github.com/gleesonb-aurea/rightspend-landing.git
cd rightspend-landing
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

This will:
- Start a local development server
- Watch for changes in source files
- Compile Tailwind CSS
- Auto-reload the browser

## Project Structure

```
rightspend-landing/
├── src/
│   ├── components/      # Reusable components
│   │   ├── shared/     # Shared components (header, footer)
│   │   ├── calculator.html
│   │   └── testimonials.html
│   ├── scripts/        # JavaScript files
│   └── styles/         # CSS files
├── dist/               # Compiled assets
├── index.html         # Main landing page
└── package.json
```

## Deployment

The site is automatically deployed to AWS S3 and served via CloudFront when changes are pushed to the main branch. For development:

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and test locally

3. Push your changes:
```bash
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name
```

4. Create a pull request to merge into main

## Development Guidelines

- Use Tailwind CSS for styling
- Follow BEM naming convention for custom CSS
- Keep components modular and reusable
- Test across different screen sizes
- Optimize images before committing
- Run lighthouse audits regularly

## License

Copyright © 2025 CloudFix. All rights reserved.
