import { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Terminal,
  Code2,
  Palette,
  Target,
  Eye,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  Users,
  Compass,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playStickerPop } from '@/lib/chime';
import {
  addRegistration,
  getStoredRegistrations,
  subscribeToRegistrations,
  type BuilderRole,
  type ExperienceLevel,
  type Registration,
} from '@/lib/registrations-store';

interface RegistrationSectionProps {
  className?: string;
  onSuccess?: (record: Registration) => void;
}

export function RegistrationSection({ className = '', onSuccess }: RegistrationSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [teamName, setTeamName] = useState('');
  const [isSolo, setIsSolo] = useState(false);
  const [role, setRole] = useState<BuilderRole>('hacker');
  const [experience, setExperience] = useState<ExperienceLevel>('intermediate');
  const [githubUrl, setGithubUrl] = useState('');
  const [motivation, setMotivation] = useState('');
  const [tshirtSize, setTshirtSize] = useState('L');
  const [agreed, setAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPass, setSubmittedPass] = useState<Registration | null>(null);
  const [copied, setCopied] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(getStoredRegistrations().length);
    const unsubscribe = subscribeToRegistrations((list) => {
      setTotalCount(list.length);
    });
    return unsubscribe;
  }, []);

  const roles: { id: BuilderRole; label: string; icon: typeof Code2; desc: string; badge: string }[] = [
    {
      id: 'hacker',
      label: 'The Hacker',
      icon: Code2,
      desc: 'Transforms ideas into working code, APIs, and prototypes.',
      badge: 'Engineering & Architecture',
    },
    {
      id: 'designer',
      label: 'The Designer',
      icon: Palette,
      desc: 'Crafts high-craft visual interfaces, micro-interactions, and aesthetics.',
      badge: 'UI/UX & Visual Design',
    },
    {
      id: 'strategist',
      label: 'The Strategist',
      icon: Target,
      desc: 'Navigates product strategy, user validation, and pitch narrative.',
      badge: 'Product & Execution',
    },
    {
      id: 'visionary',
      label: 'The Visionary',
      icon: Eye,
      desc: 'Discovers uncharted domains, unifies teams, and explores the unknown.',
      badge: 'Concept & Innovation',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !motivation.trim() || !agreed) return;

    setIsSubmitting(true);
    playStickerPop(620);

    setTimeout(() => {
      const record = addRegistration({
        fullName: fullName.trim(),
        email: email.trim(),
        teamName: isSolo ? 'Solo Builder' : teamName.trim() || 'Undecided Squad',
        isSolo,
        role,
        experience,
        githubUrl: githubUrl.trim() || undefined,
        motivation: motivation.trim(),
        tshirtSize,
      });

      setIsSubmitting(false);
      setSubmittedPass(record);
      playStickerPop(840);
      onSuccess?.(record);
    }, 600);
  };

  const handleCopyId = () => {
    if (!submittedPass) return;
    navigator.clipboard.writeText(submittedPass.id);
    setCopied(true);
    playStickerPop(500);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSubmittedPass(null);
    setFullName('');
    setEmail('');
    setTeamName('');
    setGithubUrl('');
    setMotivation('');
    setAgreed(false);
  };

  return (
    <section
      id="register"
      className={`registration-section relative w-full py-16 md:py-24 bg-gradient-to-b from-background via-sky-50/50 to-background dark:via-sky-950/25 border-y border-border/40 overflow-hidden ${className}`}
      aria-label="Official Blackout Hackathon Registration"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 border border-sky-300/60 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin" />
            OFFICIAL REGISTRATION · APPLICATIONS OPEN
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-foreground">
            Claim your station in <em>the blackout.</em>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Eight hours of pure building. Register your squad or enter as a solo builder. All submissions are
            stored directly in the organizer system.
          </p>

          {/* Quick Organizer Portal link badge */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              ✦ {totalCount} Builder{totalCount === 1 ? '' : 's'} registered so far
            </span>
            <span className="text-muted-foreground/40">·</span>
            <a
              href="/admin"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <Terminal className="w-3.5 h-3.5" /> Organizer Admin Portal <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative bg-card/85 backdrop-blur-xl border border-sky-200/80 dark:border-sky-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {submittedPass ? (
            /* =================== SUCCESS: OFFICIAL BUILDER PASS =================== */
            <div className="max-w-xl mx-auto py-4 text-center animate-fadeIn space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shadow-md">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                  ✦ APPLICATION CONFIRMED & STORED
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">
                  You are registered for Blackout!
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Your application has been received and logged into the Buildicy organizer database. Keep your
                  Builder Pass ID safe.
                </p>
              </div>

              {/* The Holographic Boarding Pass Card */}
              <div className="relative mx-auto max-w-md rounded-2xl p-6 bg-gradient-to-br from-[#021b33] via-[#04294a] to-[#021324] text-white border-2 border-amber-400/70 shadow-2xl overflow-hidden text-left">
                {/* Gold Foil Header Ribbon */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span className="font-display font-bold tracking-wider text-base text-amber-300">
                      BUILDICY · BLACKOUT PASS
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {submittedPass.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono">
                  <div>
                    <span className="text-white/60 block text-[10px]">BUILDER NAME</span>
                    <strong className="text-white text-sm font-sans font-semibold block truncate">
                      {submittedPass.fullName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px]">PASS NUMBER</span>
                    <strong className="text-amber-300 text-sm font-mono font-bold tracking-wider block">
                      {submittedPass.id}
                    </strong>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px]">SQUAD / TEAM</span>
                    <span className="text-white font-medium block truncate">
                      {submittedPass.teamName}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px]">ASSIGNED ROLE</span>
                    <span className="text-sky-300 uppercase font-bold block">
                      {submittedPass.role}
                    </span>
                  </div>
                </div>

                {/* Barcode & Verification row */}
                <div className="border-t border-dashed border-white/20 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-9 h-9 text-amber-300/90" />
                    <div className="text-[10px] font-mono text-white/60 leading-tight">
                      <span>VERIFIED ENTRY</span>
                      <br />
                      <span className="text-white/40">DAY 01 · 8-HOUR SPRINT</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    {copied ? 'Copied!' : 'Copy Pass ID'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Register Another Builder
                </Button>
                <a href="/admin">
                  <Button variant="hero" size="sm">
                    Open Organizer Portal <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            /* =================== FORM: APPLICATION ENTRY =================== */
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Personal Identity */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-4">
                  <User className="w-4 h-4" /> 01 · BUILDER IDENTITY
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-foreground mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ada Lovelace"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-foreground mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ada@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-foreground mb-1">
                      GitHub or Portfolio URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-foreground mb-1">
                      Experience Level
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    >
                      <option value="beginner">First-time Hacker (Eager to learn)</option>
                      <option value="intermediate">Intermediate Builder (Built projects)</option>
                      <option value="advanced">Seasoned Pro (Rapid prototyping veteran)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Role / Superpower Selection */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">
                  <Palette className="w-4 h-4" /> 02 · SELECT YOUR BUILDER SUPERPOWER
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Which craft describes your primary strength during the 8-hour sprint?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          playStickerPop(500);
                          setRole(r.id);
                        }}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 select-none ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-500 shadow-md ring-2 ring-sky-400/30'
                            : 'bg-background/80 border-border hover:border-sky-300 dark:hover:border-sky-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? 'bg-sky-500 text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            {r.badge}
                          </span>
                        </div>
                        <h4 className="font-display font-semibold text-foreground text-sm">
                          {r.label}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                          {r.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Squad & Motivation */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-4">
                  <Users className="w-4 h-4" /> 03 · SQUAD FORMATION & MOTIVATION
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/60">
                    <input
                      type="checkbox"
                      id="soloCheckbox"
                      checked={isSolo}
                      onChange={(e) => {
                        playStickerPop(460);
                        setIsSolo(e.target.checked);
                      }}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor="soloCheckbox" className="text-xs sm:text-sm text-foreground cursor-pointer font-medium">
                      I am registering as a <strong>Solo Builder / Free Agent</strong> (Buildicy will connect you with peers if desired)
                    </label>
                  </div>

                  {!isSolo && (
                    <div>
                      <label className="block text-xs font-mono font-bold text-foreground mb-1">
                        Squad / Team Name (If already formed)
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Neon Wave Crew"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono font-bold text-foreground mb-1">
                      What are you excited to build or explore? <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Share a glimpse of your skills, an idea you want to bring to life, or what drives you to build in the dark..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-foreground mb-1">
                        T-Shirt Size
                      </label>
                      <select
                        value={tshirtSize}
                        onChange={(e) => setTshirtSize(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                      >
                        <option value="S">S (Small)</option>
                        <option value="M">M (Medium)</option>
                        <option value="L">L (Large)</option>
                        <option value="XL">XL (Extra Large)</option>
                        <option value="XXL">XXL (Double Extra Large)</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreed}
                          onChange={(e) => {
                            playStickerPop(480);
                            setAgreed(e.target.checked);
                          }}
                          className="mt-1 w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-xs text-muted-foreground leading-snug">
                          I agree to the Code of Conduct and accept the unrevealed surprise twist at zero hour.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Instant verification · Stored in persistent organizer log</span>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8"
                >
                  {isSubmitting ? 'Registering Builder...' : 'Complete Registration & Get Pass'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
