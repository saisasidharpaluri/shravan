# SHRAVAN

**SHRAVAN** is a multilingual, voice-first civic reporting prototype. It helps a resident prepare a clear local issue report by speaking or typing, reviewing the description, adding an issue type and approximate area, and saving or sharing the result.

SHRAVAN prepares a resident-authored demo report. It does **not** submit reports to a municipality or civic authority, and a saved report has no official status.

## Demo

[Watch the SHRAVAN challenge demo](artifacts/shravan-demo-video/SHRAVAN-Gnani-Challenge-Demo.mp4)

[Watch the three-minute walkthrough](public/demo/shravan-3-minute-demo.mp4)

[Read the walkthrough captions](public/demo/shravan-3-minute-demo.en.vtt)

[Read the one-page project pitch](public/shravan-pitch.pdf)

The videos demonstrate an illustrative Telugu-English pothole report. The bundled example audio is synthetic and does not contain a resident's recording or personal information. The longer walkthrough uses an original animated street illustration and clearly separates it from real app footage.

## What you can do

- Start a report with a voice recording of up to 30 seconds or type the description manually.
- Choose one of ten supported input and read-back languages: Hindi, Indian English, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, and Punjabi. The language picker shows each language in its native script.
- Use Prisma v2.5 with a selected language, or select Prisma v3.0 auto-detect and code-mix mode for mixed-language speech where the endpoint supports it.
- Listen to a recording before requesting transcription. Edit the recognized transcript before continuing.
- Keep the transcript language separate from the language selected for Timbre read-back.
- Choose a category: Roads & potholes, Waste & cleanliness, Water supply, Streetlights, Drainage, or Other.
- Add an optional approximate area or public landmark. The form discourages exact home addresses.
- Review and listen to the report before saving it in this browser.
- Browse, search, filter, share, copy, or delete saved demo reports. Sharing clearly says the report was not submitted to an authority.
- Try a synthetic Telugu-English sample without using a microphone. It is sent to Gnani only if the user explicitly requests transcription.

## Gnani AI models

| Model | How SHRAVAN uses it |
| --- | --- |
| **Prisma v2.5** | Speech-to-text when the resident selects a language. |
| **Prisma v3.0** | Automatic language detection and code-mix transcription when that mode is selected. This path has been smoke-tested with the configured challenge API key. |
| **Timbre v2.5** | Text-to-speech for report read-back and the spoken save confirmation, using a server-side language and voice registry. |

Prisma v3.0 is used for the demonstrated Telugu-English mixed-speech path; it is not a claim that every language combination is supported equally. Model behavior depends on the selected endpoint and Gnani's supported languages. Evon is **not** integrated in this prototype.

## How a report moves through the app

1. The resident chooses a speech-recognition mode and records a voice note, loads the synthetic example, or types a description.
2. If the resident chooses **Transcribe with Prisma**, the browser sends the recording to the SHRAVAN server route, which forwards it to Gnani. The transcript and any recognized language metadata return to the browser for review and editing.
3. The resident chooses an issue category and optional approximate area, then reviews the transcript and selects a Timbre read-back language.
4. When the resident chooses to listen, the text is sent through the SHRAVAN server route to Gnani Timbre and the returned audio plays in the browser.
5. Saving stores the report in this browser. The resident can later copy or share a clearly labeled summary themselves.

## Languages

SHRAVAN's language registry currently exposes these end-to-end choices:

| Language | Code | Native name |
| --- | --- | --- |
| Hindi | `hi-IN` | हिन्दी |
| Indian English | `en-IN` | English |
| Bengali | `bn-IN` | বাংলা |
| Tamil | `ta-IN` | தமிழ் |
| Telugu | `te-IN` | తెలుగు |
| Marathi | `mr-IN` | मराठी |
| Gujarati | `gu-IN` | ગુજરાતી |
| Kannada | `kn-IN` | ಕನ್ನಡ |
| Malayalam | `ml-IN` | മലയാളം |
| Punjabi | `pa-IN` | ਪੰਜਾਬੀ |

Single-language recognition uses the selected language code. Auto-detect and code-mix is a separate Prisma v3.0 option. Read-back language is independently selectable from the transcript language.

## Run locally

### Requirements

- Node.js 20.9 or newer
- npm
- A Gnani AI API key for Prisma transcription and Timbre playback
- A modern browser with microphone and audio playback support for voice recording; the synthetic sample and typed-report flow do not require microphone access

### Setup

```bash
npm install
```

Create `.env.local` in the project root with your server-side key:

```dotenv
GNANI_API_KEY=your_gnani_api_key
```

Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is occupied, Next.js will report another available port.

The key is read only by server routes. Never add it to client-side code, commit `.env.local`, or place it in a public deployment variable. `.env.example` shows the required variable name without a real key.

## Deploy

SHRAVAN can be deployed to a Node.js host that supports the Next.js App Router. Configure `GNANI_API_KEY` as a server-side deployment secret, then build and run the production app:

```bash
npm run build
npm start
```

Use HTTPS for microphone access on deployed sites. Do not commit deployment secrets. A public multi-instance deployment should replace the in-memory request limiter with a shared service.

## API routes

- `POST /api/transcribe` accepts multipart form data with `audio`, a supported `language`, and an optional `mode` (`single-language` or `auto-codemix`). It validates audio and language inputs, calls the selected Prisma path, and returns the transcript plus model and language metadata when available.
- `POST /api/speak` accepts JSON containing `text` and a supported output `language`. The server chooses the Timbre voice from the language registry and returns WAV audio. Arbitrary voice names are not accepted from the browser.

Both routes require `GNANI_API_KEY`. Speech requests have basic in-memory rate limiting; transcription also enforces an 8 MB audio limit. If Gnani is unavailable or unconfigured, residents can still type, edit, and save reports locally.

## Data, privacy, and prototype limits

- Drafts and up to ten saved reports are stored in browser `localStorage`; they are not synchronized to a server or shared across browsers/devices.
- Audio recordings are not saved with reports. The browser sends audio to Gnani only after the resident requests transcription.
- Text is sent to Gnani when the resident requests Timbre playback. Avoid entering sensitive personal information in a report.
- Clearing browser data can erase local drafts and reports. There are no user accounts, shared database, authority connection, or official tracking number.
- The report reference is a local demo identifier, not a government case number. Sharing is a manual resident handoff and is not a civic submission.
- Rate limits are held in memory per server process. They are best-effort for a prototype; a public multi-instance deployment should use a shared rate limiter.
- The project does not make urgency, eligibility, or authority-routing decisions, and it does not integrate Evon.

## Tech stack

- Next.js 15 App Router
- React 19 and TypeScript
- Custom responsive CSS and browser media/audio APIs
- Browser `localStorage` for demo drafts and reports
- Gnani AI Prisma v2.5, Prisma v3.0, and Timbre v2.5 through server-side API routes

## Challenge post and submission

For the public demo post, attach a video showing the app working, tag Gnani AI's official account, and include both required hashtags: `#GnaniAI` and `#GreatIndianAIInternshipChallenge`. The submission is separate from the social post and should identify the models actually used, explain the project, and describe each contributor's work. Do not claim Evon or civic-authority submission as part of this demo.
