import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Code2,
  Palette,
  Target,
  Eye,
  ArrowLeft,
  Sparkles,
  Layers,
  Database,
  FileSpreadsheet,
  AlertCircle,
  MoreVertical,
  Edit3,
  X,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playStickerPop } from '@/lib/chime';
import buildicyLogo from '@/assets/buildicy-logo.png';
import {
  getStoredRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  clearAllRegistrations,
  exportRegistrationsToCsv,
  seedDemoRegistrations,
  subscribeToRegistrations,
  type Registration,
  type ApplicationStatus,
  type BuilderRole,
} from '@/lib/registrations-store';

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin Console — Blackout Hackathon' },
      { name: 'description', content: 'Organizer management portal for Blackout Hackathon registrations.' },
    ],
  }),
  component: AdminPortal,
});

function AdminPortal() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | BuilderRole>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Registration | null>(null);
  const [notesInput, setNotesInput] = useState('');

  useEffect(() => {
    // Initial load
    const initial = getStoredRegistrations();
    // If store is completely empty on first launch, auto-seed demo data so the organizer sees content immediately
    if (initial.length === 0) {
      const seeded = seedDemoRegistrations();
      setRegistrations(seeded);
    } else {
      setRegistrations(initial);
    }

    // Subscribe to live changes
    const unsubscribe = subscribeToRegistrations((list) => {
      setRegistrations(list);
    });
    return unsubscribe;
  }, []);

  // Sync notes when applicant modal opens
  useEffect(() => {
    if (selectedApplicant) {
      setNotesInput(selectedApplicant.notes || '');
    }
  }, [selectedApplicant]);

  // Filtered registrations
  const filtered = useMemo(() => {
    return registrations.filter((item) => {
      // Status match
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      // Role match
      if (roleFilter !== 'all' && item.role !== roleFilter) return false;
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.fullName.toLowerCase().includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesTeam = item.teamName.toLowerCase().includes(q);
        const matchesGithub = (item.githubUrl || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesId && !matchesTeam && !matchesGithub) {
          return false;
        }
      }
      return true;
    });
  }, [registrations, statusFilter, roleFilter, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = registrations.length;
    const approved = registrations.filter((r) => r.status === 'approved').length;
    const pending = registrations.filter((r) => r.status === 'pending').length;
    const waitlisted = registrations.filter((r) => r.status === 'waitlisted').length;
    const rejected = registrations.filter((r) => r.status === 'rejected').length;

    // Unique teams
    const teamSet = new Set(
      registrations
        .filter((r) => !r.isSolo && r.teamName && r.teamName !== 'Undecided Squad')
        .map((r) => r.teamName.toLowerCase())
    );

    // Role breakdown
    const hackers = registrations.filter((r) => r.role === 'hacker').length;
    const designers = registrations.filter((r) => r.role === 'designer').length;
    const strategists = registrations.filter((r) => r.role === 'strategist').length;
    const visionaries = registrations.filter((r) => r.role === 'visionary').length;

    return {
      total,
      approved,
      pending,
      waitlisted,
      rejected,
      teamsCount: teamSet.size,
      roles: { hackers, designers, strategists, visionaries },
    };
  }, [registrations]);

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    playStickerPop(600);
    updateRegistrationStatus(id, newStatus);
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveNotes = () => {
    if (!selectedApplicant) return;
    playStickerPop(500);
    updateRegistrationStatus(selectedApplicant.id, selectedApplicant.status, notesInput);
    setSelectedApplicant((prev) => (prev ? { ...prev, notes: notesInput } : null));
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete registration for "${name}" (${id})?`)) {
      playStickerPop(400);
      deleteRegistration(id);
      if (selectedApplicant?.id === id) setSelectedApplicant(null);
    }
  };

  const handleExportCsv = () => {
    playStickerPop(700);
    const csvContent = exportRegistrationsToCsv(registrations);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `buildicy_blackout_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeedDemo = () => {
    playStickerPop(680);
    const seeded = seedDemoRegistrations();
    setRegistrations(seeded);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear ALL registrations? This cannot be undone.')) {
      clearAllRegistrations();
      setRegistrations([]);
    }
  };

  const getRoleIcon = (role: BuilderRole) => {
    switch (role) {
      case 'hacker':
        return <Code2 className="w-3.5 h-3.5 text-sky-500" />;
      case 'designer':
        return <Palette className="w-3.5 h-3.5 text-pink-500" />;
      case 'strategist':
        return <Target className="w-3.5 h-3.5 text-amber-500" />;
      case 'visionary':
        return <Eye className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono font-bold uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] font-mono font-bold uppercase">
            <Clock className="w-3 h-3 text-amber-500" /> Pending Review
          </span>
        );
      case 'waitlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-[11px] font-mono font-bold uppercase">
            <AlertCircle className="w-3 h-3 text-sky-500" /> Waitlisted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[11px] font-mono font-bold uppercase">
            <XCircle className="w-3 h-3 text-rose-500" /> Declined
          </span>
        );
    }
  };

  return (
    <div className="admin-portal min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={buildicyLogo}
                alt="Buildicy"
                width={28}
                height={32}
                className="object-contain transition-transform group-hover:scale-105"
              />
              <span className="font-display font-bold tracking-tight text-lg text-foreground">
                buildicy <span className="text-primary font-normal">/</span>
              </span>
            </Link>
            <div className="h-5 w-px bg-border/80" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-[11px] font-mono font-bold text-sky-900 dark:text-sky-200 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-sky-500" /> ORGANIZER CONSOLE
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal
              </Button>
            </Link>
            <Button variant="hero" size="sm" onClick={handleExportCsv} className="gap-1.5 text-xs shadow-sm">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              Registration Manager
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Review, approve, and manage applicant squads for Blackout Hackathon.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSeedDemo} className="text-xs">
              <Database className="w-3.5 h-3.5 mr-1 text-sky-500" /> Reset Demo Seed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear All
            </Button>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Total Applicants
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold">{metrics.total}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Stored in organizer database</p>
          </div>

          {/* Card 2: Approved */}
          <div className="p-5 rounded-2xl bg-card border border-emerald-200 dark:border-emerald-900/60 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Approved Stations
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">
              {metrics.approved}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Confirmed builder passes</p>
          </div>

          {/* Card 3: Pending */}
          <div className="p-5 rounded-2xl bg-card border border-amber-200 dark:border-amber-900/60 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Pending Decisions
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-amber-600 dark:text-amber-400">
              {metrics.pending}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Awaiting organizer review</p>
          </div>

          {/* Card 4: Squads */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Formed Squads
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold">{metrics.teamsCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Multi-builder teams registered</p>
          </div>
        </div>

        {/* Roles Distribution Bar */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              ✦ Builder Superpower Breakdown
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {metrics.roles.hackers} Hackers · {metrics.roles.designers} Designers · {metrics.roles.strategists} Strategists · {metrics.roles.visionaries} Visionaries
            </span>
          </div>

          {metrics.total > 0 && (
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-muted">
              <div
                style={{ width: `${(metrics.roles.hackers / metrics.total) * 100}%` }}
                className="bg-sky-500 transition-all duration-500"
                title={`Hackers: ${metrics.roles.hackers}`}
              />
              <div
                style={{ width: `${(metrics.roles.designers / metrics.total) * 100}%` }}
                className="bg-pink-500 transition-all duration-500"
                title={`Designers: ${metrics.roles.designers}`}
              />
              <div
                style={{ width: `${(metrics.roles.strategists / metrics.total) * 100}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Strategists: ${metrics.roles.strategists}`}
              />
              <div
                style={{ width: `${(metrics.roles.visionaries / metrics.total) * 100}%` }}
                className="bg-purple-500 transition-all duration-500"
                title={`Visionaries: ${metrics.roles.visionaries}`}
              />
            </div>
          )}
        </div>

        {/* Search, Filter Toolbar & Status Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, team, pass ID..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs sm:text-sm focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Role Filter Selector */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | BuilderRole)}
                className="px-3 py-2 rounded-xl bg-card border border-border text-xs sm:text-sm focus:border-primary focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="hacker">The Hacker</option>
                <option value="designer">The Designer</option>
                <option value="strategist">The Strategist</option>
                <option value="visionary">The Visionary</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 max-w-fit">
            {(
              [
                { id: 'all', label: 'All', count: metrics.total },
                { id: 'pending', label: 'Pending', count: metrics.pending },
                { id: 'approved', label: 'Approved', count: metrics.approved },
                { id: 'waitlisted', label: 'Waitlisted', count: metrics.waitlisted },
                { id: 'rejected', label: 'Declined', count: metrics.rejected },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playStickerPop(450);
                  setStatusFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Applications Data Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No applications match your filter</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try clearing your search or status filters, or seed demo applicants to test the system.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setRoleFilter('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-muted/50 border-b border-border text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3.5 px-4">Pass ID</th>
                    <th className="py-3.5 px-4">Builder Name</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Squad</th>
                    <th className="py-3.5 px-4">Experience</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedApplicant(item)}
                    >
                      {/* Pass ID */}
                      <td className="py-3 px-4 font-mono font-bold text-primary whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* Builder */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{item.fullName}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{item.email}</div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 capitalize font-medium">
                          {getRoleIcon(item.role)}
                          <span>{item.role}</span>
                        </div>
                      </td>

                      {/* Squad */}
                      <td className="py-3 px-4 max-w-[160px] truncate">
                        {item.isSolo ? (
                          <span className="px-2 py-0.5 rounded bg-muted text-[11px] font-mono text-muted-foreground">
                            Solo Builder
                          </span>
                        ) : (
                          <span className="font-medium text-foreground">{item.teamName}</span>
                        )}
                      </td>

                      {/* Experience */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-mono capitalize text-muted-foreground">
                          {item.experience}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-[11px] font-mono text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1">
                          {item.status !== 'approved' && (
                            <button
                              title="Approve registration"
                              onClick={() => handleStatusChange(item.id, 'approved')}
                              className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/80 text-emerald-600 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {item.status !== 'waitlisted' && (
                            <button
                              title="Waitlist registration"
                              onClick={() => handleStatusChange(item.id, 'waitlisted')}
                              className="p-1.5 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-950/80 text-sky-600 transition-colors"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}

                          {item.status !== 'rejected' && (
                            <button
                              title="Decline registration"
                              onClick={() => handleStatusChange(item.id, 'rejected')}
                              className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/80 text-rose-600 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            title="Delete record"
                            onClick={() => handleDelete(item.id, item.fullName)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Applicant Dossier Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-sm text-primary">
                    {selectedApplicant.id}
                  </span>
                  {getStatusBadge(selectedApplicant.status)}
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {selectedApplicant.fullName}
                </h3>
                <p className="text-xs font-mono text-muted-foreground">{selectedApplicant.email}</p>
              </div>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-muted/40 border border-border/40 text-xs font-mono">
              <div>
                <span className="text-muted-foreground block text-[10px]">ROLE</span>
                <strong className="text-foreground capitalize">{selectedApplicant.role}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">SQUAD</span>
                <strong className="text-foreground">{selectedApplicant.teamName}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">EXPERIENCE</span>
                <strong className="text-foreground capitalize">{selectedApplicant.experience}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">T-SHIRT SIZE</span>
                <strong className="text-foreground">{selectedApplicant.tshirtSize || 'M'}</strong>
              </div>
            </div>

            {/* Motivation / Pitch */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Pitch / What They Plan to Build
              </span>
              <div className="p-4 rounded-xl bg-background border border-border text-xs sm:text-sm leading-relaxed text-foreground">
                {selectedApplicant.motivation}
              </div>
            </div>

            {/* Links */}
            {(selectedApplicant.githubUrl || selectedApplicant.portfolioUrl) && (
              <div className="flex flex-wrap gap-3">
                {selectedApplicant.githubUrl && (
                  <a
                    href={selectedApplicant.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-mono font-bold hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> GitHub Profile
                  </a>
                )}
                {selectedApplicant.portfolioUrl && (
                  <a
                    href={selectedApplicant.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-mono font-bold hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                  </a>
                )}
              </div>
            )}

            {/* Organizer Notes */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Organizer Internal Notes
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Verified GitHub repo; station assigned to Room B."
                  className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-xs focus:border-primary focus:outline-none"
                />
                <Button size="sm" variant="outline" onClick={handleSaveNotes} className="text-xs">
                  Save Note
                </Button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">Change Status:</span>
                <Button
                  size="sm"
                  variant={selectedApplicant.status === 'approved' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange(selectedApplicant.id, 'approved')}
                  className="text-xs"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant={selectedApplicant.status === 'waitlisted' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange(selectedApplicant.id, 'waitlisted')}
                  className="text-xs"
                >
                  Waitlist
                </Button>
                <Button
                  size="sm"
                  variant={selectedApplicant.status === 'rejected' ? 'destructive' : 'outline'}
                  onClick={() => handleStatusChange(selectedApplicant.id, 'rejected')}
                  className="text-xs"
                >
                  Decline
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setSelectedApplicant(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
