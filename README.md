# archangel-vinext

Next.js App Router site redeveloped with BlueprintJS components and configured for `vinext` deployment targets.

## Current status

- Next.js App Router project created in this workspace
- BlueprintJS configured for UI components and theming
- `vinext` initialized and validated with a production build
- Ready for porting content from `ryanrclewis/archangel`

## Scripts

```bash
npm run dev            # Next.js dev server (default Next toolchain)
npm run build          # Next.js production build
npm run start          # Next.js production server

npm run dev:vinext     # vinext dev server on http://localhost:3001
npm run build:vinext   # vinext production build
npm run start:vinext   # preview vinext build locally
npm run deploy:vinext  # build and deploy to Cloudflare Workers
```

## Notes for next step

This repo is scaffold-only at the moment. The next phase is to migrate content and assets from:

- `https://github.com/ryanrclewis/archangel`

Planned migration targets:

- static page content into `app/page.tsx` and route segments
- fonts and media into `public/`
- project metadata from the existing `projects/` folder into structured data for rendering
