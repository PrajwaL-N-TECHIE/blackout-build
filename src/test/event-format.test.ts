import { describe, expect, it } from 'vitest';
import { eventFormat } from '../lib/event-format';

describe('Blackout Hackathon rules', () => {
  it('lasts eight hours', () => expect(eventFormat.totalHours).toBe(8));
  it('requires organizer authorization on event day before revealing the twist', () => {
    expect(eventFormat.revealPolicy).toBe('organizer-authorized-on-event-day');
    expect(Object.keys(eventFormat)).toEqual(['totalHours', 'revealPolicy', 'publicDetails']);
    expect(JSON.stringify(eventFormat)).not.toMatch(/internet|offline|initialInternetHours|breakInternetHours/i);
  });
});