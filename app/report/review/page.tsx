'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WizardShell } from '../../components/WizardShell';
import { useReports } from '../../components/ReportProvider';

export default function ReviewPage() {
  const router = useRouter();
  const { draft, setDraft, hydrated, saveReport } = useReports();
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (hydrated && !draft.transcript.trim()) router.replace('/report/voice'); }, [hydrated, draft.transcript, router]);
  if (!hydrated || !draft.transcript.trim()) return <main className="route-loading" aria-live="polite">Opening your report…</main>;

  function submit() {
    const transcript = draft.transcript.trim();
    if (!transcript) { setNotice('Add a short description before saving.'); return; }
    if (transcript.length > 500) { setNotice('Keep the description under 500 characters.'); return; }
    setSaving(true);
    try {
      const report = saveReport();
      router.replace(`/reports/${encodeURIComponent(report.id)}`);
    } catch {
      setSaving(false); setNotice('This browser could not save the report. Check available storage and try again.');
    }
  }

  return <WizardShell step={3}><div className="wizard-content">
    <div className="form-intro"><span className="form-icon" aria-hidden="true">✓</span><div><h2>Review before saving</h2><p>Make sure everything looks right. Your report stays on this device.</p></div></div>
    <div className="review-language"><span className="review-language-icon" aria-hidden="true">{draft.language === 'hi-IN' ? 'अ' : 'A'}</span><div><small>REPORT LANGUAGE</small><b>{draft.language === 'hi-IN' ? 'हिन्दी · Hindi' : 'English · India'}</b></div><Link href="/report/voice">Change</Link></div>
    <div className="review-field"><div className="review-field-heading"><label htmlFor="review-transcript">Your description</label><span>{draft.transcript.length}/500</span></div><textarea className="text-area review-area" id="review-transcript" maxLength={500} value={draft.transcript} onChange={event => setDraft({ transcript: event.target.value })}/></div>
    <div className="review-facts"><div><small>ISSUE TYPE</small><b><span aria-hidden="true">◈</span> {draft.category}</b><Link href="/report/details">Edit</Link></div><div><small>AREA OR LANDMARK</small><b><span aria-hidden="true">⌖</span> {draft.area || 'Not provided'}</b><Link href="/report/details">Edit</Link></div></div>
    <div className="review-privacy"><span aria-hidden="true">◈</span><p><b>Demo report, saved privately.</b> This report will be saved in this browser only. It won’t be sent to a civic authority.</p></div>
    {notice && <p className="form-notice" role="alert">{notice}</p>}
    <div className="wizard-actions"><Link className="button button-secondary" href="/report/details"><span aria-hidden="true">←</span> Back</Link><span className="step-hint">Step 3 of 3</span><button className="button button-primary" type="button" onClick={submit} disabled={saving}>{saving ? <><span className="spinner"/> Saving…</> : <>Save my report <span aria-hidden="true">✓</span></>}</button></div>
  </div></WizardShell>;
}
