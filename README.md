# RightSpend Landing Page

A modern, responsive landing page for CloudFix RightSpend, showcasing AWS cost optimization solutions.

## Features

- Modern, responsive design
- Built with HTML5 and Tailwind CSS
- Optimized for performance
- Smooth scrolling navigation
- Mobile-friendly interface
- Automated deployment to AWS S3

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
rightspend-landing/
├── dist/               # Generated CSS output
├── src/               
│   └── input.css      # Tailwind CSS input file
├── index.html         # Main HTML file
├── package.json       # Project dependencies
└── tailwind.config.js # Tailwind configuration
```

## Development

The project uses Tailwind CSS for styling. The development server will watch for changes in your CSS and automatically rebuild the output file.

## Deployment

### AWS S3 Setup

1. Create an S3 bucket:
   - Go to AWS Console > S3
   - Create a new bucket (e.g., `rightspend.ai`)
   - Enable "Static website hosting" under bucket properties
   - Set index.html as both Index and Error document

2. Configure bucket policy:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
           }
       ]
   }
   ```

3. Set up GitHub Secrets:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_REGION
   - S3_BUCKET

### Manual Deployment
```bash
npm run build
aws s3 sync . s3://your-bucket-name --exclude "*" --include "index.html" --include "dist/*" --delete
```

### Automatic Deployment
The site automatically deploys to S3 when changes are pushed to the main branch.

## Building for Production

Run `npm run build` to generate a minified CSS file for production use.

## License

Copyright 2025 RightSpend. All rights reserved.
