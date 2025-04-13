# Deploying to Vercel

This document provides instructions for deploying this application to Vercel.

## Manual Deployment

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't have an account

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy the Project**
   ```bash
   # From the project root directory
   vercel
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Automatic Deployment with GitHub Integration

1. **Connect Your GitHub Repository to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Follow the setup instructions

2. **Configure Build Settings**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add any required environment variables in the Vercel project settings

## Troubleshooting

If you encounter build issues, try the following:

1. **Use the Static Deployment**
   - The `static` directory contains a pre-built version of the site
   - You can deploy this directly using:
   ```bash
   vercel ./static
   ```

2. **Check Node.js Version**
   - Vercel supports Node.js 18.x by default
   - You can specify a different version in the Vercel project settings

3. **Verify Build Output**
   - Run `npm run build` locally to check if the build succeeds
   - Inspect the `dist` directory to ensure it contains the expected files

## Support

If you need help with deployment, please:
- Check the [Vercel documentation](https://vercel.com/docs)
- Open an issue in the GitHub repository
