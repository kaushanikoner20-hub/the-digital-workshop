# The Digital Workshop — Run & Deploy

## Run locally

From the project root:

```bash
npm install
npm run dev
```

On Windows PowerShell, if the `npm.ps1` wrapper is blocked by execution policy, use the equivalent command shim:

```powershell
npm.cmd install
npm.cmd run dev
```

The production check is:

```bash
npm run lint
npm run build
npm run preview
```

## AWS Amplify Hosting

1. Push the `digital-workshop` folder to a Git provider supported by Amplify, or upload the repository through the Amplify Hosting console.
2. Create a new Amplify Hosting app and connect the repository and branch.
3. Use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

4. Add a rewrite for client-side routing in Amplify Hosting. In the Rewrites and redirects panel, add a source of `/<*>`, target `/index.html`, and type `200 (Rewrite)`. Keep asset and file-specific rules ahead of this catch-all if you add any later.
5. Deploy. The app is frontend-only and does not require environment variables or a backend service in this version.

The app includes `public/manus-routes.json` with the seven declared page routes. Replace the editable placeholders in the source with verified biography, project, achievement, and contact details before publishing publicly.
