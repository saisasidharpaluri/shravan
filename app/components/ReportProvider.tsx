'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getLanguageOrDefault, isSupportedLanguage, type Language } from '../lib/languages';

export type TranscriptionMode = 'single-language' | 'auto-codemix';
export type TranscriptionModel = 'prisma-v2.5' | 'prisma-v3.0' | null;

export type SavedReport = {
  id: string;
  transcript: string;
  category: string;
  area: string;
  language: Language;
  speechLanguage: Language;
  transcriptionMode: TranscriptionMode;
  transcriptionModel: TranscriptionModel;
  createdAt: string;
};
export type Draft = {
  language: Language;
  speechLanguage: Language;
  transcript: string;
  category: string;
  area: string;
  transcriptionLanguage: Language | null;
  transcriptionMode: TranscriptionMode;
  transcriptionModel: TranscriptionModel;
};

const reportsKey = 'shravan-demo-reports-v1';
const draftKey = 'shravan-demo-draft-v1';
const defaultDraft: Draft = { language: 'hi-IN', speechLanguage: 'hi-IN', transcript: '', category: 'Roads & potholes', area: '', transcriptionLanguage: null, transcriptionMode: 'single-language', transcriptionModel: null };

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
        const parsed = JSON.parse(storedDraft) as Partial<Draft> & { language?: unknown; speechLanguage?: unknown; transcriptionLanguage?: unknown };
        const language = getLanguageOrDefault(parsed.language);
        setDraftState({
          ...defaultDraft,
          ...parsed,
          language,
          speechLanguage: getLanguageOrDefault(parsed.speechLanguage ?? parsed.language),
          transcriptionLanguage: isSupportedLanguage(parsed.transcriptionLanguage) ? parsed.transcriptionLanguage : null,
          transcriptionMode: parsed.transcriptionMode === 'auto-codemix' ? 'auto-codemix' : 'single-language',
          transcriptionModel: parsed.transcriptionModel === 'prisma-v2.5' || parsed.transcriptionModel === 'prisma-v3.0' ? parsed.transcriptionModel : null,
        });
      }
      const storedReports = localStorage.getItem(reportsKey);
      if (storedReports) {
        const parsed = JSON.parse(storedReports) as (Partial<SavedReport> & { language?: unknown; speechLanguage?: unknown })[];
        if (Array.isArray(parsed)) setReports(parsed.filter((item): item is SavedReport => !!item && typeof item.id === 'string' && typeof item.transcript === 'string').map((item): SavedReport => ({
          id: item.id,
          transcript: item.transcript,
          category: typeof item.category === 'string' ? item.category : 'Other',
          area: typeof item.area === 'string' ? item.area : '',
          language: getLanguageOrDefault(item.language),
          speechLanguage: getLanguageOrDefault(item.speechLanguage ?? item.language),
          transcriptionMode: item.transcriptionMode === 'auto-codemix' ? 'auto-codemix' : 'single-language',
          transcriptionModel: item.transcriptionModel === 'prisma-v2.5' || item.transcriptionModel === 'prisma-v3.0' ? item.transcriptionModel : null,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
        })).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 10));
      }
    } catch {
      setDraftState(defaultDraft);
      setReports([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* Storage can be disabled by the browser. */ }
  }, [draft, hydrated]);

  function setDraft(changes: Partial<Draft>) {
    setDraftState(current => ({ ...current, ...changes }));
  }

  function saveReport() {
    const id = `SHR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const report: SavedReport = {
      id,
      transcript: draft.transcript.trim(),
      category: draft.category,
      area: draft.area.trim(),
      language: draft.transcriptionLanguage ?? draft.language,
      speechLanguage: draft.speechLanguage,
      transcriptionMode: draft.transcriptionMode,
      transcriptionModel: draft.transcriptionModel,
      createdAt: new Date().toISOString(),
    };
    const next = [report, ...reports].slice(0, 10);
    localStorage.setItem(reportsKey, JSON.stringify(next));
    setReports(next);
    return report;
  }

  function deleteReport(id: string) {
    const next = reports.filter(report => report.id !== id);
    try { localStorage.setItem(reportsKey, JSON.stringify(next)); } catch { /* The in-memory list still updates for this visit. */ }
    setReports(next);
  }

  function clearDraft() {
    setDraftState(defaultDraft);
    try { localStorage.setItem(draftKey, JSON.stringify(defaultDraft)); } catch { /* Storage can be disabled by the browser. */ }
  }

  const value = { hydrated, draft, reports, setDraft, saveReport, deleteReport, clearDraft };
  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReports() {
  const value = useContext(ReportContext);
  if (!value) throw new Error('useReports must be used inside ReportProvider');
  return value;
}
