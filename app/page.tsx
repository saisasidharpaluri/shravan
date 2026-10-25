'use client';

import { useEffect, useRef, useState } from 'react';

type SavedReport = { id: string; transcript: string; category: string; area: string; language: string; createdAt: string };

const categories = ['Roads & potholes', 'Waste & cleanliness', 'Water supply', 'Streetlights', 'Drainage', 'Other'];
const reportKey = 'shravan-demo-reports-v1';

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
    const channelData = Array.from({ length: channels }, (_, index) => buffer.getChannelData(index));
    let offset = 44;
    for (let frame = 0; frame < frames; frame++) for (let channel = 0; channel < channels; channel++) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][frame]));
      view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true); offset += 2;
    }
    return new Blob([wav], { type: 'audio/wav' });
  } finally { await context.close(); }
}

export default function Home() {
  const [language, setLanguage] = useState('hi-IN');
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [area, setArea] = useState('');
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [busy, setBusy] = useState<'transcribe' | 'submit' | 'speak' | null>(null);
  const [notice, setNotice] = useState('');
  const [submitted, setSubmitted] = useState<SavedReport | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    try { setReports(JSON.parse(localStorage.getItem(reportKey) || '[]')); } catch { setReports([]); }
  }, []);
  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds(value => {
      if (value >= 59) { recorderRef.current?.stop(); return 60; }
      return value + 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  async function startRecording() {
    setNotice(''); setAudioBlob(null); setTranscript(''); setSubmitted(null); setSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const recorded = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(recorded); stream.getTracks().forEach(track => track.stop()); setRecording(false);
      };
      recorderRef.current = recorder; recorder.start(); setRecording(true);
    } catch { setNotice('Microphone access is needed to record a report. You can also type the complaint below.'); }
  }

  async function transcribe() {
    if (!audioBlob) return;
    setBusy('transcribe'); setNotice('');
    try {
      const wav = await toWav(audioBlob);
      const data = new FormData(); data.append('audio', wav, 'complaint.wav'); data.append('language', language);
      const response = await fetch('/api/transcribe', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Transcription failed.');
      setTranscript(result.transcript); setNotice('Transcript ready. Please check it before submitting.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not transcribe this recording. You can type your report instead.'); }
    finally { setBusy(null); }
  }

  function submitReport() {
    if (!transcript.trim()) { setNotice('Add a short description before submitting.'); return; }
    if (transcript.length > 500) { setNotice('Keep the report under 500 characters.'); return; }
    setBusy('submit');
    const report: SavedReport = { id: `SHR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, transcript: transcript.trim(), category, area: area.trim(), language, createdAt: new Date().toISOString() };
    const next = [report, ...reports].slice(0, 10);
    localStorage.setItem(reportKey, JSON.stringify(next)); setReports(next); setSubmitted(report); setBusy(null);
    setNotice('Demo report saved on this device. It has not been sent to a civic authority.');
  }

  async function playConfirmation() {
    if (!submitted) return;
    setBusy('speak'); setNotice('');
    try {
      const response = await fetch('/api/speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: language === 'hi-IN' ? `आपकी शिकायत दर्ज हो गई है। संदर्भ संख्या ${submitted.id} है।` : `Your report is saved. Your reference number is ${submitted.id}.`, language }) });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'Could not create voice confirmation.'); }
      const url = URL.createObjectURL(await response.blob()); const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url); await audio.play();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not play the voice confirmation.'); }
    finally { setBusy(null); }
  }

  const minute = String(Math.floor(seconds / 60)).padStart(2, '0');
  const second = String(seconds % 60).padStart(2, '0');

  return <main className="page-shell">
    <header className="topbar"><a className="wordmark" href="#top" aria-label="Shravan home"><span className="mark">श</span><span>shravan</span></a><span className="top-note">A voice for your neighbourhood</span><a className="language-link" href="#report">Start a report <span>↗</span></a></header>
    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow"><span className="live-dot"/> CIVIC REPORTING, MADE SIMPLE</p><h1>Small issues.<br/><em>Stronger</em> communities.</h1><p className="hero-text">Tell us what needs fixing in your neighbourhood. Speak naturally, review your report, and save it in a few simple steps.</p><a className="primary-link" href="#report">Make a report <span>↓</span></a><div className="hero-foot"><span className="sound-mark">◖))</span><span>Speak in Hindi or English<br/><strong>Your words stay yours to review</strong></span></div></div>
      <div className="hero-art" aria-label="Illustration of a neighbourhood street"><div className="sun"/><div className="cloud cloud-one"/><div className="cloud cloud-two"/><div className="hill hill-back"/><div className="hill hill-front"/><div className="house house-one"><i/><b/><span/></div><div className="house house-two"><i/><b/><span/></div><div className="tree tree-one"><i/><b/></div><div className="tree tree-two"><i/><b/></div><div className="road"/><div className="road-line"/><div className="pin-card"><span className="pin-icon">⌖</span><span><b>Your neighbourhood</b><small>Better, one report at a time</small></span></div><div className="art-caption">A little attention<br/>goes a long way.</div></div>
    </section>
    <section className="steps" aria-label="How it works"><div className="steps-title"><span>01 — 03</span><h2>Clear as a conversation.</h2></div><div className="step"><b>01</b><span className="step-icon">◉</span><strong>Speak</strong><small>Tell us what you noticed.</small></div><div className="step"><b>02</b><span className="step-icon">✎</span><strong>Review</strong><small>Check the transcript and details.</small></div><div className="step"><b>03</b><span className="step-icon">↗</span><strong>Save</strong><small>Keep a reference on your device.</small></div></section>

    <section className="report-section" id="report"><div className="section-heading"><div><p className="eyebrow">YOUR COMMUNITY, YOUR VOICE</p><h2>What needs attention?</h2></div><span className="demo-badge">DEMO PROJECT</span></div><div className="report-grid"><div className="form-card">
      <div className="field-head"><label htmlFor="language">1. Choose your language</label><span>आपकी भाषा</span></div><div className="language-picker"><button className={language === 'hi-IN' ? 'choice active' : 'choice'} onClick={() => setLanguage('hi-IN')} type="button"><span>अ</span> हिन्दी <b>✓</b></button><button className={language === 'en-IN' ? 'choice active' : 'choice'} onClick={() => setLanguage('en-IN')} type="button"><span>A</span> English <b>✓</b></button></div>
      <div className="field-head record-label"><label>2. Tell us about the issue</label><span>Up to 60 seconds</span></div><div className="record-box"><button className={recording ? 'record-button recording' : 'record-button'} onClick={recording ? () => recorderRef.current?.stop() : startRecording} type="button" aria-label={recording ? 'Stop recording' : 'Start recording'}><span>{recording ? '■' : '●'}</span></button><div className="record-info"><strong>{recording ? 'Listening…' : audioBlob ? 'Recording ready' : 'Tap to start speaking'}</strong><small>{recording ? 'Tap the square to finish' : audioBlob ? 'You can record again if needed' : 'Find a quiet spot and speak clearly'}</small></div><time>{minute}:{second}</time></div>
      {audioBlob && <button className="text-button transcribe-button" onClick={transcribe} disabled={busy !== null}>{busy === 'transcribe' ? 'Preparing your transcript…' : 'Transcribe with Gnani Prisma →'}</button>}
      <div className="field-head transcript-head"><label htmlFor="transcript">3. Review your description</label><span>{transcript.length}/500</span></div><textarea id="transcript" maxLength={500} value={transcript} onChange={event => setTranscript(event.target.value)} placeholder={language === 'hi-IN' ? 'बोलने के बाद आपकी शिकायत यहाँ दिखाई देगी… आप इसे संपादित कर सकते हैं।' : 'Your words will appear here after transcription. You can edit them.'}/>
      <div className="two-fields"><div><label htmlFor="category">Issue type</label><select id="category" value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></div><div><label htmlFor="area">Area or landmark <span>(optional)</span></label><input id="area" value={area} onChange={event => setArea(event.target.value)} maxLength={80} placeholder="e.g. near the public park"/></div></div>
      <button className="submit-button" disabled={busy !== null} onClick={submitReport}>{busy === 'submit' ? 'Saving…' : 'Review and save report'}<span>↗</span></button>
      {notice && <p className={submitted ? 'notice success' : 'notice'} role="status">{notice}</p>}
      <p className="privacy-note"><span>◈</span> Demo reports are saved only in this browser. Do not include personal or sensitive information.</p>
      {submitted && <div className="confirmation"><div><span className="success-check">✓</span><div><strong>Report saved</strong><small>Reference <b>{submitted.id}</b></small></div></div><button className="text-button" onClick={playConfirmation} disabled={busy !== null}>{busy === 'speak' ? 'Creating voice…' : '▶ Hear confirmation'}</button></div>}
      </div><aside className="side-note"><div className="quote-mark">“</div><blockquote>Everyday voices can help make everyday places better.</blockquote><div className="side-rule"/><p>SHRAVAN makes civic reporting easier for people who would rather speak than type.</p><div className="side-illustration"><div className="side-sun"/><span className="side-home">⌂</span><span className="side-leaf">✳</span><span className="side-line"/></div><small>Built for the Great Indian AI Internship Challenge</small></aside></div></section>

    <section className="recent-section"><div className="section-heading recent-heading"><div><p className="eyebrow">ON THIS DEVICE</p><h2>Your recent reports</h2></div><span className="local-label">PRIVATE TO THIS BROWSER</span></div>{reports.length ? <div className="reports-list">{reports.slice(0, 4).map(report => <article className="report-row" key={report.id}><span className="report-category-icon">⌖</span><div className="report-detail"><strong>{report.category}</strong><p>{report.transcript}</p><small>{report.area || 'Area not provided'} · {new Date(report.createdAt).toLocaleDateString()}</small></div><span className="report-ref">{report.id}</span></article>)}</div> : <div className="empty-reports"><span>⌖</span><p>Your saved reports will appear here.</p><small>They stay in this browser for the demo.</small></div>}</section>
    <footer><a className="wordmark" href="#top"><span className="mark">श</span><span>shravan</span></a><span>Made for neighbourhoods that care.</span><a href="#top">Back to top ↑</a></footer>
  </main>;
}
