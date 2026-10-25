'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WizardShell } from '../../components/WizardShell';
import { useReports } from '../../components/ReportProvider';

const categories = [
  { name: 'Roads & potholes', icon: '↗', detail: 'Roads, footpaths and traffic' },
  { name: 'Waste & cleanliness', icon: '♻', detail: 'Litter, bins and public spaces' },
  { name: 'Water supply', icon: '◒', detail: 'Leaks, taps and water access' },
  { name: 'Streetlights', icon: '☼', detail: 'Lights and electrical issues' },
  { name: 'Drainage', icon: '≋', detail: 'Drains and waterlogging' },
  { name: 'Other', icon: '＋', detail: 'Something else nearby' },
];

export default function DetailsPage() {
  const router = useRouter();
  const { draft, setDraft, hydrated } = useReports();
  useEffect(() => { if (hydrated && !draft.transcript.trim()) router.replace('/report/voice'); }, [hydrated, draft.transcript, router]);
  if (!hydrated || !draft.transcript.trim()) return <main className="route-loading" aria-live="polite">Opening your report…</main>;

  return <WizardShell step={2}><div className="wizard-content">
    <div className="form-intro"><span className="form-icon" aria-hidden="true">⌖</span><div><h2>Add a few details</h2><p>This helps describe the issue. An approximate area is enough.</p></div></div>
    <fieldset className="category-fieldset"><legend>What kind of issue is it?</legend><div className="category-grid">
      {categories.map(item => <button key={item.name} type="button" className={draft.category === item.name ? 'category-option selected' : 'category-option'} aria-pressed={draft.category === item.name} onClick={() => setDraft({ category: item.name })}><span className="category-icon" aria-hidden="true">{item.icon}</span><span className="category-copy"><b>{item.name}</b><small>{item.detail}</small></span><span className="category-check" aria-hidden="true">✓</span></button>)}
    </div></fieldset>
    <div className="location-field"><label className="field-label" htmlFor="area">Nearby area or landmark <span>OPTIONAL</span></label><p className="field-help">A neighbourhood, street, or public place is useful. Please don’t enter a home address.</p><div className="input-with-icon"><span aria-hidden="true">⌖</span><input id="area" type="text" maxLength={80} value={draft.area} onChange={event => setDraft({ area: event.target.value })} placeholder="e.g. near the public park"/><small>{draft.area.length}/80</small></div></div>
    <div className="selected-summary"><span className="summary-bubble" aria-hidden="true">“</span><div><small>YOUR DESCRIPTION</small><p lang={draft.transcriptionLanguage === 'hi-IN' || (!draft.transcriptionLanguage && draft.language === 'hi-IN') ? 'hi' : 'en-IN'}>{draft.transcript}</p><Link href="/report/voice">Edit description</Link></div></div>
    <div className="wizard-actions"><Link className="button button-secondary" href="/report/voice"><span aria-hidden="true">←</span> Back</Link><span className="step-hint">Step 2 of 3</span><Link className="button button-primary" href="/report/review">Review report <span aria-hidden="true">→</span></Link></div>
  </div></WizardShell>;
}
