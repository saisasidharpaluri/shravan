'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReports } from './components/ReportProvider';
import { HomeIllustration } from './components/HomeIllustration';
import { Icon } from './components/Icon';

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
        <p className="eyebrow"><span className="eyebrow-dot"/> VOICE-FIRST · HINDI + ENGLISH</p>
        <h1>Local issues<br/><em>deserve to be heard.</em></h1>
        <p className="hero-description">Speak or type about a pothole, water issue, or broken streetlight. Review every detail, then save a private demo reference on this device.</p>
        <div className="hero-actions"><Link className="button button-primary" href="/report/voice">{hasDraft ? 'Continue your report' : 'Start a voice report'} <span aria-hidden="true">→</span></Link><Link className="button button-secondary" href="/reports">My reports <span className="button-count">{hydrated ? reports.length : '—'}</span></Link></div>
        {hasDraft && <button className="fresh-start-link" type="button" onClick={startFresh}>Discard this draft and start fresh</button>}
        <div className="hero-assurances"><span><b aria-hidden="true"><Icon name="check"/></b> Hindi and English</span><span><b aria-hidden="true"><Icon name="check"/></b> Review before saving</span></div>
        <p className="hero-trust"><span aria-hidden="true"><Icon name="privacy"/></span> Demo only · Nothing is sent to a civic authority.</p>
      </div>
      <div className="hero-visual"><HomeIllustration /></div>
    </section>

    <section className="home-how" aria-labelledby="how-heading"><div className="how-heading"><p className="eyebrow">A CLEAR, RESIDENT-LED FLOW</p><h2 id="how-heading">From voice to a reviewed report.</h2></div><div className="how-item"><span className="how-number">01</span><span className="how-icon"><Icon name="voice"/></span><div><b>Describe the issue</b><small>Speak or type in Hindi or English.</small></div></div><div className="how-item"><span className="how-number">02</span><span className="how-icon"><Icon name="edit"/></span><div><b>Add local context</b><small>Choose an issue type and public landmark.</small></div></div><div className="how-item"><span className="how-number">03</span><span className="how-icon"><Icon name="check"/></span><div><b>Save your demo</b><small>Review it and keep a local reference.</small></div></div></section>

    <section className="home-bottom"><div><p className="eyebrow">A DEMO FOR BETTER COMMUNITIES</p><h2>Everyday voices<br/>can make a difference.</h2><p>This is a local demo. Reports remain in this browser and are not delivered to a civic authority.</p></div><Link className="button button-primary" href="/report/voice">{hasDraft ? 'Continue your report' : 'Make a report'} <span aria-hidden="true">→</span></Link></section>
  </main>;
}
