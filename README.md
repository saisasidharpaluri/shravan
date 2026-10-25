# SHRAVAN

SHRAVAN is a voice-first civic issue reporting demo. Residents can describe a local issue, review and edit the transcript, add a category and approximate area, then save a report on their device. The app demonstrates Gnani AI Prisma speech-to-text and Timbre text-to-speech.

## Run locally

1. Install Node.js 20.9 or newer.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Gnani API key as `GNANI_API_KEY`.
4. Run `npm run dev` and open http://localhost:3000.

The API key is used only by the server routes. Never commit `.env.local` or paste the key into browser code.

## MVP behavior

- Hindi and English voice recording, limited to 60 seconds.
- Browser audio is converted to WAV and sent to Prisma v2.5 through `/api/transcribe`.
- Reports can be reviewed, edited, categorized and optionally tagged with an approximate area.
- Demo reports are stored in this browser's local storage; they are not sent to a municipality or authority.
- Timbre v2.5 reads the confirmation aloud through `/api/speak`.

## Before sharing the demo

Use synthetic reports and locations. Do not record or enter real phone numbers, government IDs, exact home addresses or other sensitive information. Check API credit usage in the Gnani dashboard. If publishing the app, configure `GNANI_API_KEY` as a deployment secret. The current demo stores reports only in the visitor's browser and has no shared database or authority integration.

## Challenge submission checklist

- Deploy a working public demo and record it in use.
- Name Prisma and Timbre in the written project explanation and describe each member's contribution.
- Publish the demo video on LinkedIn and/or X, tag Gnani AI and include `#GnaniAI` and `#GreatIndianAIInternshipChallenge`.
- Nominate the public post link in the submission form before November 10, 2026, 11:59 PM IST.
