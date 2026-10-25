import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GNANI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Speech service is not configured yet.' }, { status: 503 });

  try {
    const body = await request.json();
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const language = body.language;
    if (!text || text.length > 500 || !['hi-IN', 'en-IN'].includes(language)) {
      return NextResponse.json({ error: 'Confirmation text or language is invalid.' }, { status: 400 });
    }
    const response = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
      method: 'POST',
      headers: { 'X-API-Key-ID': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text, model: 'timbre-v2.5', voice: language === 'hi-IN' ? 'Nalini' : 'Kaveri', language,
        audio_config: { encoding: 'linear_pcm', container: 'wav', num_channels: 1, sample_rate: 48000, sample_width: 2 },
      }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) {
      console.error('Gnani Timbre request failed:', response.status);
      return NextResponse.json({ error: 'Could not create the voice confirmation. Please try again.' }, { status: response.status === 429 ? 429 : 502 });
    }
    return new NextResponse(response.body, { headers: { 'Content-Type': response.headers.get('Content-Type') || 'audio/wav', 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Speech synthesis request failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'Speech service could not be reached. Please try again.' }, { status: 502 });
  }
}
