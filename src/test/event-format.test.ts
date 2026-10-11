import { describe, expect, it } from 'vitest';
import { eventFormat } from '../lib/event-format';

describe('Blackout Hackathon rules', () => {
  it('lasts eight hours', () => expect(eventFormat.totalHours).toBe(8));
  it('provides internet for the first two hours', () => expect(eventFormat.initialInternetHours).toBe(2));
  it('provides a one-hour internet break', () => expect(eventFormat.breakInternetHours).toBe(1));
  it('keeps both building phases offline', () => {
    expect(eventFormat.buildInternetAccess).toBe(false);
    expect(eventFormat.phases.map(phase => phase.online)).toEqual([true, false, true, false]);
  });
});