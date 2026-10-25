'use client';

import Link from 'next/link';
import { useReports } from './components/ReportProvider';

export default function Home() {
  const { reports, hydrated } = useReports();
  return <main id="top" className="home-page">
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot"/> CIVIC REPORTING, MADE SIMPLE</p>
        <h1>Good neighbourhoods<br/>start with <em>a voice.</em></h1>
        <p className="hero-description">Notice something that needs fixing? Tell us in your own words, review the details, and save a report in a few simple steps.</p>
        <div className="hero-actions"><Link className="button button-primary" href="/report/voice">Start a report <span aria-hidden="true">→</span></Link><Link className="button button-secondary" href="/reports">View my reports <span className="button-count">{hydrated ? reports.length : '—'}</span></Link></div>
        <p className="hero-trust"><span aria-hidden="true">◈</span> Speak in Hindi or English · Review everything before saving</p>
      </div>
      <div className="hero-visual" aria-label="Illustration of a neighbourhood where residents are helping each other">
        <div className="visual-sun"/><div className="visual-cloud cloud-a"/><div className="visual-cloud cloud-b"/>
        <div className="visual-hill hill-a"/><div className="visual-hill hill-b"/>
        <div className="visual-house house-a"><span className="house-roof"/><span className="house-wall"><i/><b/></span></div>
        <div className="visual-house house-b"><span className="house-roof"/><span className="house-wall"><i/><b/></span></div>
        <div className="visual-tree tree-a"><i/><b/></div><div className="visual-tree tree-b"><i/><b/></div>
        <div className="visual-path"/><div className="visual-path-mark"/>
        <div className="visual-note"><span className="visual-pin" aria-hidden="true">⌖</span><span><b>Your neighbourhood</b><small>One thoughtful report at a time</small></span></div>
        <div className="visual-caption">A little attention<br/>goes a long way.</div>
      </div>
    </section>

    <section className="home-how" aria-labelledby="how-heading"><div className="how-heading"><p className="eyebrow">THOUGHTFUL AND SIMPLE</p><h2 id="how-heading">Your voice, step by step.</h2></div><div className="how-item"><span className="how-number">01</span><span className="how-icon" aria-hidden="true">◖))</span><div><b>Speak naturally</b><small>Describe the issue in Hindi or English.</small></div></div><div className="how-item"><span className="how-number">02</span><span className="how-icon" aria-hidden="true">✎</span><div><b>Review your words</b><small>Edit the transcript and add a landmark.</small></div></div><div className="how-item"><span className="how-number">03</span><span className="how-icon" aria-hidden="true">✓</span><div><b>Save on this device</b><small>Keep a reference you can come back to.</small></div></div></section>

    <section className="home-bottom"><div><p className="eyebrow">A DEMO FOR BETTER COMMUNITIES</p><h2>Everyday voices<br/>can make a difference.</h2><p>This project demonstrates voice-first civic reporting. Your demo reports stay in this browser and aren’t sent to a civic authority.</p></div><Link className="button button-primary" href="/report/voice">Make a report <span aria-hidden="true">→</span></Link></section>
  </main>;
}
