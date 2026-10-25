import type { Metadata } from 'next';
import { DM_Sans, Manrope, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { ReportProvider } from './components/ReportProvider';
import { SiteHeader } from './components/SiteHeader';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari', display: 'swap' });

export const metadata: Metadata = {
  title: 'SHRAVAN — Civic issue reporting',
  description: 'Report local civic issues by voice, in your language.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${dmSans.variable} ${manrope.variable} ${devanagari.variable}`}><ReportProvider><div className="app-frame"><SiteHeader />{children}<footer className="site-footer"><span className="footer-brand"><span className="brand-mark" aria-hidden="true">श</span><span>shravan</span></span><span>Local voices, heard.</span><LinkTop /></footer></div></ReportProvider></body></html>;
}

function LinkTop() {
  return <a href="#top">Back to top ↑</a>;
}
