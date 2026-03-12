import { getAvailableSlots, isWeekend, isPastDate } from '../config/availability';

describe('availability config', () => {
  describe('isWeekend', () => {
    it('returns true for Saturday', () => {
      expect(isWeekend('2026-03-14')).toBe(true); // Saturday
    });
    it('returns true for Sunday', () => {
      expect(isWeekend('2026-03-15')).toBe(true); // Sunday
    });
    it('returns false for Monday', () => {
      expect(isWeekend('2026-03-16')).toBe(false);
    });
    it('returns false for Friday', () => {
      expect(isWeekend('2026-03-20')).toBe(false);
    });
  });

  describe('isPastDate', () => {
    it('returns true for a clearly past date', () => {
      expect(isPastDate('2020-01-01')).toBe(true);
    });
    it('returns false for a future date', () => {
      expect(isPastDate('2030-12-31')).toBe(false);
    });
  });

  describe('getAvailableSlots', () => {
    it('returns empty array for Saturday', () => {
      expect(getAvailableSlots('2026-03-14')).toEqual([]);
    });
    it('returns empty array for Sunday', () => {
      expect(getAvailableSlots('2026-03-15')).toEqual([]);
    });
    it('returns empty array for a past date', () => {
      expect(getAvailableSlots('2020-01-01')).toEqual([]);
    });
    it('returns 6 slots for a future weekday (16:30–17:45 at 15min intervals)', () => {
      const slots = getAvailableSlots('2030-06-10'); // future Monday
      expect(slots).toHaveLength(6);
      expect(slots[0]).toBe('16:30');
      expect(slots[slots.length - 1]).toBe('17:45');
    });
    it('all slots are in HH:MM format', () => {
      const slots = getAvailableSlots('2030-06-10');
      slots.forEach((s) => {
        expect(s).toMatch(/^\d{2}:\d{2}$/);
      });
    });
    it('slots are in ascending order', () => {
      const slots = getAvailableSlots('2030-06-10');
      for (let i = 1; i < slots.length; i++) {
        expect(slots[i] > slots[i - 1]).toBe(true);
      }
    });
  });
});
