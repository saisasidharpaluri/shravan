'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLanguage } from '../../lib/languages';
import { useReports } from '../../components/ReportProvider';
import { Icon } from '../../components/Icon';

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { reports, hydrated, draft, deleteReport, clearDraft } = useReports();
  const report = reports.find(item => item.id === id);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (hydrated && searchParams.get('saved') === '1' && report && draft.transcript.trim()) { clearDraft(); router.replace(`/reports/${encodeURIComponent(report.id)}`); } }, [hydrated, report, draft.transcript, clearDraft, router, searchParams]);

  async function playConfirmation() {
    if (!report) return;
    setBusy(true); setNotice('');
    try {
      const language = getLanguage(report.language);
      const text = report.language === 'hi-IN' ? `आपकी डेमो शिकायत इस डिवाइस पर सेव हो गई है। संदर्भ संख्या ${report.id} है।` : `Your demo report is saved on this device. Your reference number is ${report.id}.`;
      const response = await fetch('/api/speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, language: language.code }) });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'Voice confirmation is unavailable.'); }
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      audio.onerror = () => { URL.revokeObjectURL(url); setNotice('The confirmation audio could not be played.'); };
      await audio.play();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'The voice confirmation could not be created.'); }
    finally { setBusy(false); }
  }

  async function copyReference() {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice('Copy isn’t available here. You can select the reference number to copy it.');
    }
  }

  function removeReport() {
    if (!report) return;
    if (!window.confirm(`Delete demo report ${report.id} from this browser? This cannot be undone.`)) return;
    deleteReport(report.id);
    router.replace('/reports');
  }

  if (!hydrated) return <main className="route-loading" aria-live="polite">Opening your report…</main>;
  if (!report) return <main className="content-page missing-page"><span className="empty-icon"><Icon name="pin"/></span><p className="eyebrow">REPORT NOT FOUND</p><h1>This report isn’t on this device.</h1><p>Saved reports are stored in the browser where they were created.</p><Link className="button button-primary" href="/reports">Back to my reports</Link></main>;

  const language = getLanguage(report.language);
  return <main id="top" className="content-page detail-page">
    <Link href="/reports" className="back-link"><span aria-hidden="true">←</span> My reports</Link>
    <div className="success-heading"><span className="success-seal"><Icon name="check"/></span><p className="eyebrow">SAVED ON THIS DEVICE</p><h1>Your demo report is saved.</h1><p>You can find it again in My reports on this browser.</p></div>
    <article className="detail-card"><div className="reference-card"><div><small>YOUR DEMO REFERENCE</small><strong>{report.id}</strong></div><button type="button" className="copy-reference" onClick={copyReference} aria-label="Copy demo reference"><span aria-hidden="true"><Icon name="copy"/></span> {copied ? 'Copied' : 'Copy reference'}</button></div><div className="detail-card-top"><span className="report-type-icon"><Icon name="pin"/></span><div><small>ISSUE TYPE</small><b>{report.category}</b></div><time dateTime={report.createdAt}>{new Date(report.createdAt).toLocaleString()}</time></div>
      <div className="detail-description"><small>DESCRIPTION</small><p lang={language.htmlLang}>{report.transcript}</p></div>
      <div className="detail-facts"><div><small>ISSUE TYPE</small><b>{report.category}</b></div><div><small>AREA OR LANDMARK</small><b>{report.area || 'Not provided'}</b></div><div><small>LANGUAGE</small><b>{language.nativeName} · {language.name}</b></div></div>
      <div className="detail-disclosure"><span><Icon name="privacy"/></span><p><b>This is a demo report.</b> It is saved only in this browser. No civic authority has received it, and it has no official status.</p></div>
      <div className="detail-actions"><button className="button button-secondary" onClick={playConfirmation} disabled={busy}>{busy ? <><span className="spinner"/> Preparing voice…</> : <><span aria-hidden="true"><Icon name="play"/></span> Hear confirmation</>}</button><Link className="button button-primary" href="/reports">Go to my reports <span aria-hidden="true">→</span></Link></div>
      {notice && <p className="form-notice" role="status">{notice}</p>}
      <button type="button" className="text-action report-detail-delete" onClick={removeReport}>Delete this demo report</button>
    </article>
    <div className="next-action"><div><b>Noticed something else?</b><small>You can save another report whenever you’re ready.</small></div><Link className="text-action" href="/report/voice">Make another report →</Link></div>
  </main>;
}
