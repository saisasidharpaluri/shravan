import { NextRequest, NextResponse } from 'next/server';
import { checkSpeechRateLimit } from '../_lib/rateLimit';
import { getLanguage, isSupportedLanguage } from '../../lib/languages';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GNANI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Gnani speech is not configured. You can still type and save a demo report.' }, { status: 503 });

  const limit = checkSpeechRateLimit(request);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many speech requests. Please wait a few minutes or type your report.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 8 * 1024 * 1024 + 128 * 1024) return NextResponse.json({ error: 'Audio must be smaller than 8 MB.' }, { status: 413 });

  try {
    const incoming = await request.formData();
    const audio = incoming.get('audio');
    const language = incoming.get('language');
    if (!(audio instanceof File) || typeof language !== 'string') {
      return NextResponse.json({ error: 'Please record a complaint and choose a language.' }, { status: 400 });
    }
    if (!audio.type.startsWith('audio/')) return NextResponse.json({ error: 'Please upload a valid audio recording.' }, { status: 415 });
    if (audio.size < 1200) return NextResponse.json({ error: 'The recording sounds empty. Please record again or type your report.' }, { status: 422 });
    if (audio.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Audio must be smaller than 8 MB.' }, { status: 413 });
    if (!isSupportedLanguage(language)) return NextResponse.json({ error: 'Choose Hindi or English.' }, { status: 400 });
    const selectedLanguage = getLanguage(language);

    const payload = new FormData();
    payload.append('audio_file', audio, audio.name || 'complaint.wav');
    payload.append('language_code', selectedLanguage.sttLanguage);
    const response = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST', headers: { 'X-API-Key-ID': apiKey }, body: payload, signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) {
      console.error('Gnani Prisma request failed:', response.status);
      return NextResponse.json({ error: response.status === 429 ? 'Speech service is busy. Please try again shortly.' : 'Could not transcribe that recording. Please try again.' }, { status: response.status === 429 ? 429 : 502 });
    }
    const result = await response.json();
    if (!result.success || typeof result.transcript !== 'string' || !result.transcript.trim()) {
      return NextResponse.json({ error: 'No clear speech was recognized. Try a new recording or type your report.' }, { status: 422 });
    }
    return NextResponse.json({ transcript: result.transcript });
  } catch (error) {
    console.error('Transcription request failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'Speech service could not be reached. Please try again or type your report.' }, { status: 502 });
  }
}
