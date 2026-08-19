# Cloudflare Workers Setup Guide

This guide will help you deploy the OAuth authentication functions to Cloudflare Workers.

## Prerequisites

1. A Cloudflare account with Workers enabled
2. GitHub OAuth application credentials (client ID and secret)
3. Node.js installed

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Wrangler CLI globally (if not already installed):
```bash
npm install -g wrangler
```

## Configuration

### 1. Set up Cloudflare Authentication

Login to Cloudflare:
```bash
wrangler login
```

### 2. Configure Environment Variables

Set your OAuth credentials as secrets:

```bash
wrangler secret put OAUTH_CLIENT_ID
# Enter your GitHub OAuth Client ID when prompted

wrangler secret put OAUTH_CLIENT_SECRET
# Enter your GitHub OAuth Client Secret when prompted
```

### 3. Update wrangler.toml

Edit `wrangler.toml` to configure your custom domain if needed:

```toml
name = "bewegt-oauth-workers"
main = "workers/index.js"
compatibility_date = "2024-08-01"

[vars]
ENVIRONMENT = "production"
```

## Deployment

### Deploy to Cloudflare Workers

```bash
npm run workers:deploy
```

This will deploy your worker and provide you with a Workers URL (e.g., `https://bewegt-oauth-workers.your-subdomain.workers.dev`).

### Configure Custom Domain (Optional)

If you want to use your own domain:

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select your worker (bewegt-oauth-workers)
4. Go to Settings > Triggers > Custom Domains
5. Add your custom domain routes:
   - `your-domain.com/oauth/auth`
   - `your-domain.com/oauth/callback`

## Testing

### Local Development

To test locally:

```bash
npm run workers:dev
```

This will start a local development server at `http://localhost:8787`.

### Test OAuth Flow

1. Navigate to `/oauth/auth` on your deployed worker
2. You should be redirected to GitHub for authorization
3. After authorization, you'll be redirected to `/oauth/callback`
4. The callback will return the access token to your admin interface

## Integration with Existing Site

### Update Netlify Configuration

If you're keeping the main site on Netlify but moving OAuth to Cloudflare:

1. Update the OAuth redirect URI in your GitHub OAuth app settings to point to your Cloudflare Workers URL
2. Update your admin CMS configuration to use the new Cloudflare Workers endpoints

### Update CSP Headers

If using custom domains, update your Content Security Policy in `netlify.toml` to include your Cloudflare Workers domain:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """default-src 'self';
      connect-src 'self'
        https://your-cloudflare-worker.workers.dev
        ..."""
```

## Migration from Netlify Functions

The Cloudflare Workers implementation maintains the same OAuth flow as the original Netlify functions:

- **auth.mjs** → `/oauth/auth` endpoint
- **callback.mjs** → `/oauth/callback` endpoint

Both functions have been migrated to handle the same request/response patterns, so your existing admin interface should work without modification.

## Troubleshooting

### Worker Returns 404

- Check that the worker is deployed correctly
- Verify the route patterns match your expected URLs
- Check Cloudflare dashboard for worker logs

### OAuth Fails

- Verify your OAuth credentials are set correctly as secrets
- Check that the redirect URI in GitHub OAuth settings matches your worker URL
- Review worker logs in Cloudflare dashboard

### CORS Issues

- If encountering CORS errors, you may need to add CORS headers to the worker responses
- Update your CSP headers to allow connections from your worker domain

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)