import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDateIST,
  formatTimeIST,
  formatDateTime,
  formatMessageTime,
  getTodayIST,
} from '../dateUtils';

describe('Date Utils', () => {
  beforeEach(() => {
    // Mock Date to a fixed date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:30:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDateIST', () => {
    it('formats date in IST format', () => {
      const timestamp = new Date('2024-01-15T10:30:00Z').getTime();
      const result = formatDateIST(timestamp);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('pads single digit days and months with zeros', () => {
      const timestamp = new Date('2024-01-05T10:30:00Z').getTime();
      const result = formatDateIST(timestamp);
      expect(result).toContain('01/05/');
    });
  });

  describe('formatTimeIST', () => {
    it('formats time in IST format', () => {
      const timestamp = new Date('2024-01-15T10:30:00Z').getTime();
      const result = formatTimeIST(timestamp);
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('pads single digit hours, minutes, seconds', () => {
      const timestamp = new Date('2024-01-15T05:05:05Z').getTime();
      const result = formatTimeIST(timestamp);
      expect(result.split(':').every(part => part.length === 2)).toBe(true);
    });
  });

  describe('formatDateTime', () => {
    it('combines date and time with separator', () => {
      const timestamp = new Date('2024-01-15T10:30:00Z').getTime();
      const result = formatDateTime(timestamp);
      expect(result).toContain(' - ');
    });

    it('includes both date and time components', () => {
      const timestamp = new Date('2024-01-15T10:30:00Z').getTime();
      const result = formatDateTime(timestamp);
      expect(result.split(' - ')).toHaveLength(2);
    });
  });

  describe('formatMessageTime', () => {
    it('shows only time for today\'s messages', () => {
      const todayIST = getTodayIST();
      const timestamp = new Date().getTime();
      const result = formatMessageTime(timestamp, todayIST);
      expect(result).not.toContain('/');
    });

    it('shows date and time for older messages', () => {
      const todayIST = getTodayIST();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatMessageTime(yesterday.getTime(), todayIST);
      expect(result).toContain('/');
    });
  });

  describe('getTodayIST', () => {
    it('returns today\'s date in IST format', () => {
      const result = getTodayIST();
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });
});

