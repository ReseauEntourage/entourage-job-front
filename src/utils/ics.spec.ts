// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { EventMode } from '@/src/constants/events';
import { downloadICS, generateICSContent } from './ics';

const baseEvent = {
  id: 'evt-1',
  title: 'My event',
  description: 'Line1\nLine2; with, special \\ chars',
  startDate: '2026-03-05T10:00:00.000Z',
  endDate: '2026-03-05T11:30:00.000Z',
  mode: EventMode.ONLINE,
  meetingLink: 'https://meet.test/abc',
  fullAddress: '1 rue de Paris',
};

describe('generateICSContent', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-02T03:04:05.678Z'));
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('builds a CRLF separated VCALENDAR with formatted dates', () => {
    const lines = generateICSContent(baseEvent).split('\r\n');
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(lines[lines.length - 1]).toBe('END:VCALENDAR');
    expect(lines).toContain('UID:evt-1@entouragepro.fr');
    expect(lines).toContain('DTSTAMP:20260102T030405Z');
    expect(lines).toContain('DTSTART:20260305T100000Z');
    expect(lines).toContain('DTEND:20260305T113000Z');
    expect(lines).toContain('SUMMARY:My event');
  });

  it('escapes backslashes, semicolons, commas and newlines', () => {
    const lines = generateICSContent(baseEvent).split('\r\n');
    expect(lines).toContain(
      'DESCRIPTION:Line1\\nLine2\\; with\\, special \\\\ chars'
    );
  });

  it('uses the meeting link as location for online events', () => {
    expect(generateICSContent(baseEvent)).toContain(
      'LOCATION:https://meet.test/abc'
    );
  });

  it('uses the address as location for in-person events', () => {
    const content = generateICSContent({
      ...baseEvent,
      mode: EventMode.IN_PERSON,
    });
    expect(content).toContain('LOCATION:1 rue de Paris');
  });

  it('omits LOCATION when there is none', () => {
    const content = generateICSContent({ ...baseEvent, meetingLink: null });
    expect(content).not.toContain('LOCATION');
  });

  it('derives the UID from title and start date without an id', () => {
    const content = generateICSContent({ ...baseEvent, id: undefined });
    expect(content).toContain(
      'UID:My-event-2026-03-05T10:00:00.000Z@entouragepro.fr'
    );
  });
});

describe('downloadICS', () => {
  it('creates a temporary link, clicks it and revokes the object url', () => {
    const createObjectURL = jest.fn().mockReturnValue('blob:fake');
    const revokeObjectURL = jest.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        expect(this.href).toBe('blob:fake');
        expect(this.download).toBe('event.ics');
        expect(document.body.contains(this)).toBe(true);
      });

    downloadICS('CONTENT', 'event.ics');

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/calendar;charset=utf-8');
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake');
    expect(document.querySelector('a[download]')).toBeNull();
    click.mockRestore();
  });
});
