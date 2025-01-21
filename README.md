# RightSpend Landing Page

A modern, responsive landing page for CloudFix RightSpend, showcasing AWS cost optimization solutions.

## Features

- Modern, responsive design
- Built with HTML5 and Tailwind CSS
- Optimized for performance
- Smooth scrolling navigation
- Mobile-friendly interface
- Automated deployment to AWS S3 with CloudFront CDN

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

### AWS Infrastructure

The site is deployed using:
- S3 for static file hosting
- CloudFront for CDN and HTTPS
- GitHub Actions for automated deployment

#### S3 Setup

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

#### CloudFront Setup

The site is served through CloudFront for:
- Global CDN distribution
- HTTPS support
- Better performance
- Edge caching

Distribution ID: `E25JJXN5IK80N1`

### GitHub Actions Configuration

The following secrets are required:
- `AWS_ACCESS_KEY_ID`: IAM user access key
- `AWS_SECRET_ACCESS_KEY`: IAM user secret key
- `AWS_REGION`: AWS region (e.g., `us-east-1`)
- `S3_BUCKET`: S3 bucket name

### Manual Deployment
```bash
# Build the site
npm run build

# Deploy to S3
aws s3 sync . s3://your-bucket-name --exclude "*" --include "index.html" --include "dist/*" --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E25JJXN5IK80N1 --paths "/*"
```

### Automatic Deployment
The site automatically deploys to S3 and invalidates CloudFront cache when changes are pushed to the main branch.

## Building for Production

Run `npm run build` to generate a minified CSS file for production use.

## License

Copyright 2025 RightSpend. All rights reserved.
