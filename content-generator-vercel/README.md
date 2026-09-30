# Content Generator

Static front end (`index.html`) plus one serverless function (`api/generate.js`) that calls the Google Gemini API.

## Deploy
1. Push this folder to GitHub.
2. Import the repo in Vercel (framework preset: Other, no build command).
3. Add environment variable `GEMINI_API_KEY` (optional: `GEMINI_MODEL`).
4. Deploy.
