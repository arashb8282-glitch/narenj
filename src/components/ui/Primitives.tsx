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
  variant?: 'demo' | 'unapproved';
}> = ({ lang, labelFa, labelEn, variant = 'demo' }) => {
  const defaultFa = variant === 'demo' ? 'DEMO DATA • داده نمونه' : 'پیشنهاد نمونه (مصوب‌نشده)';
  const defaultEn = variant === 'demo' ? 'DEMO DATA' : 'Proposed Demo Rule';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
        variant === 'demo'
          ? 'bg-accent-100 text-accent-700 border-accent-200'
          : 'bg-brand-50 text-brand-700 border-brand-200'
      }`}
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
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'accent';
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
    sm: 'min-h-[36px] px-3 py-1.5 text-xs gap-1.5',
    md: 'min-h-[42px] px-4 py-2 text-sm gap-2',
    lg: 'min-h-[48px] px-5 py-2.5 text-base gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-800 border border-transparent shadow-sm',
    secondary:
      'bg-surface text-ink-900 border border-border hover:bg-brand-50 hover:border-brand-600',
    ghost: 'bg-transparent text-brand-700 hover:bg-brand-100 border border-transparent',
    destructive:
      'bg-danger-600 text-white hover:opacity-95 border border-transparent',
    accent:
      'bg-accent-500 text-ink-900 hover:brightness-95 border border-accent-700/20 font-semibold',
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-control font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${className}`}
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
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, className = '', padding = 'md' }) => {
  const pad = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];
  return (
    <div
      className={`bg-surface rounded-card border border-border ${pad} ${className}`}
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
}> = ({ label, value, subtext, definition, icon, demoTag }) => (
  <Card padding="md" className="flex flex-col justify-between gap-2">
    <div className="flex items-start justify-between gap-2">
      <span className="typo-caption font-semibold text-ink-600">{label}</span>
      {icon && <div className="p-2 rounded-control bg-brand-50 text-brand-700">{icon}</div>}
    </div>
    <div className="text-2xl sm:text-3xl font-semibold text-ink-900 tracking-tight">{value}</div>
    {(subtext || demoTag) && (
      <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-border/60">
        {subtext && <span className="typo-caption">{subtext}</span>}
        {demoTag && (
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-canvas text-ink-600 border border-border">
            {demoTag}
          </span>
        )}
      </div>
    )}
    {definition && <p className="text-xs text-ink-600 leading-relaxed">{definition}</p>}
  </Card>
);

/* -------------------------------------------------------------------------- */
/* Badge & StatusPill (Color + Icon + Label — never color alone!)             */
/* -------------------------------------------------------------------------- */
export const Badge: React.FC<{
  children: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}> = ({ children, tone = 'neutral', icon }) => {
  const styles = {
    neutral: 'bg-canvas text-ink-600 border-border',
    brand: 'bg-brand-100 text-brand-700 border-brand-200',
    accent: 'bg-accent-100 text-accent-700 border-accent-200',
    success: 'bg-success-100 text-success-600 border-success-600/25',
    warning: 'bg-warning-100 text-warning-600 border-warning-600/25',
    danger: 'bg-danger-100 text-danger-600 border-danger-600/25',
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}
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
    { fa: string; en: string; tone: 'neutral' | 'brand' | 'success' | 'warning'; icon: React.ReactNode }
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
      tone: 'brand',
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
      tone: 'warning',
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
      tone: 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger';
      icon: React.ReactNode;
    }
  > = {
    upcoming: {
      fa: 'پیش‌رو',
      en: 'Upcoming',
      tone: 'neutral',
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
      tone: 'brand',
      icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    overdue: {
      fa: 'دیرشده از موعد',
      en: 'Overdue',
      tone: 'danger',
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
      tone: 'warning',
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
    <nav aria-label={bi(lang, 'مسیر صفحه', 'Breadcrumb')} className="mb-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-ink-600">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="inline-flex items-center gap-1.5">
              {idx > 0 && <Separator className="w-3.5 h-3.5 text-ink-400 shrink-0" aria-hidden="true" />}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-brand-700 hover:underline font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-semibold text-ink-900' : ''}>{item.label}</span>
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
}> = ({ title, subtitle, breadcrumbs, lang, actions, badge }) => (
  <header className="mb-6">
    {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} lang={lang} />}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="typo-page-title">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="typo-body text-ink-600 max-w-3xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  </header>
);

export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
    <div>
      <h2 className="typo-section-title">{title}</h2>
      {subtitle && <p className="typo-caption mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

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
      className="w-4 h-4 text-ink-600 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none"
      aria-hidden="true"
    />
    <input
      id={id}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[42px] ps-10 pe-9 py-2 bg-surface border border-border rounded-control text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none"
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
      className={hideLabel ? 'sr-only' : 'text-xs font-semibold text-ink-600'}
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[42px] px-3 py-2 bg-surface border border-border rounded-control text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
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
    className="inline-flex flex-wrap items-center gap-1 p-1 rounded-control bg-canvas border border-border"
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
          className={`min-h-[36px] px-3.5 py-1.5 rounded-[6px] text-sm font-semibold transition-colors inline-flex items-center gap-2 ${
            active
              ? 'bg-surface text-brand-700 shadow-sm border border-border/70'
              : 'text-ink-600 hover:text-ink-900'
          }`}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-xs ${
                active ? 'bg-brand-100 text-brand-700' : 'bg-border/60 text-ink-600'
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
  tone?: 'brand' | 'success' | 'accent' | 'warning';
}> = ({ value, lang, label, showValue = true, tone = 'brand' }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor = {
    brand: 'bg-brand-600',
    success: 'bg-success-600',
    accent: 'bg-accent-500',
    warning: 'bg-warning-600',
  }[tone];

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="text-ink-600 font-medium">{label}</span>}
          {showValue && <span className="font-semibold text-ink-900">{fmtPercent(clamped, lang)}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className="w-full h-2.5 bg-brand-100 rounded-full overflow-hidden"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
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
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];
  return (
    <div
      aria-hidden="true"
      className={`${dims} rounded-full flex items-center justify-center font-semibold shrink-0 border ${
        role === 'student'
          ? 'bg-brand-100 text-brand-700 border-brand-200'
          : 'bg-brand-700 text-white border-brand-800'
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
      className="text-ink-400 hover:text-brand-700 focus:text-brand-700 rounded-full p-0.5"
    >
      <HelpCircle className="w-4 h-4" />
    </button>
    <span
      role="tooltip"
      className="hidden group-hover:block group-focus-within:block pointer-events-none absolute bottom-full mb-2 end-0 z-40 w-56 p-2.5 rounded-control bg-ink-900 text-white text-xs leading-relaxed shadow-lg"
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/45"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full ${maxWidthClass} bg-surface rounded-cardLg border border-border overflow-hidden`}
        style={{ boxShadow: 'var(--shadow-floating)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 id="modal-title" className="typo-card-title">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-control hover:bg-canvas text-ink-600"
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
    <div className="fixed inset-0 z-50 flex justify-end bg-ink-900/40" role="dialog" aria-modal="true">
      <div
        className="w-full max-w-xl bg-surface h-full flex flex-col border-s border-border"
        style={{ boxShadow: 'var(--shadow-floating)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="typo-card-title">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-control hover:bg-canvas text-ink-600"
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
      className="fixed bottom-4 end-4 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)]"
    >
      {toasts.map((t) => {
        const toneMap = {
          success: 'border-success-600 bg-surface text-ink-900',
          warning: 'border-warning-600 bg-surface text-ink-900',
          danger: 'border-danger-600 bg-surface text-ink-900',
          info: 'border-brand-600 bg-surface text-ink-900',
        }[t.tone];
        const Icon = {
          success: CheckCircle2,
          warning: AlertTriangle,
          danger: AlertCircle,
          info: Info,
        }[t.tone];
        const iconColor = {
          success: 'text-success-600',
          warning: 'text-warning-600',
          danger: 'text-danger-600',
          info: 'text-brand-600',
        }[t.tone];
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-3.5 rounded-card border-s-4 border ${toneMap}`}
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
  <Card padding="lg" className="text-center max-w-xl mx-auto my-4">
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
  <Card padding="lg" className="border-danger-600/40 bg-danger-100/35 max-w-xl mx-auto my-4 text-center">
    <div className="w-12 h-12 rounded-full bg-danger-100 text-danger-600 flex items-center justify-center mx-auto mb-3">
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
    <div className="h-8 w-64 bg-border/80 rounded-control" />
    <div className="h-4 w-96 max-w-full bg-border/60 rounded-control" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-32 bg-surface border border-border rounded-card p-5" />
      <div className="h-32 bg-surface border border-border rounded-card p-5" />
      <div className="h-32 bg-surface border border-border rounded-card p-5" />
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
      className="flex items-center justify-between gap-3 pt-4 border-t border-border mt-4"
    >
      <span className="typo-caption">
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
              className={`min-w-[36px] h-9 rounded-control text-xs font-semibold border ${
                p === currentPage
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-surface text-ink-900 border-border hover:bg-brand-50'
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
  let stateClass = 'border-border bg-surface hover:border-brand-600 hover:bg-brand-50/50';
  if (feedbackState === 'correct') {
    stateClass = 'border-success-600 bg-success-100/70 ring-1 ring-success-600';
  } else if (feedbackState === 'wrong_selected') {
    stateClass = 'border-danger-600 bg-danger-100/60 ring-1 ring-danger-600';
  } else if (selected) {
    stateClass = 'border-brand-700 bg-brand-100 ring-1 ring-brand-700';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full text-start p-4 rounded-card border-2 transition-all flex items-center justify-between gap-3 disabled:cursor-default ${stateClass}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 border ${
            selected
              ? 'bg-brand-700 text-white border-brand-700'
              : 'bg-canvas text-ink-900 border-border'
          }`}
        >
          {indexLabel}
        </span>
        <span className="text-base font-medium text-ink-900" dir="auto">
          {label}
        </span>
      </div>
      {feedbackState === 'correct' && (
        <CheckCircle2 className="w-5 h-5 text-success-600 shrink-0" aria-hidden="true" />
      )}
      {feedbackState === 'wrong_selected' && (
        <AlertCircle className="w-5 h-5 text-danger-600 shrink-0" aria-hidden="true" />
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
      className="w-full min-h-[48px] px-4 py-2.5 text-lg font-semibold text-center bg-surface border-2 border-border rounded-control focus:border-brand-700 focus:outline-none disabled:bg-canvas"
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
    className={`mt-6 rounded-cardLg border-2 p-5 sm:p-6 ${
      isCorrect
        ? 'bg-success-100/55 border-success-600'
        : 'bg-warning-100/60 border-warning-600'
    }`}
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/80">
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <div className="w-10 h-10 rounded-full bg-success-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-warning-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
        <div>
          <h3 className="typo-card-title">
            {isCorrect
              ? bi(lang, 'آفرین آوا! پاسخت کاملاً درست است.', 'Great work, Ava! Your answer is correct.')
              : bi(
                  lang,
                  'نزدیک بودی! بیا با هم روش حل درست را مرور کنیم.',
                  'Good try! Let’s walk through the solving method together.'
                )}
          </h3>
          <p className="typo-caption text-ink-900 mt-0.5">{explanation}</p>
        </div>
      </div>
      <Button
        variant="primary"
        size="lg"
        onClick={onContinue}
        className="shrink-0"
      >
        {isLastQuestion
          ? bi(lang, 'مشاهده جمع‌بندی تمرین', 'View Session Summary')
          : bi(lang, 'سؤال بعدی', 'Next Question')}
      </Button>
    </div>

    {!isCorrect && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="p-3 rounded-control bg-surface border border-border">
          <span className="typo-caption block">{bi(lang, 'پاسخ انتخابی تو:', 'Your answer:')}</span>
          <strong className="text-sm text-danger-600" dir="auto">
            {studentAnswerDisplay}
          </strong>
        </div>
        <div className="p-3 rounded-control bg-surface border border-success-600/50">
          <span className="typo-caption block">{bi(lang, 'پاسخ صحیح:', 'Correct answer:')}</span>
          <strong className="text-sm text-success-600" dir="auto">
            {correctAnswerDisplay}
          </strong>
        </div>
      </div>
    )}

    <div className="mt-4 bg-surface rounded-control border border-border p-4">
      <h4 className="text-sm font-semibold text-brand-700 mb-2">
        {bi(lang, 'روش حل گام‌به‌گام:', 'Step-by-step solution:')}
      </h4>
      <ol className="space-y-1.5 text-sm text-ink-900 list-none">
        {solvingSteps.map((step, i) => (
          <li key={i} className="leading-relaxed">
            {step}
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
}> = ({ title, subtitle, lang, legendItems, bars, maxVal = 100 }) => (
  <Card padding="md">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="typo-card-title">{title}</h3>
          <DemoBadge lang={lang} />
        </div>
        {subtitle && <p className="typo-caption mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-ink-600">
        {legendItems.map((leg, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${leg.colorClass}`} aria-hidden="true" />
            <span>{leg.label}</span>
          </span>
        ))}
      </div>
    </div>

    <div
      className="grid gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 px-2 bg-canvas/70 rounded-control border border-border/70"
      style={{ gridTemplateColumns: `repeat(${Math.max(1, bars.length)}, minmax(0, 1fr))` }}
    >
      {bars.map((bar, idx) => {
        const h1 = Math.max(bar.primaryValue > 0 ? 10 : 3, Math.round((bar.primaryValue / maxVal) * 120));
        const h2 =
          bar.secondaryValue !== undefined
            ? Math.max(bar.secondaryValue > 0 ? 10 : 3, Math.round((bar.secondaryValue / 100) * 120))
            : null;
        return (
          <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5">
            <span className="text-[11px] font-semibold text-ink-900">
              {fmtNum(bar.primaryValue, lang)}
              {bar.unitSuffix ?? ''}
            </span>
            <div className="flex items-end justify-center gap-1 w-full">
              <div
                className="w-4 sm:w-6 bg-brand-600 rounded-t transition-all"
                style={{ height: `${h1}px` }}
                title={`${bar.label}: ${bar.primaryValue}`}
              />
              {h2 !== null && (
                <div
                  className="w-3 sm:w-4 bg-accent-500 rounded-t transition-all"
                  style={{ height: `${h2}px` }}
                  title={`${bar.secondaryValue}%`}
                />
              )}
            </div>
            <span className="text-[11px] sm:text-xs text-ink-600 font-medium text-center truncate w-full">
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  </Card>
);
