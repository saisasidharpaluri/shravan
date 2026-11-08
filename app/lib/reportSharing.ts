import { getLanguage } from './languages';
import type { SavedReport } from '../components/ReportProvider';

export function formatReportForSharing(report: SavedReport) {
  const transcriptLanguage = getLanguage(report.language);
  const speechLanguage = getLanguage(report.speechLanguage);
  const lines = [
    'SHRAVAN — Resident-prepared demo report',
    `Demo reference: ${report.id}`,
    `Issue type: ${report.category}`,
    `Description (${transcriptLanguage.name}): ${report.transcript}`,
    report.area ? `Nearby area or landmark: ${report.area}` : null,
    `Voice read-back language: ${speechLanguage.name}`,
    `Prepared: ${new Date(report.createdAt).toLocaleString()}`,
    '',
    'Demo only. SHRAVAN did not submit this report to a civic authority. Share it with the relevant ward or community desk yourself if you choose.',
  ];
  return lines.filter((line): line is string => line !== null).join('\n');
}
