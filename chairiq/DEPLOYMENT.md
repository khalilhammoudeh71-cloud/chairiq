# SPA Routing Configuration for Custom Domain

This project is configured to work with Single Page Application (SPA) routing across multiple hosting platforms.

## Deployment Files Created

### 1. **Netlify** (`netlify.toml` & `public/_redirects`)
- Redirects all routes to `index.html`
- Includes security headers
- Optimized caching for static assets

### 2. **Vercel** (`vercel.json`)
- Rewrites all routes to `index.html`
- Security headers configured
- Asset caching enabled

### 3. **Apache Servers** (`public/.htaccess`)
- mod_rewrite rules for SPA routing
- Fallback to `index.html` for all routes

## Custom Domain Setup (chairing.online)

### If deployed on Netlify:
1. Ensure `netlify.toml` is in the root directory
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The `_redirects` file in `public/` will be copied to `dist/` automatically

### If deployed on Vercel:
1. Ensure `vercel.json` is in the root directory
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### If deployed on Apache/cPanel:
1. Upload the contents of `dist/` folder after building
2. Ensure `.htaccess` file is present in the root
3. Verify mod_rewrite is enabled on the server

## Testing Routes

After deployment, test these URLs:
- https://chairing.online/privacy-policy
- https://chairing.online/terms-of-service
- https://chairing.online/login
- https://chairing.online/treatment-plan-landing

## Troubleshooting

If you still see "server can't be found" errors:

1. **Clear browser cache** and try again
2. **Check DNS propagation** - custom domains can take 24-48 hours to fully propagate
3. **Verify deployment platform** - ensure the correct configuration file is being used
4. **Check build logs** - ensure `dist/` folder contains `index.html` and all assets
5. **Contact hosting support** - provide them with the error and mention you need SPA routing support

## Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run serve
```

The `dist/` folder will contain:
- `index.html` (main entry point)
- `assets/` (JS, CSS, images)
- `_redirects` (for Netlify)
- `.htaccess` (for Apache)
- Other static files from `public/`

## Important Notes

- All routes are handled client-side by React Router
- The server must always serve `index.html` for any route
- Static assets in `public/` are copied to `dist/` during build
- Environment variables must be prefixed with `VITE_` to be accessible