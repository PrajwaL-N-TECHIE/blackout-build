/**
 * Persistent Registration Storage & Management Service for Buildicy Blackout Hackathon
 * Stores all real applicant registrations in localStorage and provides real-time event updates.
 */

export type BuilderRole = 'hacker' | 'designer' | 'strategist' | 'visionary';
export type ApplicationStatus = 'pending' | 'approved' | 'waitlisted' | 'rejected';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Registration {
  id: string; // e.g. "BLK-4821"
  fullName: string;
  email: string;
  teamName: string;
  isSolo: boolean;
  role: BuilderRole;
  experience: ExperienceLevel;
  githubUrl?: string | undefined;
  portfolioUrl?: string | undefined;
  motivation: string;
  tshirtSize?: string | undefined;
  dietary?: string | undefined;
  status: ApplicationStatus;
  createdAt: string; // ISO date string
  notes?: string | undefined;
}

const STORAGE_KEY = 'buildicy_blackout_registrations_v1';
const UPDATE_EVENT = 'buildicy:registrations-updated';

function generateApplicantId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BLK-${num}`;
}

export function getStoredRegistrations(): Registration[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load registrations from localStorage:', err);
    return [];
  }
}

export function saveRegistrations(list: Registration[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: list }));
  } catch (err) {
    console.error('Failed to save registrations to localStorage:', err);
  }
}

export function addRegistration(
  data: Omit<Registration, 'id' | 'createdAt' | 'status'>
): Registration {
  const current = getStoredRegistrations();
  const newRecord: Registration = {
    ...data,
    id: generateApplicantId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...current];
  saveRegistrations(updated);
  return newRecord;
}

export function updateRegistrationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string
): void {
  const current = getStoredRegistrations();
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status,
          notes: notes !== undefined ? notes : item.notes,
        }
      : item
  );
  saveRegistrations(updated);
}

export function deleteRegistration(id: string): void {
  const current = getStoredRegistrations();
  const updated = current.filter((item) => item.id !== id);
  saveRegistrations(updated);
}

export function clearAllRegistrations(): void {
  saveRegistrations([]);
}

export function subscribeToRegistrations(callback: (list: Registration[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback(getStoredRegistrations());
  };

  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function exportRegistrationsToCsv(registrations: Registration[]): string {
  const headers = [
    'Applicant ID',
    'Full Name',
    'Email',
    'Role',
    'Squad/Team',
    'Solo Builder',
    'Experience Level',
    'GitHub / Portfolio',
    'Motivation / Pitch',
    'T-Shirt Size',
    'Status',
    'Submitted At',
    'Organizer Notes',
  ];

  const rows = registrations.map((r) => [
    r.id,
    `"${r.fullName.replace(/"/g, '""')}"`,
    `"${r.email.replace(/"/g, '""')}"`,
    r.role,
    `"${r.teamName.replace(/"/g, '""')}"`,
    r.isSolo ? 'Yes' : 'No',
    r.experience,
    `"${(r.githubUrl || r.portfolioUrl || '').replace(/"/g, '""')}"`,
    `"${r.motivation.replace(/"/g, '""')}"`,
    r.tshirtSize || 'M',
    r.status,
    new Date(r.createdAt).toLocaleString(),
    `"${(r.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function seedDemoRegistrations(): Registration[] {
  const demoData: Registration[] = [
    {
      id: 'BLK-1042',
      fullName: 'Aria Chen',
      email: 'aria.chen@dev.io',
      teamName: 'Neon Tide',
      isSolo: false,
      role: 'hacker',
      experience: 'advanced',
      githubUrl: 'https://github.com/ariachen',
      portfolioUrl: 'https://aria.design',
      motivation: 'Building real-time generative audio synth for live crowd experiences.',
      tshirtSize: 'M',
      dietary: 'Vegetarian',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      notes: 'Strong backend & WebAudio background.',
    },
    {
      id: 'BLK-2189',
      fullName: 'Marcus Vance',
      email: 'marcus.v@studio.net',
      teamName: 'Neon Tide',
      isSolo: false,
      role: 'designer',
      experience: 'intermediate',
      githubUrl: 'https://github.com/marcusv',
      portfolioUrl: 'https://vance.work',
      motivation: 'Crafting spatial 3D micro-interactions and dark neon typography systems.',
      tshirtSize: 'L',
      dietary: 'None',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    },
    {
      id: 'BLK-3401',
      fullName: 'Priya Sharma',
      email: 'priya.s@ai-lab.org',
      teamName: 'Deep Current',
      isSolo: false,
      role: 'visionary',
      experience: 'advanced',
      githubUrl: 'https://github.com/priyasharma',
      motivation: 'Curating decentralized AI model routing with zero latency.',
      tshirtSize: 'S',
      dietary: 'Vegan',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
    },
    {
      id: 'BLK-4112',
      fullName: 'Devon Miller',
      email: 'devon@codecraft.co',
      teamName: 'Solo Operative',
      isSolo: true,
      role: 'hacker',
      experience: 'intermediate',
      githubUrl: 'https://github.com/devonmiller',
      motivation: 'Solo sprinting an offline-first P2P data synchronization tool.',
      tshirtSize: 'XL',
      dietary: 'None',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'BLK-5820',
      fullName: 'Elena Rostova',
      email: 'elena@productgrowth.io',
      teamName: 'Deep Current',
      isSolo: false,
      role: 'strategist',
      experience: 'intermediate',
      portfolioUrl: 'https://rostova.me',
      motivation: 'Ensuring our hackathon prototype has immediate venture-grade user validation.',
      tshirtSize: 'M',
      dietary: 'Gluten-Free',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'BLK-6294',
      fullName: 'Kai Tanaka',
      email: 'kai.tanaka@tokyo.ac.jp',
      teamName: 'Free Agent',
      isSolo: true,
      role: 'designer',
      experience: 'beginner',
      portfolioUrl: 'https://tanaka.framer.website',
      motivation: 'First time at a Buildicy hackathon! Eager to join a fast-moving squad.',
      tshirtSize: 'M',
      dietary: 'None',
      status: 'waitlisted',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ];

  saveRegistrations(demoData);
  return demoData;
}
