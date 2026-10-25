import type { Metadata } from 'next';
import './globals.css';
import { ReportProvider } from './components/ReportProvider';
import { SiteHeader } from './components/SiteHeader';

export const metadata: Metadata = {
  title: 'SHRAVAN — Civic issue reporting',
  description: 'Report local civic issues by voice, in your language.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ReportProvider><div className="app-frame"><SiteHeader />{children}<footer className="site-footer"><span className="footer-brand"><span className="brand-mark" aria-hidden="true">श</span> shravan</span><span>Made for neighbourhoods that care.</span><LinkTop /></footer></div></ReportProvider></body></html>;
}

function LinkTop() {
  return <a href="#top">Back to top ↑</a>;
}
