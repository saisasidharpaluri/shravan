'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useReports } from '../../components/ReportProvider';

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const { reports, hydrated } = useReports();
  const report = reports.find(item => item.id === id);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function playConfirmation() {
    if (!report) return;
    setBusy(true); setNotice('');
    try {
      const language = report.language === 'en-IN' ? 'en-IN' : 'hi-IN';
      const text = language === 'hi-IN' ? `आपकी शिकायत इस डेमो में सेव हो गई है। संदर्भ संख्या ${report.id} है।` : `Your report is saved on this device. Your reference number is ${report.id}.`;
      const response = await fetch('/api/speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, language }) });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'Voice confirmation is unavailable.'); }
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      audio.onerror = () => { URL.revokeObjectURL(url); setNotice('The confirmation audio could not be played.'); };
      await audio.play();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'The voice confirmation could not be created.'); }
    finally { setBusy(false); }
  }

  if (!hydrated) return <main className="route-loading">Opening your report…</main>;
  if (!report) return <main className="content-page missing-page"><span className="empty-icon" aria-hidden="true">⌖</span><p className="eyebrow">REPORT NOT FOUND</p><h1>This report isn’t on this device.</h1><p>Saved reports are stored in the browser where they were created.</p><Link className="button button-primary" href="/reports">Back to my reports</Link></main>;

  return <main id="top" className="content-page detail-page">
    <Link href="/reports" className="back-link"><span aria-hidden="true">←</span> My reports</Link>
    <div className="success-heading"><span className="success-seal" aria-hidden="true">✓</span><p className="eyebrow">SAVED ON THIS DEVICE</p><h1>Your report is ready.</h1><p>Here’s the report you saved in this browser.</p></div>
    <article className="detail-card"><div className="detail-card-top"><span className="report-type-icon" aria-hidden="true">⌖</span><div><small>REFERENCE</small><b>{report.id}</b></div><time>{new Date(report.createdAt).toLocaleString()}</time></div>
      <div className="detail-description"><small>DESCRIPTION</small><p lang={report.language === 'hi-IN' ? 'hi' : 'en'}>{report.transcript}</p></div>
      <div className="detail-facts"><div><small>ISSUE TYPE</small><b>{report.category}</b></div><div><small>AREA OR LANDMARK</small><b>{report.area || 'Not provided'}</b></div><div><small>LANGUAGE</small><b>{report.language === 'hi-IN' ? 'हिन्दी · Hindi' : 'English · India'}</b></div></div>
      <div className="detail-disclosure"><span aria-hidden="true">◈</span><p><b>This is a demo report.</b> It is saved only in this browser. No civic authority has received it, and it has no official status.</p></div>
      <div className="detail-actions"><button className="button button-secondary" onClick={playConfirmation} disabled={busy}>{busy ? <><span className="spinner"/> Preparing voice…</> : <><span aria-hidden="true">▶</span> Hear confirmation</>}</button><Link className="button button-primary" href="/reports">Done <span aria-hidden="true">✓</span></Link></div>
      {notice && <p className="form-notice" role="status">{notice}</p>}
    </article>
    <div className="next-action"><div><b>Noticed something else?</b><small>You can save another report whenever you’re ready.</small></div><Link className="text-action" href="/report/voice">Make another report →</Link></div>
  </main>;
}