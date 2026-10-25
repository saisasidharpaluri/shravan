import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SHRAVAN — Civic issue reporting',
  description: 'Report local civic issues by voice, in your language.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
