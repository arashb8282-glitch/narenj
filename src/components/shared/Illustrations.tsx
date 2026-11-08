import React from 'react';
import { Language, fmtNum } from '../../utils/format';

export const RoshanaBrandMark: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
    className="shrink-0"
  >
    <rect width="64" height="64" rx="16" fill="#245B73" />
    <path
      d="M18 44V26C18 20.477 22.477 16 28 16H46V34C46 39.523 41.523 44 36 44H18Z"
      fill="#E7F2F5"
      fillOpacity="0.18"
    />
    <circle cx="40" cy="24" r="7" fill="#F2A541" />
    <path
      d="M18 43C24 34 31 30 46 30"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M22 49H42"
      stroke="#E7F2F5"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.75"
    />
  </svg>
);

export const StudentHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 340 190"
    fill="none"
    aria-hidden="true"
    className={`w-full max-w-[310px] h-auto ${className}`}
  >
    {/* Background soft geometric plate */}
    <rect x="10" y="14" width="320" height="162" rx="18" fill="#E7F2F5" />
    <circle cx="62" cy="48" r="26" fill="#FFFFFF" fillOpacity="0.7" />
    <circle cx="282" cy="46" r="20" fill="#F2A541" fillOpacity="0.22" />
    <circle cx="282" cy="46" r="9" fill="#F2A541" />

    {/* Dotted discovery trajectory */}
    <path
      d="M48 142C92 98 140 118 184 74C214 44 250 56 282 46"
      stroke="#2F7891"
      strokeWidth="2.5"
      strokeDasharray="5 5"
    />

    {/* Open notebook & fraction bars */}
    <rect
      x="34"
      y="76"
      width="116"
      height="78"
      rx="10"
      fill="#FFFFFF"
      stroke="#245B73"
      strokeWidth="2.2"
    />
    <line x1="92" y1="76" x2="92" y2="154" stroke="#DCE4E8" strokeWidth="2" />
    {/* Fraction visual inside left page */}
    <rect x="46" y="90" width="34" height="10" rx="3" fill="#245B73" />
    <rect x="46" y="106" width="16" height="10" rx="3" fill="#F2A541" />
    <rect x="64" y="106" width="16" height="10" rx="3" fill="#E7F2F5" stroke="#2F7891" strokeWidth="1.2" />
    <rect x="46" y="124" width="26" height="6" rx="3" fill="#DCE4E8" />
    {/* Grid on right page */}
    <rect x="102" y="90" width="36" height="36" rx="5" fill="#F3F8FA" stroke="#2F7891" strokeWidth="1.6" />
    <line x1="120" y1="90" x2="120" y2="126" stroke="#C8DFE6" strokeWidth="1.4" />
    <line x1="102" y1="108" x2="138" y2="108" stroke="#C8DFE6" strokeWidth="1.4" />
    <rect x="103" y="91" width="17" height="17" rx="3" fill="#27845D" fillOpacity="0.3" />
    <rect x="120" y="91" width="17" height="17" rx="3" fill="#27845D" fillOpacity="0.3" />
    <rect x="103" y="108" width="17" height="17" rx="3" fill="#F2A541" fillOpacity="0.45" />

    {/* Set-square / geometry triangle & compass */}
    <polygon
      points="196,154 246,72 296,154"
      fill="#FFFFFF"
      stroke="#245B73"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <polygon
      points="218,141 246,96 274,141"
      fill="#2F7891"
      fillOpacity="0.16"
      stroke="#2F7891"
      strokeWidth="1.5"
    />
    {/* Protractor arc */}
    <path
      d="M160 154C160 131.909 177.909 114 200 114C222.091 114 240 131.909 240 154"
      fill="#F2A541"
      fillOpacity="0.22"
      stroke="#245B73"
      strokeWidth="2"
    />
    <circle cx="184" cy="74" r="7" fill="#27845D" stroke="#FFFFFF" strokeWidth="2" />
  </svg>
);

export const TopicIllustration: React.FC<{
  kind: 'fractions' | 'decimals' | 'geometry' | 'ratios' | 'data';
  size?: number;
}> = ({ kind, size = 64 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true" className="shrink-0">
      <rect width="72" height="72" rx="16" fill="#E7F2F5" />
      {kind === 'fractions' && (
        <>
          <circle cx="36" cy="36" r="20" fill="#FFFFFF" stroke="#245B73" strokeWidth="2.4" />
          <path d="M36 36L36 16A20 20 0 0 1 56 36Z" fill="#F2A541" />
          <path d="M36 36L56 36A20 20 0 0 1 36 56Z" fill="#2F7891" fillOpacity="0.45" />
          <line x1="16" y1="36" x2="56" y2="36" stroke="#245B73" strokeWidth="2" />
          <line x1="36" y1="16" x2="36" y2="56" stroke="#245B73" strokeWidth="2" />
        </>
      )}
      {kind === 'decimals' && (
        <>
          <rect x="16" y="16" width="40" height="40" rx="6" fill="#FFFFFF" stroke="#245B73" strokeWidth="2.2" />
          <rect x="18" y="18" width="18" height="36" rx="2" fill="#2F7891" fillOpacity="0.3" />
          <rect x="36" y="18" width="9" height="18" rx="2" fill="#F2A541" fillOpacity="0.7" />
          <line x1="36" y1="16" x2="36" y2="56" stroke="#245B73" strokeWidth="1.6" />
          <line x1="16" y1="36" x2="56" y2="36" stroke="#245B73" strokeWidth="1.6" />
          <circle cx="36" cy="48" r="3" fill="#245B73" />
        </>
      )}
      {kind === 'geometry' && (
        <>
          <polygon
            points="20,52 38,18 56,52"
            fill="#FFFFFF"
            stroke="#245B73"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <rect
            x="16"
            y="34"
            width="20"
            height="20"
            rx="3"
            fill="#F2A541"
            fillOpacity="0.35"
            stroke="#245B73"
            strokeWidth="2"
          />
        </>
      )}
      {kind === 'ratios' && (
        <>
          <line x1="20" y1="52" x2="52" y2="52" stroke="#245B73" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="36,38 30,52 42,52" fill="#2F7891" />
          <line x1="18" y1="32" x2="54" y2="26" stroke="#245B73" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="22" cy="24" r="6" fill="#F2A541" />
          <rect x="44" y="15" width="10" height="10" rx="2" fill="#27845D" />
        </>
      )}
      {kind === 'data' && (
        <>
          <rect x="18" y="38" width="8" height="16" rx="2" fill="#2F7891" />
          <rect x="32" y="26" width="8" height="28" rx="2" fill="#245B73" />
          <rect x="46" y="20" width="8" height="34" rx="2" fill="#F2A541" />
          <line x1="14" y1="54" x2="58" y2="54" stroke="#245B73" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export const QuestionVisualDiagram: React.FC<{
  visualType?: 'fraction_bars' | 'decimal_grid' | 'geometry_rect' | 'number_line';
  lang: Language;
  widthCm?: number;
  heightCm?: number;
}> = ({ visualType, lang, widthCm = 8, heightCm = 5 }) => {
  if (!visualType) return null;

  if (visualType === 'fraction_bars') {
    return (
      <div className="my-4 rounded-card bg-brand-50 border border-border p-4">
        <div className="typo-caption mb-3 font-semibold text-brand-700">
          {lang === 'fa'
            ? 'نمایش تصویری هم‌مخرج‌کردن روی نوار کسری:'
            : 'Visual fraction bar model:'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center" dir="ltr">
          <div>
            <div className="text-xs font-semibold text-ink-600 mb-1">1/2 = 2/4</div>
            <div className="grid grid-cols-4 h-9 rounded-control overflow-hidden border-2 border-brand-700 bg-white">
              <div className="bg-brand-600 border-r border-white/60" />
              <div className="bg-brand-600 border-r border-brand-700" />
              <div className="border-r border-border" />
              <div />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-ink-600 mb-1">+ 1/4</div>
            <div className="grid grid-cols-4 h-9 rounded-control overflow-hidden border-2 border-brand-700 bg-white">
              <div className="bg-accent-500 border-r border-brand-700" />
              <div className="border-r border-border" />
              <div className="border-r border-border" />
              <div />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'decimal_grid') {
    return (
      <div className="my-4 rounded-card bg-brand-50 border border-border p-4 flex flex-col sm:flex-row items-center gap-4">
        <svg width="116" height="116" viewBox="0 0 100 100" className="shrink-0 bg-white rounded border border-brand-700">
          {/* 4 columns (0.4) */}
          <rect x="0" y="0" width="40" height="100" fill="#2F7891" fillOpacity="0.22" />
          {/* 3 rows (0.3) */}
          <rect x="0" y="0" width="100" height="30" fill="#F2A541" fillOpacity="0.28" />
          {/* Overlap 4x3 = 12 squares (0.12) */}
          <rect x="0" y="0" width="40" height="30" fill="#27845D" fillOpacity="0.55" />
          {Array.from({ length: 9 }).map((_, i) => {
            const pos = (i + 1) * 10;
            return (
              <React.Fragment key={i}>
                <line x1={pos} y1="0" x2={pos} y2="100" stroke="#DCE4E8" strokeWidth="0.8" />
                <line x1="0" y1={pos} x2="100" y2={pos} stroke="#DCE4E8" strokeWidth="0.8" />
              </React.Fragment>
            );
          })}
        </svg>
        <div className="typo-caption text-ink-900">
          {lang === 'fa'
            ? 'در شبکه ۱۰۰ تایی، هم‌پوشانی ۴ ستون (۰/۴) و ۳ ردیف (۰/۳) به رنگ سبز مشخص شده است (۱۲ خانه از ۱۰۰ خانه).'
            : 'On the 100-grid, the overlap of 4 columns (0.4) and 3 rows (0.3) covers 12 out of 100 squares.'}
        </div>
      </div>
    );
  }

  if (visualType === 'geometry_rect') {
    return (
      <div className="my-4 rounded-card bg-brand-50 border border-border p-4 flex justify-center">
        <svg width="240" height="130" viewBox="0 0 240 130" fill="none">
          <rect
            x="44"
            y="28"
            width="152"
            height="82"
            rx="6"
            fill="#E8F4EE"
            stroke="#245B73"
            strokeWidth="2.5"
          />
          <text x="120" y="20" textAnchor="middle" fill="#202B33" fontSize="13" fontWeight="600">
            {lang === 'fa' ? `طول = ${fmtNum(widthCm, 'fa')} متر` : `Length = ${widthCm} m`}
          </text>
          <text x="206" y="72" textAnchor="start" fill="#202B33" fontSize="13" fontWeight="600">
            {lang === 'fa' ? `${fmtNum(heightCm, 'fa')} متر` : `${heightCm} m`}
          </text>
        </svg>
      </div>
    );
  }

  return null;
};

export const EmptyStateIllustration: React.FC<{ variant?: 'search' | 'classroom' | 'chart' }> = ({
  variant = 'search',
}) => (
  <svg width="136" height="96" viewBox="0 0 180 124" fill="none" aria-hidden="true" className="mx-auto">
    <rect x="26" y="16" width="128" height="92" rx="14" fill="#F5F7F8" stroke="#DCE4E8" strokeWidth="2" />
    {variant === 'search' && (
      <>
        <rect x="44" y="36" width="62" height="8" rx="4" fill="#DCE4E8" />
        <rect x="44" y="52" width="84" height="8" rx="4" fill="#E7F2F5" />
        <rect x="44" y="68" width="46" height="8" rx="4" fill="#DCE4E8" />
        <circle cx="132" cy="84" r="16" fill="#E7F2F5" stroke="#2F7891" strokeWidth="2.2" />
        <path d="M144 96L155 107" stroke="#245B73" strokeWidth="3" strokeLinecap="round" />
      </>
    )}
    {variant === 'classroom' && (
      <>
        <rect x="46" y="34" width="88" height="44" rx="6" fill="#FFFFFF" stroke="#2F7891" strokeWidth="1.8" />
        <line x1="60" y1="50" x2="116" y2="50" stroke="#DCE4E8" strokeWidth="2" />
        <line x1="60" y1="62" x2="96" y2="62" stroke="#E7F2F5" strokeWidth="2" />
        <circle cx="66" cy="92" r="8" fill="#DCE4E8" />
        <circle cx="90" cy="92" r="8" fill="#E7F2F5" stroke="#2F7891" strokeWidth="1.5" />
        <circle cx="114" cy="92" r="8" fill="#DCE4E8" />
      </>
    )}
    {variant === 'chart' && (
      <>
        <rect x="52" y="68" width="14" height="22" rx="3" fill="#DCE4E8" />
        <rect x="78" y="52" width="14" height="38" rx="3" fill="#E7F2F5" stroke="#2F7891" strokeWidth="1.5" />
        <rect x="104" y="60" width="14" height="30" rx="3" fill="#DCE4E8" />
        <line x1="42" y1="90" x2="138" y2="90" stroke="#87959E" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const AvatarSymbolGraphic: React.FC<{
  symbol: 'telescope' | 'compass' | 'owl' | 'prism' | 'planet' | 'crown';
  bgColor?: string;
  size?: number;
}> = ({ symbol, bgColor = '#245B73', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true" className="shrink-0">
    <rect width="72" height="72" rx="20" fill={bgColor} />
    <circle cx="36" cy="36" r="26" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.5" />
    {symbol === 'compass' && (
      <>
        <polygon points="36,16 43,36 36,40 29,36" fill="#F2A541" />
        <polygon points="36,56 43,36 36,32 29,36" fill="#E7F2F5" />
        <circle cx="36" cy="36" r="4" fill="#FFFFFF" />
      </>
    )}
    {symbol === 'telescope' && (
      <>
        <path d="M22 44L46 24L52 31L27 50Z" fill="#F2A541" />
        <line x1="34" y1="44" x2="26" y2="56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="44" x2="42" y2="56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="20" r="3" fill="#FFFFFF" />
      </>
    )}
    {symbol === 'prism' && (
      <>
        <polygon points="36,16 54,50 18,50" fill="#E7F2F5" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="2.5" />
        <polygon points="36,16 54,50 36,43" fill="#F2A541" fillOpacity="0.8" />
      </>
    )}
    {symbol === 'owl' && (
      <>
        <rect x="22" y="22" width="28" height="30" rx="14" fill="#E7F2F5" />
        <circle cx="30" cy="34" r="5" fill="#245B73" />
        <circle cx="42" cy="34" r="5" fill="#245B73" />
        <polygon points="36,37 32,43 40,43" fill="#F2A541" />
      </>
    )}
    {symbol === 'planet' && (
      <>
        <circle cx="36" cy="36" r="13" fill="#F2A541" />
        <ellipse
          cx="36"
          cy="36"
          rx="24"
          ry="7"
          transform="rotate(-20 36 36)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
      </>
    )}
    {symbol === 'crown' && (
      <polygon points="18,48 22,26 36,36 50,26 54,48" fill="#F2A541" stroke="#FFFFFF" strokeWidth="2" />
    )}
  </svg>
);

export const CelebrationIllustration: React.FC = () => (
  <svg width="160" height="120" viewBox="0 0 160 120" fill="none" aria-hidden="true" className="mx-auto">
    <circle cx="80" cy="60" r="46" fill="#E8F4EE" />
    <circle cx="80" cy="60" r="32" fill="#27845D" />
    <path
      d="M66 61L76 71L96 50"
      stroke="#FFFFFF"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="32" r="5" fill="#F2A541" />
    <circle cx="128" cy="28" r="6" fill="#2F7891" />
    <circle cx="132" cy="86" r="4" fill="#F2A541" />
    <circle cx="28" cy="84" r="4" fill="#27845D" />
  </svg>
);
