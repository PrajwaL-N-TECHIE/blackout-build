import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredRegistrations,
  addRegistration,
  updateRegistrationStatus,
  deleteRegistration,
  clearAllRegistrations,
  exportRegistrationsToCsv,
} from '@/lib/registrations-store';

describe('registrations-store', () => {
  beforeEach(() => {
    clearAllRegistrations();
  });

  it('adds and retrieves registrations', () => {
    expect(getStoredRegistrations()).toHaveLength(0);

    const record = addRegistration({
      fullName: 'Test Hacker',
      email: 'hacker@buildicy.com',
      teamName: 'Alpha Squad',
      isSolo: false,
      role: 'hacker',
      experience: 'intermediate',
      motivation: 'Building something cool',
    });

    expect(record.id).toMatch(/^BLK-\d{4}$/);
    expect(record.status).toBe('pending');

    const stored = getStoredRegistrations();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.fullName).toBe('Test Hacker');
  });

  it('updates registration status', () => {
    const record = addRegistration({
      fullName: 'Designer Jane',
      email: 'jane@buildicy.com',
      teamName: 'Solo Builder',
      isSolo: true,
      role: 'designer',
      experience: 'advanced',
      motivation: 'Crafting interfaces',
    });

    updateRegistrationStatus(record.id, 'approved', 'Verified portfolio');
    const updated = getStoredRegistrations().find((r) => r.id === record.id);
    expect(updated?.status).toBe('approved');
    expect(updated?.notes).toBe('Verified portfolio');
  });

  it('deletes registration', () => {
    const record = addRegistration({
      fullName: 'Strategist Sam',
      email: 'sam@buildicy.com',
      teamName: 'Solo Builder',
      isSolo: true,
      role: 'strategist',
      experience: 'beginner',
      motivation: 'Strategy planning',
    });

    expect(getStoredRegistrations()).toHaveLength(1);
    deleteRegistration(record.id);
    expect(getStoredRegistrations()).toHaveLength(0);
  });

  it('exports registrations to CSV format', () => {
    const record = addRegistration({
      fullName: 'Visionary Vic',
      email: 'vic@buildicy.com',
      teamName: 'Visionary Crew',
      isSolo: false,
      role: 'visionary',
      experience: 'advanced',
      motivation: 'Exploring ideas',
    });

    const csv = exportRegistrationsToCsv([record]);
    expect(csv).toContain('Applicant ID');
    expect(csv).toContain('Visionary Vic');
    expect(csv).toContain('vic@buildicy.com');
  });
});
