import { EventMode } from 'src/constants/events';

interface ICSEventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: EventMode;
  meetingLink: string | null;
  fullAddress: string | null;
}

function formatICSDate(date: string): string {
  return new Date(date)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function escapeICS(text: string | null | undefined): string {
  if (!text) {
    return '';
  }
  return text.replace(/[\\;,\n]/g, (char) => {
    if (char === '\n') {
      return '\\n';
    }
    return '\\' + char;
  });
}

export function generateICSContent(event: ICSEventData): string {
  const location =
    event.mode === EventMode.ONLINE
      ? event.meetingLink ?? ''
      : event.fullAddress ?? '';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Entourage Pro//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(event.endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    ...(location ? [`LOCATION:${escapeICS(location)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

export function downloadICS(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
