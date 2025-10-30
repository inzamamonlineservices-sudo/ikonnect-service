# Deploying to Vercel

This guide explains how to deploy the Ikonnect Service website to Vercel and addresses common issues.

## Important Notes About Vercel Deployment

### 1. CSS Not Working Issue

**Problem**: CSS doesn't load properly on Vercel deployment.

**Solution**: This is typically caused by incorrect build configuration. Make sure:

1. **Tailwind CSS is properly configured**: The `tailwind.config.ts` file should include all necessary content paths:
   ```typescript
   content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"]
   ```

2. **PostCSS is configured**: Ensure `postcss.config.js` includes:
   ```javascript
   export default {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

3. **Build command is correct**: Vercel should run `npm run build` which executes:
   ```json
   "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
   ```

4. **CSS file is imported**: Verify `client/src/index.css` is imported in your main entry point.

### 2. Testimonials and Dynamic Data Not Showing

**Problem**: Client testimonials, portfolio items, and other database-driven content don't appear.

**Root Cause**: This is a **backend API issue**. The current architecture uses:
- Express backend with database connections
- REST API endpoints (`/api/testimonials`, `/api/portfolio`, etc.)
- PostgreSQL database (Neon)

**Solutions**:

#### Option A: Deploy Full-Stack to Vercel (Recommended)

1. **Set up Vercel environment variables**:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `GEMINI_API_KEY` - For AI chatbot functionality
   - `OPENAI_API_KEY` - If using OpenAI features
   - All other secrets from your Replit environment

2. **Configure Vercel Functions**: The `vercel.json` file is already set up to handle API routes as serverless functions.

3. **Database Migrations**: Run database migrations before deployment:
   ```bash
   npm run db:push
   ```

#### Option B: Use Static Fallback Data

If you only want to deploy the frontend to Vercel without the backend:

1. Replace API calls with static data in the components
2. Import mock data instead of fetching from endpoints
3. Remove or disable features that require backend (chatbot, contact form, newsletter)

#### Option C: Use Replit for Backend, Vercel for Frontend

1. Deploy only the frontend to Vercel
2. Keep your Express backend running on Replit
3. Update API calls to point to your Replit backend URL
4. Configure CORS on Replit to allow requests from Vercel domain

### 3. Recommended Deployment Steps

1. **Push your code to GitHub** (if not already done)

2. **Connect to Vercel**:
   - Import your GitHub repository in Vercel
   - Vercel will auto-detect it as a Vite project

3. **Configure Environment Variables** in Vercel dashboard:
   ```
   DATABASE_URL=your-neon-connection-string
   GEMINI_API_KEY=your-gemini-key
   NODE_ENV=production
   ```

4. **Set Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist/public`

5. **Deploy**: Vercel will build and deploy your application

### 4. Alternative: Deploy to Replit

For the easiest deployment with zero configuration issues:

1. Use Replit's built-in deployment feature
2. Everything (frontend, backend, database) works out of the box
3. No additional configuration needed
4. Your chatbot, testimonials, and all features work perfectly

To deploy on Replit, simply click the "Deploy" button in your Replit workspace.

## Troubleshooting

### CSS Still Not Working
- Clear Vercel build cache and redeploy
- Check the browser console for 404 errors on CSS files
- Verify the `dist/public` directory contains CSS files after build

### API Routes 404
- Ensure environment variables are set in Vercel
- Check Vercel function logs for errors
- Verify database connection string is correct

### Database Connection Errors
- Confirm `DATABASE_URL` is set correctly
- Check that your Neon database allows connections from Vercel's IP ranges
- Verify SSL mode in connection string (usually `?sslmode=require`)

## Conclusion

For the smoothest experience with all features working (especially dynamic content like testimonials and the AI chatbot), we recommend deploying to **Replit** rather than Vercel, as Replit is specifically designed for full-stack applications and handles all the backend infrastructure automatically.
