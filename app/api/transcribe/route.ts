import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GNANI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Speech service is not configured yet.' }, { status: 503 });

  try {
    const incoming = await request.formData();
    const audio = incoming.get('audio');
    const language = incoming.get('language');
    if (!(audio instanceof File) || typeof language !== 'string') {
      return NextResponse.json({ error: 'Please record a complaint and choose a language.' }, { status: 400 });
    }
    if (audio.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Audio must be smaller than 8 MB.' }, { status: 413 });
    if (!['hi-IN', 'en-IN'].includes(language)) return NextResponse.json({ error: 'Choose Hindi or English.' }, { status: 400 });

    const payload = new FormData();
    payload.append('audio_file', audio, audio.name || 'complaint.webm');
    payload.append('language_code', language);
    const response = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST', headers: { 'X-API-Key-ID': apiKey }, body: payload, signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) {
      console.error('Gnani Prisma request failed:', response.status);
      return NextResponse.json({ error: response.status === 429 ? 'Speech service is busy. Please try again shortly.' : 'Could not transcribe that recording. Please try again.' }, { status: response.status === 429 ? 429 : 502 });
    }
    const result = await response.json();
    if (!result.success || typeof result.transcript !== 'string') return NextResponse.json({ error: 'No speech was recognized. Try recording again.' }, { status: 422 });
    return NextResponse.json({ transcript: result.transcript });
  } catch (error) {
    console.error('Transcription request failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'Speech service could not be reached. Please try again.' }, { status: 502 });
  }
}
