'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WizardShell } from '../../components/WizardShell';
import { useReports } from '../../components/ReportProvider';
import { getLanguage, SUPPORTED_LANGUAGES } from '../../lib/languages';
import { Icon } from '../../components/Icon';
import { speakWithTimbre } from '../../lib/speak';

export default function ReviewPage() {
  const router = useRouter();
  const { draft, setDraft, hydrated, saveReport } = useReports();
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => { if (hydrated && !draft.transcript.trim()) router.replace('/report/voice'); }, [hydrated, draft.transcript, router]);
  if (!hydrated || !draft.transcript.trim()) return <main className="route-loading" aria-live="polite">Opening your report…</main>;

  const reportLanguage = draft.transcriptionLanguage ?? draft.language;
  const language = getLanguage(reportLanguage);
  const speechLanguage = getLanguage(draft.speechLanguage);

  async function previewReport() {
    setSpeaking(true); setNotice('');
    try { await speakWithTimbre(draft.transcript, draft.speechLanguage); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Gnani voice playback is unavailable.'); }
    finally { setSpeaking(false); }
  }

  function submit() {
    const transcript = draft.transcript.trim();
    if (!transcript) { setNotice('Add a short description before saving.'); return; }
    if (transcript.length > 500) { setNotice('Keep the description under 500 characters.'); return; }
    setSaving(true);
    try {
      const report = saveReport();
      router.replace(`/reports/${encodeURIComponent(report.id)}?saved=1`);
    } catch {
      setSaving(false); setNotice('This browser could not save the report. Check available storage and try again.');
    }
  }

  return <WizardShell step={3}><div className="wizard-content">
    <div className="form-intro"><span className="form-icon"><Icon name="check"/></span><div><h2>Review before saving</h2><p>Make sure everything looks right. Your report stays on this device.</p></div></div>
    <div className="review-grid">
      <div className="review-primary"><div className="review-language"><span className="review-language-icon" lang={language.htmlLang}>{language.nativeName.slice(0, 2)}</span><div><small>TRANSCRIPT LANGUAGE</small><b>{language.nativeName} · {language.name}</b><small>Timbre will read it in {speechLanguage.nativeName} · {speechLanguage.name}</small>{draft.transcriptionModel && <small className="review-model-note">Recognized by Gnani {draft.transcriptionModel}{draft.transcriptionMode === 'auto-codemix' ? ' · auto-detect + code-mix' : ''}</small>}</div><Link href="/report/voice">Change</Link></div>
        <div className="review-field"><div className="review-field-heading"><label htmlFor="review-transcript">Your description</label><span>{draft.transcript.length}/500</span></div><textarea className="text-area review-area" id="review-transcript" lang={language.htmlLang} maxLength={500} value={draft.transcript} onChange={event => setDraft({ transcript: event.target.value })}/>
          <div className="readback-controls"><label htmlFor="speech-language">Read aloud in</label><select id="speech-language" value={draft.speechLanguage} onChange={event => setDraft({ speechLanguage: event.target.value as typeof draft.speechLanguage })}>{SUPPORTED_LANGUAGES.map(item => <option key={item.code} value={item.code}>{item.nativeName} · {item.name}</option>)}</select><button type="button" className="button button-soft" onClick={previewReport} disabled={speaking}>{speaking ? <><span className="spinner"/> Playing…</> : <><Icon name="play"/> Listen with Timbre</>}</button></div>
        </div>
      </div>
      <aside className="review-side"><p className="review-side-title">REPORT DETAILS</p><div className="review-facts"><div><small>ISSUE TYPE</small><b><span aria-hidden="true"><Icon name="report"/></span> {draft.category}</b><Link href="/report/details">Edit</Link></div><div><small>AREA OR LANDMARK</small><b><span aria-hidden="true"><Icon name="pin"/></span> {draft.area || 'Not provided'}</b><Link href="/report/details">Edit</Link></div></div><div className="review-privacy"><span><Icon name="privacy"/></span><p><b>Demo report, saved privately.</b> It stays in this browser and won’t be sent to a civic authority.</p></div></aside>
    </div>
    {notice && <p className="form-notice" role="alert">{notice}</p>}
    <div className="wizard-actions"><Link className="button button-secondary" href="/report/details"><span aria-hidden="true">←</span> Back</Link><span className="step-hint">Step 3 of 3</span><button className="button button-primary" type="button" onClick={submit} disabled={saving}>{saving ? <><span className="spinner"/> Saving…</> : <>Save my report <span aria-hidden="true"><Icon name="check"/></span></>}</button></div>
  </div></WizardShell>;
}
