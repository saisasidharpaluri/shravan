'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'hi-IN' | 'en-IN';
export type SavedReport = {
  id: string;
  transcript: string;
  category: string;
  area: string;
  language: Language;
  createdAt: string;
};
export type Draft = {
  language: Language;
  transcript: string;
  category: string;
  area: string;
};

const reportsKey = 'shravan-demo-reports-v1';
const draftKey = 'shravan-demo-draft-v1';
const defaultDraft: Draft = { language: 'hi-IN', transcript: '', category: 'Roads & potholes', area: '' };

type ReportContextValue = {
  hydrated: boolean;
  draft: Draft;
  reports: SavedReport[];
  setDraft: (changes: Partial<Draft>) => void;
  saveReport: () => SavedReport;
  deleteReport: (id: string) => void;
  clearDraft: () => void;
};

const ReportContext = createContext<ReportContextValue | null>(null);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraftState] = useState<Draft>(defaultDraft);
  const [reports, setReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(draftKey);
      if (storedDraft) {
        const parsed = JSON.parse(storedDraft) as Partial<Draft>;
        setDraftState({ ...defaultDraft, ...parsed, language: parsed.language === 'en-IN' ? 'en-IN' : 'hi-IN' });
      }
      const storedReports = localStorage.getItem(reportsKey);
      if (storedReports) {
        const parsed = JSON.parse(storedReports) as SavedReport[];
        if (Array.isArray(parsed)) setReports(parsed.filter(item => item && typeof item.id === 'string' && typeof item.transcript === 'string'));
      }
    } catch {
      setDraftState(defaultDraft);
      setReports([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [draft, hydrated]);

  function setDraft(changes: Partial<Draft>) {
    setDraftState(current => ({ ...current, ...changes }));
  }

  function saveReport() {
    const id = `SHR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const report: SavedReport = { id, ...draft, transcript: draft.transcript.trim(), area: draft.area.trim(), createdAt: new Date().toISOString() };
    setReports(current => {
      const next = [report, ...current].slice(0, 10);
      localStorage.setItem(reportsKey, JSON.stringify(next));
      return next;
    });
    setDraftState(defaultDraft);
    localStorage.setItem(draftKey, JSON.stringify(defaultDraft));
    return report;
  }

  function deleteReport(id: string) {
    setReports(current => {
      const next = current.filter(report => report.id !== id);
      localStorage.setItem(reportsKey, JSON.stringify(next));
      return next;
    });
  }

  function clearDraft() {
    setDraftState(defaultDraft);
    if (typeof window !== 'undefined') localStorage.setItem(draftKey, JSON.stringify(defaultDraft));
  }

  const value = { hydrated, draft, reports, setDraft, saveReport, deleteReport, clearDraft };
  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReports() {
  const value = useContext(ReportContext);
  if (!value) throw new Error('useReports must be used inside ReportProvider');
  return value;
}
