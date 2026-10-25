'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardShell } from '../../components/WizardShell';
import { useReports } from '../../components/ReportProvider';

async function toWav(blob: Blob): Promise<Blob> {
  const context = new AudioContext();
  try {
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    const channels = buffer.numberOfChannels;
    const frames = buffer.length;
    const wav = new ArrayBuffer(44 + frames * channels * 2);
    const view = new DataView(wav);
    const write = (offset: number, value: string) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
    write(0, 'RIFF'); view.setUint32(4, 36 + frames * channels * 2, true); write(8, 'WAVE');
    write(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, channels, true); view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * channels * 2, true); view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, frames * channels * 2, true);
    const data = Array.from({ length: channels }, (_, index) => buffer.getChannelData(index));
    let offset = 44;
    for (let frame = 0; frame < frames; frame++) for (let channel = 0; channel < channels; channel++) {
      const sample = Math.max(-1, Math.min(1, data[channel][frame]));
      view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true); offset += 2;
    }
    return new Blob([wav], { type: 'audio/wav' });
  } finally { await context.close(); }
}

export default function VoicePage() {
  const router = useRouter();
  const { draft, setDraft } = useReports();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds(value => Math.min(value + 1, 60)), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);
  useEffect(() => {
    if (recording && seconds >= 60) recorderRef.current?.stop();
  }, [recording, seconds]);
  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  async function startRecording() {
    setNotice(''); setAudioBlob(null); setSeconds(0);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('This browser cannot access a microphone. You can type your report instead.');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const recorded = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(recorded); setRecording(false);
        stream.getTracks().forEach(track => track.stop()); streamRef.current = null;
      };
      recorderRef.current = recorder; recorder.start(); setRecording(true);
    } catch (error) {
      setNotice(error instanceof Error && error.name === 'NotAllowedError' ? 'Microphone permission was denied. Allow access in your browser settings, or type the report below.' : error instanceof Error ? error.message : 'Could not access the microphone. You can type your report instead.');
    }
  }

  async function transcribe() {
    if (!audioBlob) return;
    setBusy(true); setNotice('');
    try {
      const wav = await toWav(audioBlob);
      const data = new FormData(); data.append('audio', wav, 'complaint.wav'); data.append('language', draft.language);
      const response = await fetch('/api/transcribe', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Transcription failed. You can still type your report.');
      setDraft({ transcript: result.transcript }); setNotice('Transcript ready. Review and edit it before you continue.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not transcribe this recording. You can type your report instead.'); }
    finally { setBusy(false); }
  }

  function continueToDetails() {
    if (!draft.transcript.trim()) { setNotice('Speak or type a short description before continuing.'); return; }
    router.push('/report/details');
  }

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return <WizardShell step={1}><div className="wizard-content">
    <div className="form-intro"><span className="form-icon" aria-hidden="true">◖))</span><div><h2>Tell us what happened</h2><p>Choose a language, then speak or type what needs attention.</p></div></div>
    <fieldset className="language-fieldset"><legend>Choose your language</legend><div className="language-options">
      <button type="button" className={draft.language === 'hi-IN' ? 'language-option selected' : 'language-option'} aria-pressed={draft.language === 'hi-IN'} onClick={() => setDraft({ language: 'hi-IN' })}><span className="language-glyph">अ</span><span><b>हिन्दी</b><small>Hindi</small></span><span className="option-check" aria-hidden="true">✓</span></button>
      <button type="button" className={draft.language === 'en-IN' ? 'language-option selected' : 'language-option'} aria-pressed={draft.language === 'en-IN'} onClick={() => setDraft({ language: 'en-IN' })}><span className="language-glyph">A</span><span><b>English</b><small>Indian English</small></span><span className="option-check" aria-hidden="true">✓</span></button>
    </div></fieldset>
    <div className="record-panel"><div className="record-top"><div><b>{recording ? 'Listening to your report' : audioBlob ? 'Recording ready to transcribe' : 'Record a voice note'}</b><small>{recording ? 'Speak clearly, then stop when you’re done.' : 'Keep it short and focus on the issue.'}</small></div><span className={recording ? 'recording-indicator on' : 'recording-indicator'}>{recording && <i/>}{recording ? 'RECORDING' : 'MAX 60 SEC'}</span></div>
      <div className="recorder-controls"><button type="button" className={recording ? 'mic-button stop' : 'mic-button'} onClick={recording ? () => recorderRef.current?.stop() : startRecording} aria-label={recording ? 'Stop recording' : 'Start voice recording'}>{recording ? <span aria-hidden="true">■</span> : <span aria-hidden="true">●</span>}</button><div className="audio-meter" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><time aria-live="off">{time}</time></div>
      {audioBlob && <div className="record-actions"><span><span className="inline-check" aria-hidden="true">✓</span> Recording captured</span><button type="button" className="text-action" onClick={startRecording}>Record again</button><button type="button" className="button button-soft" onClick={transcribe} disabled={busy}>{busy ? <><span className="spinner"/> Transcribing…</> : 'Transcribe with Prisma'}</button></div>}
    </div>
    <div className="or-divider"><span>OR TYPE YOUR REPORT</span></div>
    <label className="field-label" htmlFor="report-text">Describe the issue <span>{draft.transcript.length}/500</span></label>
    <textarea className="text-area" id="report-text" maxLength={500} value={draft.transcript} onChange={event => setDraft({ transcript: event.target.value })} placeholder={draft.language === 'hi-IN' ? 'उदाहरण: हमारे मोहल्ले में पार्क के पास सड़क पर बड़ा गड्ढा है…' : 'Example: There is a large pothole near the park on our street…'} />
    {notice && <p className="form-notice" role="status">{notice}</p>}
    <div className="wizard-actions"><span className="step-hint">Step 1 of 3</span><button className="button button-primary" type="button" onClick={continueToDetails}>Continue <span aria-hidden="true">→</span></button></div>
  </div></WizardShell>;
}
