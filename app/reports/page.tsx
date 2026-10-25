'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useReports } from '../components/ReportProvider';
import { Icon } from '../components/Icon';

const allCategories = ['All categories', 'Roads & potholes', 'Waste & cleanliness', 'Water supply', 'Streetlights', 'Drainage', 'Other'];

export default function ReportsPage() {
  const { reports, hydrated, deleteReport } = useReports();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const filtered = useMemo(() => reports.filter(report => {
    const text = `${report.transcript} ${report.area} ${report.id} ${report.category}`.toLocaleLowerCase();
    return text.includes(query.toLocaleLowerCase()) && (category === 'All categories' || report.category === category);
  }), [reports, query, category]);

  function removeReport(id: string) {
    if (window.confirm(`Delete demo report ${id} from this browser? This cannot be undone.`)) deleteReport(id);
  }

  return <main id="top" className="content-page reports-page">
    <div className="page-kicker"><span className="eyebrow-dot"/> YOUR REPORTS</div>
    <div className="page-title-row"><div><h1>My reports</h1><p>Reports saved on this browser, ready when you need them.</p></div><Link className="button button-primary" href="/report/voice">＋ New report</Link></div>
    <div className="storage-banner"><span className="storage-icon"><Icon name="privacy"/></span><p><b>Private to this device.</b> These demo reports are stored in this browser and aren’t sent to a civic authority. Only the latest 10 reports are kept; clearing browser data may remove them.</p></div>
    {!hydrated ? <div className="route-loading" aria-live="polite">Loading your reports…</div> : reports.length === 0 ? <div className="empty-state"><span className="empty-icon"><Icon name="pin"/></span><h2>No reports yet</h2><p>Your saved reports will appear here. Start with a voice note or type a description.</p><Link className="button button-primary" href="/report/voice">Create your first report <span aria-hidden="true">→</span></Link></div> : <>
      <div className="report-tools"><label className="search-box"><span><Icon name="search"/></span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search your reports" aria-label="Search saved reports"/></label><label className="category-filter"><span className="sr-only">Filter by category</span><select value={category} onChange={event => setCategory(event.target.value)}>{allCategories.map(item => <option key={item}>{item}</option>)}</select></label></div>
      <div className="list-meta" aria-live="polite"><span>{filtered.length} {filtered.length === 1 ? 'report' : 'reports'}</span><span>Saved on this device</span></div>
      {filtered.length ? <div className="report-list">{filtered.map(report => <article className="report-list-card" key={report.id}><span className="report-type-icon"><Icon name="pin"/></span><Link href={`/reports/${encodeURIComponent(report.id)}`} className="report-list-body" aria-label={`Open ${report.category}, reference ${report.id}`}><span className="report-list-top"><b>{report.category}</b><time dateTime={report.createdAt}>{new Date(report.createdAt).toLocaleDateString()}</time></span><span className="report-excerpt" lang={report.language === 'hi-IN' ? 'hi' : 'en-IN'}>{report.transcript}</span><span className="report-list-bottom"><span>{report.area || 'Area not provided'}</span><span>Ref. {report.id}</span></span></Link><button type="button" className="report-delete" aria-label={`Delete demo report ${report.id}`} onClick={() => removeReport(report.id)}>Delete</button><span className="card-arrow" aria-hidden="true">→</span></article>)}</div> : <div className="empty-filter"><p>No reports match those filters.</p><button className="text-action" type="button" onClick={() => { setQuery(''); setCategory('All categories'); }}>Clear filters</button></div>}
    </>}
  </main>;
}
