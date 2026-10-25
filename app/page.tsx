'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReports } from './components/ReportProvider';

export default function Home() {
  const router = useRouter();
  const { reports, draft, hydrated, clearDraft } = useReports();
  const hasDraft = hydrated && Boolean(draft.transcript.trim());

  function startFresh() {
    if (!window.confirm('Discard this unfinished draft and start a new report?')) return;
    clearDraft();
    router.push('/report/voice');
  }

  return <main id="top" className="home-page">
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot"/> VOICE-FIRST CIVIC REPORTING</p>
        <h1>Report a local issue.<br/><em>Speak your way.</em></h1>
        <p className="hero-description">Describe a pothole, broken streetlight, or water issue in Hindi or English. Review the transcript, add a public landmark, and save a demo reference on this device.</p>
        <div className="hero-actions"><Link className="button button-primary" href="/report/voice">{hasDraft ? 'Continue your report' : 'Start a report'} <span aria-hidden="true">→</span></Link><Link className="button button-secondary" href="/reports">My reports <span className="button-count">{hydrated ? reports.length : '—'}</span></Link></div>
        {hasDraft && <button className="fresh-start-link" type="button" onClick={startFresh}>Discard this draft and start fresh</button>}
        <p className="hero-trust"><span aria-hidden="true">◈</span> Demo reports stay in this browser; nothing is sent to an authority.</p>
      </div>
      <div className="hero-visual" role="img" aria-label="Illustrated neighborhood with a fictional pothole report example">
        <div className="visual-sun"/><div className="visual-cloud cloud-a"/><div className="visual-cloud cloud-b"/>
        <div className="visual-hill hill-a"/><div className="visual-hill hill-b"/>
        <div className="visual-house house-a"><span className="house-roof"/><span className="house-wall"><i/><b/></span></div>
        <div className="visual-house house-b"><span className="house-roof"/><span className="house-wall"><i/><b/></span></div>
        <div className="visual-tree tree-a"><i/><b/></div><div className="visual-tree tree-b"><i/><b/></div>
        <div className="visual-path"/><div className="visual-path-mark"/>
        <div className="visual-note"><span className="visual-pin" aria-hidden="true">⌖</span><span><small>FICTIONAL EXAMPLE</small><b>Pothole near the public park</b><small>Hindi · Saved as a local demo</small></span></div>
        <div className="visual-caption">Your neighbourhood,<br/>one report at a time.</div>
      </div>
    </section>

    <section className="home-how" aria-labelledby="how-heading"><div className="how-heading"><p className="eyebrow">THOUGHTFUL AND SIMPLE</p><h2 id="how-heading">Your voice, step by step.</h2></div><div className="how-item"><span className="how-number">01</span><span className="how-icon" aria-hidden="true">◖))</span><div><b>Speak naturally</b><small>Describe the issue in Hindi or English.</small></div></div><div className="how-item"><span className="how-number">02</span><span className="how-icon" aria-hidden="true">✎</span><div><b>Review your words</b><small>Edit the transcript and add a landmark.</small></div></div><div className="how-item"><span className="how-number">03</span><span className="how-icon" aria-hidden="true">✓</span><div><b>Save on this device</b><small>Keep a reference you can come back to.</small></div></div></section>

    <section className="home-bottom"><div><p className="eyebrow">A DEMO FOR BETTER COMMUNITIES</p><h2>Everyday voices<br/>can make a difference.</h2><p>This is a local demo. Reports remain in this browser and are not delivered to a civic authority.</p></div><Link className="button button-primary" href="/report/voice">{hasDraft ? 'Continue your report' : 'Make a report'} <span aria-hidden="true">→</span></Link></section>
  </main>;
}
