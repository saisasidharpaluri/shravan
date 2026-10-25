# SHRAVAN

SHRAVAN is a mobile-first, voice-first civic issue reporting demo. Residents can describe a local issue, review and edit the transcript, add a category and approximate area, then save a report on their device. The app demonstrates Gnani AI Prisma speech-to-text and Timbre text-to-speech.

## Screens

- Home: start a report or open reports saved in this browser.
- Speak: choose Hindi or English, record up to 60 seconds, transcribe with Prisma, or type manually.
- Details: choose an issue category and add an optional approximate area or landmark.
- Review: edit and confirm the report before saving.
- Confirmation: see the device-local reference and play a Timbre voice confirmation.
- My reports: search and filter this browser's saved demo reports and open their details.

The report draft is retained across steps and refreshes. Audio recordings are not persisted. Saved reports remain local to the current browser and are not delivered to a municipality or civic authority.

## Run locally

1. Install Node.js 20.9 or newer.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Gnani API key as `GNANI_API_KEY`.
4. Run `npm run dev` and open http://localhost:3000.

The API key is used only by the server routes. Never commit `.env.local` or paste the key into browser code.

## Gnani integrations

- Prisma v2.5 receives WAV audio through `/api/transcribe`.
- Timbre v2.5 returns spoken confirmation audio through `/api/speak`.
- If the key is missing or the speech API is unavailable, users can still type, review, and save demo reports locally.

## Before sharing the demo

Use synthetic reports and locations. Do not record or enter real phone numbers, government IDs, exact home addresses or other sensitive information. Check API credit usage in the Gnani dashboard. If publishing the app, configure `GNANI_API_KEY` as a deployment secret. The demo has no shared database or authority integration.

## Challenge submission checklist

- Deploy a working public demo and record it in use.
- Name Prisma and Timbre in the written project explanation and describe each member's contribution.
- Publish the demo video on LinkedIn and/or X, tag Gnani AI and include `#GnaniAI` and `#GreatIndianAIInternshipChallenge`.
- Nominate the public post link in the submission form before November 10, 2026, 11:59 PM IST.