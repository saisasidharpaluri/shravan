'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReports } from './ReportProvider';

export function SiteHeader() {
  const pathname = usePathname();
  const { reports, draft, hydrated } = useReports();
  const activeReports = pathname.startsWith('/reports');
  return <header className="site-header">
    <Link href="/" className="brand" aria-label="Shravan home"><span className="brand-mark" aria-hidden="true">श</span><span>shravan</span></Link>
    <nav className="site-nav" aria-label="Main navigation">
      <Link className={activeReports ? 'nav-link active' : 'nav-link'} href="/reports">My reports{hydrated && reports.length > 0 && <span className="nav-count">{reports.length}</span>}</Link>
      <Link className="nav-cta" href="/report/voice"><span aria-hidden="true">＋</span> {hydrated && draft.transcript.trim() ? 'Resume draft' : 'New report'}</Link>
    </nav>
  </header>;
}
