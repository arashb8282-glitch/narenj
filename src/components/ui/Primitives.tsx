import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Clock,
  HelpCircle,
  Info,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import { AssignmentStatus, SkillStatus } from '../../data/types';
import { Language, bi, fmtNum, fmtPercent } from '../../utils/format';
import { EmptyStateIllustration } from '../shared/Illustrations';
import { ToastMessage } from '../../app/PrototypeContext';

/* -------------------------------------------------------------------------- */
/* Demo & Unapproved Rule Badges                                              */
/* -------------------------------------------------------------------------- */
export const DemoBadge: React.FC<{
  lang: Language;
  labelFa?: string;
  labelEn?: string;
  variant?: 'demo' | 'unapproved' | 'onDark';
}> = ({ lang, labelFa, labelEn, variant = 'demo' }) => {
  const defaultFa =
    variant === 'unapproved' ? 'پیشنهاد نمونه (مصوب‌نشده)' : 'DEMO DATA • داده نمونه';
  const defaultEn = variant === 'unapproved' ? 'Proposed Demo Rule' : 'DEMO DATA';

  const cls =
    variant === 'onDark'
      ? 'bg-accent-500/20 text-accent-200 border-accent-500/40'
      : variant === 'unapproved'
        ? 'bg-lavender-100 text-lavender-700 border-lavender-200'
        : 'bg-accent-100 text-accent-800 border-accent-200';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${cls}`}
    >
      <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{bi(lang, labelFa ?? defaultFa, labelEn ?? defaultEn)}</span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* Button                                                                     */
/* -------------------------------------------------------------------------- */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'cta'
    | 'turquoise'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  iconEnd,
  className = '',
  children,
  type = 'button',
  ...rest
}) => {
  const sizeStyles = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs gap-1.5',
    md: 'min-h-[44px] px-4 py-2 text-sm gap-2',
    lg: 'min-h-[50px] px-6 py-2.5 text-base gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 border border-brand-800/40 shadow-sm',
    cta: 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-700 border border-orange-700/30 shadow-sm',
    turquoise:
      'bg-turquoise-600 text-white hover:bg-turquoise-700 active:bg-turquoise-700 border border-turquoise-700/30 shadow-sm',
    secondary:
      'bg-surface text-ink-900 border border-border-strong hover:bg-turquoise-50 hover:border-turquoise-600 hover:text-brand-800',
    ghost:
      'bg-transparent text-brand-700 hover:bg-turquoise-100/70 hover:text-brand-900 border border-transparent',
    destructive:
      'bg-coral-600 text-white hover:bg-coral-700 border border-transparent shadow-sm',
    accent:
      'bg-accent-500 text-ink-900 hover:bg-accent-600 hover:text-white border border-accent-600/30 font-semibold shadow-sm',
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-control font-semibold transition-all duration-150 active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${sizeStyles} ${variantStyles} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" /> : icon}
      <span>{children}</span>
      {!loading && iconEnd}
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* Card & StatCard                                                            */
/* -------------------------------------------------------------------------- */
export type SurfaceTone =
  | 'white'
  | 'sky'
  | 'cream'
  | 'lavender'
  | 'mint'
  | 'coral'
  | 'apricot'
  | 'navy';

export type AccentTone =
  | 'none'
  | 'brand'
  | 'turquoise'
  | 'orange'
  | 'lavender'
  | 'emerald'
  | 'success'
  | 'sunny'
  | 'accent'
  | 'coral';

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  surfaceTone?: SurfaceTone;
  accentTop?: AccentTone;
  interactive?: boolean;
}> = ({
  children,
  className = '',
  padding = 'md',
  surfaceTone = 'white',
  accentTop = 'none',
  interactive = false,
}) => {
  const pad = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];

  const surfaceCls = {
    white: 'bg-surface border-border',
    sky: 'bg-surface-sky border-turquoise-200',
    cream: 'bg-surface-cream border-accent-200',
    lavender: 'bg-surface-lavender border-lavender-200',
    mint: 'bg-surface-mint border-success-200',
    coral: 'bg-surface-coral border-coral-200',
    apricot: 'bg-orange-50 border-orange-200',
    navy: 'bg-brand-900 text-white border-brand-800',
  }[surfaceTone];

  const topAccentCls = {
    none: '',
    brand: 'border-t-4 border-t-brand-700',
    turquoise: 'border-t-4 border-t-turquoise-500',
    orange: 'border-t-4 border-t-orange-500',
    lavender: 'border-t-4 border-t-lavender-500',
    emerald: 'border-t-4 border-t-success-500',
    success: 'border-t-4 border-t-success-500',
    sunny: 'border-t-4 border-t-accent-500',
    accent: 'border-t-4 border-t-accent-500',
    coral: 'border-t-4 border-t-coral-500',
  }[accentTop];

  return (
    <div
      className={`rounded-card border ${surfaceCls} ${topAccentCls} ${
        interactive ? 'card-interactive' : ''
      } ${pad} ${className}`}
      style={{ boxShadow: 'var(--shadow-subtle)' }}
    >
      {children}
    </div>
  );
};

export const StatCard: React.FC<{
  label: string;
  value: string;
  subtext?: string;
  definition?: string;
  icon?: React.ReactNode;
  demoTag?: string;
  tone?:
    | 'brand'
    | 'turquoise'
    | 'orange'
    | 'emerald'
    | 'success'
    | 'lavender'
    | 'sunny'
    | 'accent'
    | 'coral';
}> = ({ label, value, subtext, definition, icon, demoTag, tone = 'turquoise' }) => {
  const normalizedTone =
    tone === 'success'
      ? 'emerald'
      : tone === 'accent'
        ? 'sunny'
        : tone === 'brand'
          ? 'turquoise'
          : tone;

  const toneStyles = {
    turquoise: {
      iconBox: 'bg-turquoise-100 text-turquoise-700 border-turquoise-200',
      accent: 'turquoise' as const,
      tint: 'bg-gradient-to-b from-turquoise-50/55 to-surface',
    },
    orange: {
      iconBox: 'bg-orange-100 text-orange-700 border-orange-200',
      accent: 'orange' as const,
      tint: 'bg-gradient-to-b from-orange-50/55 to-surface',
    },
    emerald: {
      iconBox: 'bg-success-100 text-success-700 border-success-200',
      accent: 'emerald' as const,
      tint: 'bg-gradient-to-b from-success-50/55 to-surface',
    },
    lavender: {
      iconBox: 'bg-lavender-100 text-lavender-700 border-lavender-200',
      accent: 'lavender' as const,
      tint: 'bg-gradient-to-b from-lavender-50/55 to-surface',
    },
    sunny: {
      iconBox: 'bg-accent-100 text-accent-800 border-accent-200',
      accent: 'sunny' as const,
      tint: 'bg-gradient-to-b from-accent-50/65 to-surface',
    },
    coral: {
      iconBox: 'bg-coral-100 text-coral-700 border-coral-200',
      accent: 'coral' as const,
      tint: 'bg-gradient-to-b from-coral-50/55 to-surface',
    },
  }[normalizedTone];

  return (
    <Card
      padding="md"
      accentTop={toneStyles.accent}
      className={`flex flex-col justify-between gap-2.5 ${toneStyles.tint}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="typo-caption font-semibold text-ink-700">{label}</span>
        {icon && (
          <div className={`p-2.5 rounded-control border ${toneStyles.iconBox}`}>{icon}</div>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">{value}</div>
      {(subtext || demoTag) && (
        <div className="flex flex-wrap items-center justify-between gap-1 pt-1.5 border-t border-border/70">
          {subtext && <span className="typo-caption font-medium">{subtext}</span>}
          {demoTag && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent-100/80 text-accent-800 border border-accent-200">
              {demoTag}
            </span>
          )}
        </div>
      )}
      {definition && <p className="text-xs text-ink-600 leading-relaxed">{definition}</p>}
    </Card>
  );
};

/* -------------------------------------------------------------------------- */
/* Badge & StatusPill (Color + Icon + Label — never color alone!)             */
/* -------------------------------------------------------------------------- */
export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'turquoise'
  | 'orange'
  | 'accent'
  | 'success'
  | 'lavender'
  | 'coral'
  | 'warning'
  | 'danger';

export const Badge: React.FC<{
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: React.ReactNode;
}> = ({ children, tone = 'neutral', icon }) => {
  const styles: Record<BadgeTone, string> = {
    neutral: 'bg-canvas text-ink-700 border-border-strong',
    brand: 'bg-brand-100 text-brand-800 border-brand-200',
    turquoise: 'bg-turquoise-100 text-turquoise-700 border-turquoise-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    accent: 'bg-accent-100 text-accent-800 border-accent-200',
    success: 'bg-success-100 text-success-700 border-success-200',
    lavender: 'bg-lavender-100 text-lavender-700 border-lavender-200',
    coral: 'bg-coral-100 text-coral-700 border-coral-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    danger: 'bg-coral-100 text-coral-700 border-coral-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[tone]}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};

export const SkillStatusPill: React.FC<{ status: SkillStatus; lang: Language }> = ({
  status,
  lang,
}) => {
  const map: Record<
    SkillStatus,
    { fa: string; en: string; tone: BadgeTone; icon: React.ReactNode }
  > = {
    not_started: {
      fa: 'شروع‌نشده',
      en: 'Not Started',
      tone: 'neutral',
      icon: <CircleDashed className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    in_progress: {
      fa: 'در حال تمرین',
      en: 'In Progress',
      tone: 'turquoise',
      icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    mastered: {
      fa: 'مسلط (نمونه)',
      en: 'Mastered (Demo)',
      tone: 'success',
      icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    needs_review: {
      fa: 'نیازمند مرور',
      en: 'Needs Review',
      tone: 'orange',
      icon: <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />,
    },
  };
  const cfg = map[status];
  return (
    <Badge tone={cfg.tone} icon={cfg.icon}>
      {bi(lang, cfg.fa, cfg.en)}
    </Badge>
  );
};

export const AssignmentStatusPill: React.FC<{ status: AssignmentStatus; lang: Language }> = ({
  status,
  lang,
}) => {
  const map: Record<
    AssignmentStatus,
    {
      fa: string;
      en: string;
      tone: BadgeTone;
      icon: React.ReactNode;
    }
  > = {
    upcoming: {
      fa: 'پیش‌رو',
      en: 'Upcoming',
      tone: 'lavender',
      icon: <Calendar className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    assigned: {
      fa: 'تخصیص‌یافته',
      en: 'Assigned',
      tone: 'brand',
      icon: <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    in_progress: {
      fa: 'در حال انجام',
      en: 'In Progress',
      tone: 'turquoise',
      icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    overdue: {
      fa: 'دیرشده از موعد',
      en: 'Overdue',
      tone: 'coral',
      icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    completed: {
      fa: 'تکمیل‌شده',
      en: 'Completed',
      tone: 'success',
      icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    completed_late: {
      fa: 'تکمیل با تأخیر',
      en: 'Completed Late',
      tone: 'orange',
      icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    cancelled: {
      fa: 'لغوشده',
      en: 'Cancelled',
      tone: 'neutral',
      icon: <XCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    },
  };
  const cfg = map[status];
  return (
    <Badge tone={cfg.tone} icon={cfg.icon}>
      {bi(lang, cfg.fa, cfg.en)}
    </Badge>
  );
};

/* -------------------------------------------------------------------------- */
/* Breadcrumbs, PageHeader, SectionHeader                                     */
/* -------------------------------------------------------------------------- */
export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[]; lang: Language }> = ({
  items,
  lang,
}) => {
  const Separator = lang === 'fa' ? ChevronLeft : ChevronRight;
  return (
    <nav aria-label={bi(lang, 'مسیر صفحه', 'Breadcrumb')} className="mb-2.5">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-ink-600">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="inline-flex items-center gap-1.5">
              {idx > 0 && (
                <Separator className="w-3.5 h-3.5 text-ink-400 shrink-0" aria-hidden="true" />
              )}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-turquoise-700 hover:underline font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-semibold text-brand-800' : ''}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  lang: Language;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: 'sky' | 'cream' | 'lavender' | 'plain';
}> = ({ title, subtitle, breadcrumbs, lang, actions, badge, icon, tone = 'sky' }) => {
  const bgMap = {
    sky: 'bg-gradient-to-l from-surface-sky via-surface to-turquoise-50/60 border border-turquoise-200/80 p-5 sm:p-6 rounded-cardLg',
    cream:
      'bg-gradient-to-l from-surface-cream via-surface to-orange-50/50 border border-accent-200 p-5 sm:p-6 rounded-cardLg',
    lavender:
      'bg-gradient-to-l from-surface-lavender via-surface to-turquoise-50/40 border border-lavender-200 p-5 sm:p-6 rounded-cardLg',
    plain: 'pb-2 border-b border-border',
  }[tone];

  return (
    <header className={`mb-6 ${bgMap}`}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} lang={lang} />}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {icon && (
            <div className="w-11 h-11 rounded-card bg-turquoise-100 text-brand-900 border border-turquoise-200 flex items-center justify-center shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="typo-page-title">{title}</h1>
              {badge}
            </div>
            {subtitle && <p className="typo-body text-ink-600 max-w-3xl">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </header>
  );
};

export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  accentColor?:
    | 'none'
    | 'brand'
    | 'turquoise'
    | 'orange'
    | 'lavender'
    | 'emerald'
    | 'success'
    | 'sunny'
    | 'accent'
    | 'coral';
}> = ({ title, subtitle, action, accentColor = 'turquoise' }) => {
  const barCls = {
    none: 'bg-turquoise-500',
    brand: 'bg-brand-700',
    turquoise: 'bg-turquoise-500',
    orange: 'bg-orange-500',
    lavender: 'bg-lavender-500',
    emerald: 'bg-success-500',
    success: 'bg-success-500',
    sunny: 'bg-accent-500',
    accent: 'bg-accent-500',
    coral: 'bg-coral-500',
  }[accentColor];

  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
      <div className="flex items-start gap-2.5">
        <span className={`w-1.5 h-6 rounded-full mt-1 shrink-0 ${barCls}`} aria-hidden="true" />
        <div>
          <h2 className="typo-section-title">{title}</h2>
          {subtitle && <p className="typo-caption mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* SearchInput, Select, Tabs, ProgressBar, Avatar, Tooltip                    */
/* -------------------------------------------------------------------------- */
export const SearchInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ id, label, value, onChange, placeholder, className = '' }) => (
  <div className={`relative ${className}`}>
    <label htmlFor={id} className="sr-only">
      {label}
    </label>
    <Search
      className="w-4 h-4 text-turquoise-700 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none"
      aria-hidden="true"
    />
    <input
      id={id}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[44px] ps-10 pe-9 py-2 bg-surface border border-border-strong rounded-control text-sm text-ink-900 placeholder:text-ink-400 focus:border-turquoise-600 focus:ring-2 focus:ring-turquoise-100 focus:outline-none transition-all"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute top-1/2 -translate-y-1/2 end-2.5 p-1 rounded hover:bg-canvas text-ink-600"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

export const SelectField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  hideLabel?: boolean;
  className?: string;
}> = ({ id, label, value, onChange, options, hideLabel = false, className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label
      htmlFor={id}
      className={hideLabel ? 'sr-only' : 'text-xs font-semibold text-ink-700'}
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[44px] px-3 py-2 bg-surface border border-border-strong rounded-control text-sm font-medium text-ink-900 focus:border-turquoise-600 focus:ring-2 focus:ring-turquoise-100 focus:outline-none transition-all cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const Tabs: React.FC<{
  tabs: { id: string; label: string; count?: string | number }[];
  activeId: string;
  onChange: (id: string) => void;
}> = ({ tabs, activeId, onChange }) => (
  <div
    role="tablist"
    className="inline-flex flex-wrap items-center gap-1 p-1 rounded-control bg-brand-50 border border-brand-200"
  >
    {tabs.map((tab) => {
      const active = tab.id === activeId;
      return (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={active}
          onClick={() => onChange(tab.id)}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-[8px] text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 ${
            active
              ? 'bg-brand-700 text-white shadow-sm'
              : 'text-ink-700 hover:text-brand-800 hover:bg-surface/70'
          }`}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={`px-2 py-0.2 rounded-full text-xs font-bold ${
                active ? 'bg-accent-500 text-ink-900' : 'bg-white text-brand-700'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export const ProgressBar: React.FC<{
  value: number;
  lang: Language;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  tone?:
    | 'brand'
    | 'turquoise'
    | 'orange'
    | 'success'
    | 'accent'
    | 'lavender'
    | 'coral'
    | 'warning';
}> = ({ value, lang, label, showValue = true, size = 'sm', tone = 'turquoise' }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor = {
    brand: 'bg-brand-600',
    turquoise: 'bg-gradient-to-l from-turquoise-500 to-brand-600',
    orange: 'bg-gradient-to-l from-orange-500 to-accent-500',
    success: 'bg-gradient-to-l from-success-500 to-turquoise-600',
    accent: 'bg-accent-500',
    lavender: 'bg-lavender-500',
    coral: 'bg-coral-500',
    warning: 'bg-orange-500',
  }[tone];

  const trackColor = {
    brand: 'bg-brand-100',
    turquoise: 'bg-turquoise-100',
    orange: 'bg-orange-100',
    success: 'bg-success-100',
    accent: 'bg-accent-100',
    lavender: 'bg-lavender-100',
    coral: 'bg-coral-100',
    warning: 'bg-orange-100',
  }[tone];

  const heightCls = size === 'md' ? 'h-3.5' : 'h-2.5';

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
          {label && <span className="text-ink-600 font-medium">{label}</span>}
          {showValue && (
            <span className="font-bold text-ink-900 shrink-0">{fmtPercent(clamped, lang)}</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={`w-full ${heightCls} ${trackColor} rounded-full overflow-hidden`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export const Avatar: React.FC<{
  name: string;
  role?: 'student' | 'teacher';
  size?: 'sm' | 'md' | 'lg';
}> = ({ name, role = 'student', size = 'md' }) => {
  const initials = name.trim().slice(0, 2);
  const dims = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];
  return (
    <div
      aria-hidden="true"
      className={`${dims} rounded-full flex items-center justify-center font-bold shrink-0 border-2 ${
        role === 'student'
          ? 'bg-turquoise-100 text-turquoise-700 border-turquoise-200'
          : 'bg-brand-800 text-accent-200 border-turquoise-500/50'
      }`}
    >
      {initials}
    </div>
  );
};

export const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="group relative inline-flex items-center align-middle ms-1">
    <button
      type="button"
      aria-label={text}
      className="text-ink-400 hover:text-turquoise-700 focus:text-turquoise-700 rounded-full p-0.5"
    >
      <HelpCircle className="w-4 h-4" />
    </button>
    <span
      role="tooltip"
      className="hidden group-hover:block group-focus-within:block pointer-events-none absolute bottom-full mb-2 end-0 z-40 w-56 p-2.5 rounded-control bg-brand-950 text-white text-xs leading-relaxed shadow-lg"
    >
      {text}
    </span>
  </span>
);

/* -------------------------------------------------------------------------- */
/* Modal, Drawer, ToastContainer                                              */
/* -------------------------------------------------------------------------- */
export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
}> = ({ open, onClose, title, children, footer, maxWidthClass = 'max-w-lg' }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full ${maxWidthClass} bg-surface rounded-cardLg border border-border overflow-hidden animate-feedback-in`}
        style={{ boxShadow: 'var(--shadow-floating)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-surface-sky border-b border-turquoise-200">
          <h3 id="modal-title" className="typo-card-title text-brand-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-control hover:bg-white text-ink-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 bg-canvas border-t border-border flex flex-wrap items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Drawer: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-brand-950/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-surface h-full flex flex-col border-s border-border"
        style={{ boxShadow: 'var(--shadow-floating)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-surface-sky border-b border-turquoise-200">
          <h3 className="typo-card-title text-brand-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-control hover:bg-white text-ink-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  lang: Language;
  onDismiss: (id: string) => void;
}> = ({ toasts, lang, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-5 end-4 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)]"
    >
      {toasts.map((t) => {
        const toneMap = {
          success: 'border-success-600 bg-surface text-ink-900',
          warning: 'border-orange-500 bg-surface text-ink-900',
          danger: 'border-coral-600 bg-surface text-ink-900',
          info: 'border-turquoise-600 bg-surface text-ink-900',
        }[t.tone];
        const Icon = {
          success: CheckCircle2,
          warning: AlertTriangle,
          danger: AlertCircle,
          info: Info,
        }[t.tone];
        const iconColor = {
          success: 'text-success-600',
          warning: 'text-orange-600',
          danger: 'text-coral-600',
          info: 'text-turquoise-600',
        }[t.tone];
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-card border-s-4 border animate-feedback-in ${toneMap}`}
            style={{ boxShadow: 'var(--shadow-floating)' }}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
            <p className="text-sm font-medium flex-1">{bi(lang, t.textFa, t.textEn)}</p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
              className="text-ink-400 hover:text-ink-900 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* EmptyState, ErrorState, Skeleton, Pagination                               */
/* -------------------------------------------------------------------------- */
export const EmptyState: React.FC<{
  title: string;
  description: string;
  variant?: 'search' | 'classroom' | 'chart';
  action?: React.ReactNode;
}> = ({ title, description, variant = 'search', action }) => (
  <Card padding="lg" surfaceTone="sky" className="text-center max-w-xl mx-auto my-4">
    <EmptyStateIllustration variant={variant} />
    <h3 className="typo-card-title mt-4">{title}</h3>
    <p className="typo-body text-ink-600 mt-1.5 mb-5">{description}</p>
    {action && <div className="flex justify-center">{action}</div>}
  </Card>
);

export const ErrorState: React.FC<{
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}> = ({ title, description, retryLabel, onRetry }) => (
  <Card padding="lg" surfaceTone="coral" className="max-w-xl mx-auto my-4 text-center">
    <div className="w-12 h-12 rounded-full bg-coral-100 text-coral-700 flex items-center justify-center mx-auto mb-3 border border-coral-200">
      <AlertCircle className="w-6 h-6" aria-hidden="true" />
    </div>
    <h3 className="typo-card-title text-ink-900">{title}</h3>
    <p className="typo-body text-ink-600 mt-1.5 mb-4">{description}</p>
    <Button variant="secondary" onClick={onRetry} icon={<RotateCcw className="w-4 h-4" />}>
      {retryLabel}
    </Button>
  </Card>
);

export const PageSkeleton: React.FC = () => (
  <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Loading">
    <div className="h-28 bg-turquoise-100/60 border border-turquoise-200 rounded-cardLg" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-32 bg-surface border border-border rounded-card p-5" />
      <div className="h-32 bg-orange-50/70 border border-orange-200 rounded-card p-5" />
      <div className="h-32 bg-lavender-50/70 border border-lavender-200 rounded-card p-5" />
    </div>
    <div className="h-64 bg-surface border border-border rounded-card" />
  </div>
);

export const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  lang: Language;
}> = ({ currentPage, totalPages, onPageChange, lang }) => {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border mt-4"
    >
      <span className="typo-caption font-medium">
        {lang === 'fa'
          ? `صفحه ${fmtNum(currentPage, 'fa')} از ${fmtNum(totalPages, 'fa')}`
          : `Page ${currentPage} of ${totalPages}`}
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {bi(lang, 'قبلی', 'Previous')}
        </Button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[38px] h-9 rounded-control text-xs font-bold border transition-colors ${
                p === currentPage
                  ? 'bg-turquoise-600 text-white border-turquoise-700'
                  : 'bg-surface text-ink-900 border-border hover:bg-turquoise-50'
              }`}
            >
              {fmtNum(p, lang)}
            </button>
          );
        })}
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {bi(lang, 'بعدی', 'Next')}
        </Button>
      </div>
    </nav>
  );
};

/* -------------------------------------------------------------------------- */
/* QuestionOption, AnswerInput, FeedbackPanel, ChartPanel                     */
/* -------------------------------------------------------------------------- */
export const QuestionOption: React.FC<{
  id: string;
  indexLabel: string;
  label: string;
  selected: boolean;
  disabled?: boolean;
  feedbackState?: 'correct' | 'wrong_selected' | 'idle';
  onSelect: () => void;
}> = ({ indexLabel, label, selected, disabled, feedbackState = 'idle', onSelect }) => {
  let stateClass =
    'border-border-strong bg-surface hover:border-turquoise-500 hover:bg-turquoise-50/60';
  let badgeClass = 'bg-brand-50 text-brand-800 border-brand-200';

  if (feedbackState === 'correct') {
    stateClass = 'border-success-600 bg-success-50 ring-2 ring-success-500/40';
    badgeClass = 'bg-success-600 text-white border-success-600';
  } else if (feedbackState === 'wrong_selected') {
    stateClass = 'border-coral-600 bg-coral-50 ring-2 ring-coral-500/35';
    badgeClass = 'bg-coral-600 text-white border-coral-600';
  } else if (selected) {
    stateClass = 'border-turquoise-600 bg-turquoise-50 ring-2 ring-turquoise-500/40 shadow-sm';
    badgeClass = 'bg-turquoise-600 text-white border-turquoise-600';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full min-h-[60px] text-start p-4 rounded-card border-2 transition-all duration-150 flex items-center justify-between gap-3 disabled:cursor-default ${stateClass}`}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={`w-9 h-9 rounded-control flex items-center justify-center text-sm font-bold shrink-0 border transition-colors ${badgeClass}`}
        >
          {indexLabel}
        </span>
        <span className="text-base font-semibold text-ink-900" dir="auto">
          {label}
        </span>
      </div>
      {feedbackState === 'correct' && (
        <CheckCircle2 className="w-5 h-5 text-success-600 shrink-0" aria-hidden="true" />
      )}
      {feedbackState === 'wrong_selected' && (
        <AlertCircle className="w-5 h-5 text-coral-600 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
};

export const AnswerInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}> = ({ id, label, value, onChange, disabled, placeholder }) => (
  <div className="max-w-xs">
    <label htmlFor={id} className="block text-sm font-semibold text-ink-900 mb-2">
      {label}
    </label>
    <input
      id={id}
      type="text"
      inputMode="decimal"
      dir="ltr"
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[52px] px-4 py-2.5 text-lg font-bold text-center bg-surface border-2 border-turquoise-200 rounded-control focus:border-turquoise-600 focus:ring-2 focus:ring-turquoise-100 focus:outline-none disabled:bg-canvas"
    />
  </div>
);

export const FeedbackPanel: React.FC<{
  isCorrect: boolean;
  lang: Language;
  studentAnswerDisplay: string;
  correctAnswerDisplay: string;
  explanation: string;
  solvingSteps: string[];
  onContinue: () => void;
  isLastQuestion?: boolean;
}> = ({
  isCorrect,
  lang,
  studentAnswerDisplay,
  correctAnswerDisplay,
  explanation,
  solvingSteps,
  onContinue,
  isLastQuestion = false,
}) => (
  <section
    aria-live="polite"
    className={`mt-6 rounded-cardLg border-2 p-5 sm:p-6 animate-feedback-in ${
      isCorrect
        ? 'bg-surface-mint border-success-500'
        : 'bg-orange-50 border-orange-500'
    }`}
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
      <div className="flex items-start gap-3.5">
        {isCorrect ? (
          <div className="w-11 h-11 rounded-card bg-success-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-card bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
        <div>
          <h3 className="typo-card-title text-lg">
            {isCorrect
              ? bi(lang, 'آفرین آوا! پاسخت کاملاً درست است.', 'Great work, Ava! Your answer is correct.')
              : bi(
                  lang,
                  'نزدیک بودی! بیا با هم روش حل درست را مرور کنیم.',
                  'Good try! Let’s walk through the solving method together.'
                )}
          </h3>
          <p className="typo-caption text-ink-900 mt-1">{explanation}</p>
        </div>
      </div>
      <Button
        variant={isCorrect ? 'primary' : 'cta'}
        size="lg"
        onClick={onContinue}
        className="w-full sm:w-auto shrink-0"
      >
        {isLastQuestion
          ? bi(lang, 'مشاهده جمع‌بندی تمرین', 'View Session Summary')
          : bi(lang, 'سؤال بعدی', 'Next Question')}
      </Button>
    </div>

    {!isCorrect && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="p-3.5 rounded-control bg-surface border border-coral-200">
          <span className="typo-caption block">{bi(lang, 'پاسخ انتخابی تو:', 'Your answer:')}</span>
          <strong className="text-base text-coral-700" dir="auto">
            {studentAnswerDisplay}
          </strong>
        </div>
        <div className="p-3.5 rounded-control bg-surface border-2 border-success-500/60">
          <span className="typo-caption block">{bi(lang, 'پاسخ صحیح:', 'Correct answer:')}</span>
          <strong className="text-base text-success-700" dir="auto">
            {correctAnswerDisplay}
          </strong>
        </div>
      </div>
    )}

    <div className="mt-4 bg-surface rounded-card border border-border p-4">
      <h4 className="text-sm font-bold text-turquoise-700 mb-2">
        {bi(lang, 'روش حل گام‌به‌گام:', 'Step-by-step solution:')}
      </h4>
      <ol className="space-y-2 text-sm text-ink-900 list-none">
        {solvingSteps.map((step, i) => (
          <li key={i} className="leading-relaxed flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-turquoise-500 mt-2.5 shrink-0" />
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export const ChartPanel: React.FC<{
  title: string;
  subtitle?: string;
  lang: Language;
  legendItems: { label: string; colorClass: string }[];
  bars: { label: string; primaryValue: number; secondaryValue?: number; unitSuffix?: string }[];
  maxVal?: number;
  primaryColorClass?: string;
  secondaryColorClass?: string;
}> = ({
  title,
  subtitle,
  lang,
  legendItems,
  bars,
  maxVal = 100,
  primaryColorClass,
  secondaryColorClass,
}) => (
  <Card padding="md" accentTop="turquoise">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="typo-card-title">{title}</h3>
          <DemoBadge lang={lang} />
        </div>
        {subtitle && <p className="typo-caption mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-700 bg-canvas px-3 py-1.5 rounded-full border border-border self-start">
        {legendItems.map((leg, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${leg.colorClass}`} aria-hidden="true" />
            <span>{leg.label}</span>
          </span>
        ))}
      </div>
    </div>

    <div
      className="grid gap-1.5 sm:gap-4 items-end h-56 pt-8 pb-3 px-2 sm:px-4 bg-gradient-to-b from-surface-sky/60 to-surface rounded-card border border-turquoise-200/70"
      style={{ gridTemplateColumns: `repeat(${Math.max(1, bars.length)}, minmax(0, 1fr))` }}
    >
      {bars.map((bar, idx) => {
        const h1 = Math.max(
          bar.primaryValue > 0 ? 12 : 4,
          Math.round((bar.primaryValue / maxVal) * 136)
        );
        const h2 =
          bar.secondaryValue !== undefined
            ? Math.max(
                bar.secondaryValue > 0 ? 12 : 4,
                Math.round((bar.secondaryValue / 100) * 136)
              )
            : null;
        return (
          <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5 min-w-0">
            <div className="flex flex-col items-center leading-tight">
              <span className="text-[11px] font-bold text-brand-800 whitespace-nowrap">
                {fmtNum(bar.primaryValue, lang)}
                {bar.unitSuffix ?? ''}
              </span>
              {bar.secondaryValue !== undefined && bar.secondaryValue > 0 && (
                <span className="text-[10px] font-semibold text-ink-600 hidden sm:inline">
                  {fmtPercent(bar.secondaryValue, lang)}
                </span>
              )}
            </div>
            <div className="flex items-end justify-center gap-1 sm:gap-1.5 w-full">
              <div
                className={`w-3.5 sm:w-6 rounded-t-md transition-all duration-500 ${
                  primaryColorClass ?? 'bg-gradient-to-t from-brand-700 to-turquoise-500'
                }`}
                style={{ height: `${h1}px` }}
                title={`${bar.label}: ${bar.primaryValue}`}
              />
              {h2 !== null && (
                <div
                  className={`w-2.5 sm:w-4 rounded-t-md transition-all duration-500 ${
                    secondaryColorClass ?? 'bg-gradient-to-t from-orange-600 to-accent-500'
                  }`}
                  style={{ height: `${h2}px` }}
                  title={`${bar.secondaryValue}%`}
                />
              )}
            </div>
            <span className="text-[10px] sm:text-xs text-ink-700 font-semibold text-center truncate w-full pt-1 border-t border-border/60">
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  </Card>
);
