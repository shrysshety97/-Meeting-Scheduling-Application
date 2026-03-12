import { describe, it, expect } from 'vitest';
import { convertTimeToTimezone } from '../utils/timezoneUtils';
import { formatDateForDisplay, formatDateMedium, toApiDate, isWeekend, isPast } from '../utils/dateUtils';

describe('convertTimeToTimezone', () => {
  // Base: IST = UTC+5:30 = offset 330 minutes

  it('converts 16:30 IST to UTC+6:00 (+30 min) → 17:00', () => {
    expect(convertTimeToTimezone('16:30', 360)).toBe('17:00');
  });

  it('converts 16:30 IST to UTC+5:00 (-30 min) → 16:00', () => {
    expect(convertTimeToTimezone('16:30', 300)).toBe('16:00');
  });

  it('no change when same offset (IST → IST)', () => {
    expect(convertTimeToTimezone('17:15', 330)).toBe('17:15');
  });

  it('converts 17:45 IST to UTC+7:00 (+90 min) → 19:15', () => {
    expect(convertTimeToTimezone('17:45', 420)).toBe('19:15');
  });

  it('handles midnight overflow: 23:30 IST to UTC+7:00 (+90) → 01:00', () => {
    expect(convertTimeToTimezone('23:30', 420)).toBe('01:00');
  });

  it('handles backward wrap: 00:30 IST to UTC+5:00 (-30) → 00:00', () => {
    expect(convertTimeToTimezone('00:30', 300)).toBe('00:00');
  });

  it('output is always padded to HH:MM format', () => {
    const result = convertTimeToTimezone('16:00', 360);
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('dateUtils', () => {
  describe('formatDateMedium', () => {
    it('formats 2026-03-09 as "9 March 2026"', () => {
      expect(formatDateMedium('2026-03-09')).toBe('9 March 2026');
    });
  });

  describe('formatDateForDisplay', () => {
    it('formats 2026-03-09 as "Monday, 9 March 2026"', () => {
      expect(formatDateForDisplay('2026-03-09')).toBe('Monday, 9 March 2026');
    });
  });

  describe('toApiDate', () => {
    it('returns YYYY-MM-DD format', () => {
      const d = new Date(2026, 2, 9); // March 9, 2026
      expect(toApiDate(d)).toBe('2026-03-09');
    });
  });

  describe('isWeekend', () => {
    it('correctly identifies Saturday (2026-03-14)', () => {
      expect(isWeekend(new Date(2026, 2, 14))).toBe(true);
    });
    it('correctly identifies Sunday (2026-03-15)', () => {
      expect(isWeekend(new Date(2026, 2, 15))).toBe(true);
    });
    it('returns false for Monday (2026-03-16)', () => {
      expect(isWeekend(new Date(2026, 2, 16))).toBe(false);
    });
  });

  describe('isPast', () => {
    it('returns true for year 2000', () => {
      expect(isPast(new Date(2000, 0, 1))).toBe(true);
    });
    it('returns false for year 2030', () => {
      expect(isPast(new Date(2030, 11, 31))).toBe(false);
    });
  });
});
