# SHRAVAN

SHRAVAN is a mobile-first, multilingual civic issue reporting demo. Residents can describe a local issue in one of ten Gnani-supported languages, review and edit the transcript, add a category and approximate area, then save a report on their device. The app uses Gnani AI Prisma speech-to-text and Timbre text-to-speech.

## Screens

- Home: start or resume a report, or open reports saved in this browser.
- Speak: choose Hindi, Indian English, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, or Punjabi; record up to 30 seconds, preview, re-record, discard, transcribe with Prisma, or type manually.
- Details: choose an issue category and add an optional approximate area or landmark.
- Review: edit the transcript, choose the Timbre read-back language, listen to the description, and confirm the category and area before saving.
- Confirmation: see the device-local demo reference, hear a Timbre confirmation in the selected voice language, and share or copy a clearly labeled resident-prepared summary.
- My reports: search, filter, open, and delete reports saved in this browser.

The report draft is retained across steps and refreshes. Audio recordings are not persisted. Reports remain local to the current browser, only the latest 10 are kept, and clearing browser data may remove them. Sharing opens the browser share sheet or copies a summary; SHRAVAN does not submit reports to a municipality or civic authority, and reports have no official status.

## Run locally

1. Install Node.js 20.9 or newer.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Gnani API key as `GNANI_API_KEY`.
4. Run `npm run dev` and open http://localhost:3000.

The API key is used only by the server routes. Never commit `.env.local` or paste the key into browser code.

## Gnani integrations and privacy

- Prisma v2.5 receives WAV audio through `/api/transcribe`. The resident selects a supported language; when they request transcription, the recording is sent to Gnani AI. It is not attached to the saved demo report.
- Timbre v2.5 returns read-back and confirmation audio through `/api/speak`, using a server-side language and voice map.
- The language registry currently covers ten end-to-end voice languages. Prisma v3.0 automatic language identification is not enabled in this build; only claim it after it is verified with the challenge API account.
- Evon is not integrated because no inference endpoint or model runtime is configured. Do not describe Evon as part of the demo unless it is added and verified.
- If the key is missing or a speech request fails, users can still type, review, and save demo reports locally.
- Speech requests are limited in memory per server process. This is a best-effort demo safeguard; public multi-instance deployments should use a shared edge or hosted rate limiter.

## Before sharing the demo

Use synthetic reports and locations. Do not record or enter real phone numbers, government IDs, exact home addresses or other sensitive information. Check API credit usage in the Gnani dashboard. If publishing the app, configure `GNANI_API_KEY` as a deployment secret. The demo has no accounts, shared database, or authority integration.

## Challenge submission checklist

- Deploy a working public demo and record it in use.
- Name Prisma v2.5 and Timbre v2.5 in the written project explanation and describe each member's contribution. Add Evon only if it is actually integrated.
- Publish the demo video on LinkedIn and/or X, tag Gnani AI and include `#GnaniAI` and `#GreatIndianAIInternshipChallenge`.
- Nominate the public post link in the submission form before November 10, 2026, 11:59 PM IST.
