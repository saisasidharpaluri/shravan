import type { Language } from './languages';

export async function speakWithTimbre(text: string, language: Language): Promise<void> {
  const response = await fetch('/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(typeof result.error === 'string' ? result.error : 'Gnani voice playback is unavailable.');
  }

  const url = URL.createObjectURL(await response.blob());
  const audio = new Audio(url);
  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      URL.revokeObjectURL(url);
      audio.onended = null;
      audio.onerror = null;
    };
    audio.onended = () => { cleanup(); resolve(); };
    audio.onerror = () => { cleanup(); reject(new Error('The generated audio could not be played.')); };
    audio.play().catch(error => {
      cleanup();
      reject(error instanceof Error ? error : new Error('Audio playback was blocked by the browser.'));
    });
  });
}
