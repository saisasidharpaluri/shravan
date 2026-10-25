'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardShell } from '../../components/WizardShell';
import { useReports } from '../../components/ReportProvider';
import { SUPPORTED_LANGUAGES, type Language } from '../../lib/languages';
import { Icon } from '../../components/Icon';

async function toWav(blob: Blob): Promise<Blob> {
  const context = new AudioContext();
  try {
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    const sampleRate = 16000;
    const frames = Math.ceil(buffer.duration * sampleRate);
    const wav = new ArrayBuffer(44 + frames * 2);
    const view = new DataView(wav);
    const write = (offset: number, value: string) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
    write(0, 'RIFF'); view.setUint32(4, 36 + frames * 2, true); write(8, 'WAVE');
    write(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true);
    view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, frames * 2, true);
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index));
    let offset = 44;
    for (let frame = 0; frame < frames; frame++) {
      const sourceFrame = Math.min(buffer.length - 1, Math.floor(frame * buffer.sampleRate / sampleRate));
      const sample = Math.max(-1, Math.min(1, channels.reduce((sum, channel) => sum + channel[sourceFrame], 0) / channels.length));
      view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
      offset += 2;
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
  const [audioUrl, setAudioUrl] = useState('');
  const [level, setLevel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | null>(null);

  function stopInputMonitoring() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (contextRef.current && contextRef.current.state !== 'closed') void contextRef.current.close();
    contextRef.current = null;
    setLevel(0);
  }

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds(value => Math.min(value + 1, 60)), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);
  useEffect(() => {
    if (recording && seconds >= 60 && recorderRef.current?.state === 'recording') recorderRef.current.stop();
  }, [recording, seconds]);
  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    stopInputMonitoring();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  async function startRecording() {
    setNotice(''); setPendingLanguage(null); setAudioBlob(null); setSeconds(0);
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(''); }
    let stream: MediaStream | null = null;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('This browser cannot access a microphone. You can type your report instead.');
      if (typeof MediaRecorder === 'undefined') throw new Error('This browser cannot record audio. You can type your report instead.');
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const context = new AudioContext();
      contextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const monitor = () => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (const sample of samples) { const normalized = (sample - 128) / 128; sum += normalized * normalized; }
        setLevel(Math.min(100, Math.round(Math.sqrt(sum / samples.length) * 300)));
        frameRef.current = requestAnimationFrame(monitor);
      };
      monitor();
      chunksRef.current = [];
      recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onerror = () => setNotice('The recording stopped unexpectedly. Please try again or type your report.');
      recorder.onstop = () => {
        const recorded = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (recorded.size > 0) {
          setAudioBlob(recorded);
          const url = URL.createObjectURL(recorded);
          setAudioUrl(url);
        } else setNotice('No audio was captured. Please record again or type your report.');
        setRecording(false);
        stopInputMonitoring();
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (error) {
      stream?.getTracks().forEach(track => track.stop());
      stopInputMonitoring();
      setRecording(false);
      const name = error instanceof Error ? error.name : '';
      setNotice(name === 'NotAllowedError' || name === 'PermissionDeniedError'
        ? 'Microphone permission was denied. Allow access in your browser settings, or type your report below.'
        : error instanceof Error ? error.message : 'Could not access the microphone. You can type your report instead.');
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
      setDraft({ transcript: result.transcript, transcriptionLanguage: draft.language });
      setNotice('Transcript ready. Review and edit it before continuing.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not transcribe this recording. You can type your report instead.'); }
    finally { setBusy(false); }
  }

  function chooseLanguage(language: Language) {
    if (language === draft.language) return;
    if (draft.transcript.trim() && draft.transcriptionLanguage && draft.transcriptionLanguage !== language) {
      setPendingLanguage(language);
      setNotice('This transcript stays in its original language. Confirm if you want to use a different language for new recordings.');
      return;
    }
    setDraft({ language });
    setPendingLanguage(null);
    setNotice('');
  }

  function confirmLanguageChange() {
    if (pendingLanguage) setDraft({ language: pendingLanguage });
    setPendingLanguage(null);
    setNotice('Your existing transcript has not been translated. New recordings will use the selected language.');
  }

  function discardRecording() {
    setAudioBlob(null);
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(''); }
    setNotice('Recording discarded. You can record again or type your report.');
  }

  function continueToDetails() {
    if (!draft.transcript.trim()) { setNotice('Speak or type a short description before continuing.'); return; }
    router.push('/report/details');
  }

  function updateTypedText(value: string) {
    setDraft({ transcript: value, transcriptionLanguage: null });
  }

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return <WizardShell step={1}><div className="wizard-content voice-content">
    <div className="form-intro"><span className="form-icon"><Icon name="voice"/></span><div><h2>Tell us what happened</h2><p>Start with a voice note, or type your description below.</p></div></div>
    <fieldset className="language-fieldset"><legend>Choose your language</legend><div className="language-options">
      {SUPPORTED_LANGUAGES.map(language => <button key={language.code} type="button" className={draft.language === language.code ? 'language-option selected' : 'language-option'} aria-pressed={draft.language === language.code} onClick={() => chooseLanguage(language.code)} disabled={recording || busy}><span className="language-glyph">{language.code === 'hi-IN' ? 'अ' : 'A'}</span><span><b>{language.nativeName}</b><small>{language.englishName}</small></span><span className="option-check"><Icon name="check"/></span></button>)}
    </div></fieldset>
    {pendingLanguage && <div className="language-change-confirm" role="alert"><span>Your current transcript will stay in {draft.transcriptionLanguage === 'hi-IN' ? 'Hindi' : 'English'}.</span><button type="button" className="text-action" onClick={confirmLanguageChange}>Change to {pendingLanguage === 'hi-IN' ? 'Hindi' : 'English'}</button><button type="button" className="text-action" onClick={() => setPendingLanguage(null)}>Keep current language</button></div>}
    <div className="record-panel"><div className="record-top"><div><b>{recording ? 'Listening to your report' : audioBlob ? 'Recording ready to review' : 'Record a voice note'}</b><small>{recording ? 'Speak clearly, then stop when you’re done.' : 'Up to 60 seconds · You can listen before transcribing.'}</small></div><span className={recording ? 'recording-indicator on' : 'recording-indicator'}>{recording && <i/>}{recording ? 'RECORDING' : 'MAX 60 SEC'}</span></div>
      <div className="recorder-controls"><button type="button" className={recording ? 'mic-button stop' : 'mic-button'} onClick={recording ? () => recorderRef.current?.stop() : startRecording} aria-label={recording ? 'Stop recording' : 'Start voice recording'}>{recording ? <Icon name="stop"/> : <MicIcon/>}</button><div className="audio-level-track" role="progressbar" aria-label="Microphone input level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={level}><span style={{ width: `${Math.max(5, level)}%` }}/></div><time aria-live="off">{time}</time></div>
      {audioUrl && <audio className="audio-preview" controls preload="metadata" src={audioUrl} aria-label="Play back your recording before transcription"/>}
      {audioBlob && <><div className="audio-privacy-note"><span><Icon name="privacy"/></span><p><b>Before transcription:</b> Your recording is sent to Gnani AI for speech recognition. It is not attached to your saved demo report.</p></div><div className="record-actions"><span><span className="inline-check"><Icon name="check"/></span> Recording captured</span><button type="button" className="text-action" onClick={startRecording} disabled={busy}>Record again</button><button type="button" className="text-action" onClick={discardRecording} disabled={busy}>Discard</button><button type="button" className="button button-soft" onClick={transcribe} disabled={busy}>{busy ? <><span className="spinner"/> Transcribing…</> : 'Transcribe with Prisma'}</button></div></>}
    </div>
    <div className="or-divider"><span>OR TYPE YOUR REPORT</span></div>
    <label className="field-label" htmlFor="report-text">Describe the issue <span>{draft.transcript.length}/500</span></label>
    <textarea className="text-area" id="report-text" lang={draft.language === 'hi-IN' ? 'hi' : 'en-IN'} maxLength={500} value={draft.transcript} onChange={event => updateTypedText(event.target.value)} placeholder={draft.language === 'hi-IN' ? 'उदाहरण: हमारे मोहल्ले में पार्क के पास सड़क पर बड़ा गड्ढा है…' : 'Example: There is a large pothole near the park on our street…'} />
    {notice && <p className="form-notice" role="status">{notice}</p>}
    <div className="wizard-actions"><span className="step-hint">Step 1 of 3</span><button className="button button-primary" type="button" onClick={continueToDetails}>Continue <span aria-hidden="true">→</span></button></div>
  </div></WizardShell>;
}

function MicIcon() {
  return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/></svg>;
}
